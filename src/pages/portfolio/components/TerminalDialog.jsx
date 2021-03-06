import React from 'react';
import PropTypes from 'prop-types';
import '../style/TerminalDialog.css';
import Dialog from "@material-ui/core/Dialog/Dialog";
import {handleCommand, progressbar} from "../action/handleCommand";
import {lpad, makeCancelable, makeid} from "../../../common/common";
import connect from "react-redux/es/connect/connect";
import {assign} from "lodash";
import {bindActionCreators} from "redux";
import TerminalCommandAction from "../action/TerminalCommandAction";
import axios from "axios";
import AuthorizationActions from "../../loginPage/actions/AuthorizationActions";
import SockJsClient from 'react-stomp';
import {SERVER_URL} from "../../../index";

const KET_CODE_ENTER = 13;
const KET_CODE_ARROW_UP = 38;
const KET_CODE_ARROW_DOWN = 40;

const formatDisableTime = (time) => {
  let totalSeconds = time;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return lpad(minutes) + ":" + lpad(seconds);
};

class TerminalDialog extends React.Component {

  state = {
    command: "",
    commandHistory: [],
    historyPosition: null,
    consoleHistory: [],
    canInput: true,
    terminatorResponse: "...dumb ass...",
    lock: {min: 30, max: 60, step: 10},
    disableTime: localStorage.getItem("terminalDisableTime") ? parseInt(localStorage.getItem("terminalDisableTime")) : null
  };

  constructor(props) {
    super(props);

    this._onChange = this._onChange.bind(this);
    this._onKeyPressed = this._onKeyPressed.bind(this);
    this._progress = this._progress.bind(this);
    this._addCommand = this._addCommand.bind(this);
    this._sendWSMessage = this._sendWSMessage.bind(this);

    this.websocketWrapper = null;
    this.disableInterval = null;

    if (this.state.disableTime) {
      this.setState({canInput: false});
    }
  }

  componentDidMount() {
    const url = SERVER_URL + "parametre";
    this.loadDatePromise = makeCancelable(
      axios.get(url)
      .then(response => {
        if (response.status !== 200) {
          console.error(response);
          return Promise.reject("Error while fetching " + url + " : " + response.status + " " + response.statusText);
        } else {
          return response.data;
        }
      })
    );

    this.loadDatePromise
      .promise
      .then(allParameters => {
        const {terminatorResponse, lock} = this.state;
        const newTerminatorResponse = allParameters.find(p => p.key === "TERMINAL_TERMINATOR_COMMAND_RESPONSE") || {value: terminatorResponse};
        const newMinLockTime = allParameters.find(p => p.key === "TERMINAL_MINIMUM_LOCK_TIME") || {value: lock.min};
        const newMaxLockTime = allParameters.find(p => p.key === "TERMINAL_MAXIMUM_LOCK_TIME") || {value: lock.max};
        const newStepLockTime = allParameters.find(p => p.key === "TERMINAL_LOCK_TIME_STEP") || {value: lock.step};

        this.setState({
          terminatorResponse: `<pre>${newTerminatorResponse.value}</pre>`,
          lock: {
            min: parseInt(newMinLockTime.value),
            max: parseInt(newMaxLockTime.value),
            step: parseInt(newStepLockTime.value)
          }
        })
      })
      .catch(error => console.error(error));
  }

  componentWillUnmount() {
    this.loadDatePromise && this.loadDatePromise.cancel();
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.open !== nextProps.open) {
      if (!nextProps.open) {
        if (this.disableInterval) {
          clearInterval(this.disableInterval);
        }
      } else {
        const disableTime = localStorage.getItem("terminalDisableTime") ? parseInt(localStorage.getItem("terminalDisableTime")) : null;
        this.setState({
          ...this.state,
          consoleHistory: [],
          disableTime,
          canInput: !disableTime
        });

        if (disableTime) {
          this.disableInterval = setInterval(this._decreaseDisableTime, 1000);
        }

        const url = SERVER_URL + "unlock/status";
        axios.get(url)
          .then(response => {
            if (response.status !== 200) {
              console.error(response);
              return Promise.reject("Error while fetching " + url + " : " + response.status + " " + response.statusText);
            } else {
              return response.data;
            }
          })
          .then(response => {
            nextProps.terminalCommandAction.initLockStatus(response);
          })
          .catch((error) => {
            console.error(error);
            nextProps.authorizationAction.unauthorizedToken();
          });
      }
    }
  }

  render() {
    const {open, handleClose, authorization} = this.props;
    const {command, consoleHistory, canInput, disableTime} = this.state;

    let disableMessage = null;
    if (disableTime) {
      disableMessage =
        <span id={"lockedTerminal"}><i className="fa fa-lock"></i> Locked : {formatDisableTime(disableTime)}</span>;
    }

    return (
      <Dialog
        open={open}
        onClose={handleClose}
        scroll={'paper'}
        aria-labelledby="scroll-dialog-title"
        classes={{root: "special_people_dialog", paperScrollPaper: "special_people_dialog__scrollBody"}}
        fullWidth={true}
        maxWidth={'md'}
      >
        <SockJsClient url={SERVER_URL + 'ws?token=' + authorization.token}
                      headers={{"Authorization": authorization.token}}
                      topics={['/topic/nothing-happens']}
                      onMessage={(msg) => {
                        console.log(msg);
                      }}
                      debug={true}
                      onConnect={(frame) => {
                        console.log("Connected", frame);
                        this.forceUpdate();
                      }}
                      ref={(client) => {
                        this.websocketWrapper = client
                      }}/>

        <header>
          Terminal
        </header>
        <main>
          <div>
            Welcome to AI Main domain.<br/>
            Type 'help' to list all the commands.<br/>
            ---
          </div>

          {
            consoleHistory.map(c =>
              <div key={makeid()}>
                <span>$ root@extranet > {c.command}</span><br/>
                <span dangerouslySetInnerHTML={{__html: c.text}}
                      className={c.status === "ok" ? "" : "errorCommand"}/>
              </div>)
          }
          {disableMessage}
          {
            canInput &&
            <div>
              <span>$ root@extranet > </span>
              <input type={"text"}
                     onChange={this._onChange.bind(this)}
                     onKeyDown={this._onKeyPressed.bind(this)}
                     autoFocus={true}
                     value={command}/>
            </div>
          }
        </main>

      </Dialog>
    );
  }

  _onChange(event) {
    this.setState({
      ...this.state,
      command: event.target.value
    });
  }

  _decreaseDisableTime = () => {
    const {disableTime} = this.state;

    if (disableTime <= 0) {
      this.setState({
        canInput: true,
        disableTime: null
      });
      clearInterval(this.disableInterval);
      return;
    }

    const newDisableTime = disableTime - 1;
    this.setState({
      disableTime: newDisableTime
    }, () => {
      localStorage.setItem("terminalDisableTime", newDisableTime + "");
    });
  };

  _onKeyPressed(event) {
    const command = event.target.value;
    const {riddleStatus, terminalCommandAction} = this.props;

    // 13 = Enter
    if (event.which === KET_CODE_ENTER || event.keyCode === KET_CODE_ENTER) {
      event.preventDefault();
      const {commandHistory, terminatorResponse} = this.state;

      commandHistory.push(command);

      if (command === "clean") {
        this.setState({
          ...this.state,
          command: "",
          commandHistory,
          consoleHistory: []
        });
      } else {
        handleCommand(command, riddleStatus).then(response => {
          if (response.redpill) {
            terminalCommandAction.postRedpill().then(() => {
              this._addCommand({
                command,
                response: response.text,
                text: response.text,
                status: "ok",
                isProgress: false
              }, commandHistory, false, false);
            })
              .catch(postError => {
                this._addCommand({
                  command,
                  response: postError,
                  text: postError,
                  status: "ko",
                  isProgress: false
                }, commandHistory, true);
              });
          } else if (response.unlock && response.unlock.id) {
            terminalCommandAction.postUnlockRequest(response)
              .then(postOk => {
                this._addCommand({
                  command,
                  response: postOk.text,
                  text: "",
                  status: "ok",
                  isProgress: true
                }, commandHistory, false);
              })
              .catch(postError => {
                this._addCommand({
                  command,
                  response: postError.data,
                  text: postError.data,
                  status: "ko",
                  isProgress: false
                }, commandHistory, true);

                if (postError.status === 400) {
                  const {lock} = this.state;
                  console.warn(lock);

                  let terminalErrors = (localStorage.getItem("terminalErrors") && parseInt(localStorage.getItem("terminalErrors"))) || 0;
                  const disableTime = Math.min(parseInt(lock.max), parseInt(lock.min) + parseInt(lock.step) * terminalErrors);

                  terminalErrors++;
                  localStorage.setItem("terminalDisableTime", disableTime + "");
                  localStorage.setItem("terminalErrors", terminalErrors + "");
                  this.setState({
                    canInput: false,
                    disableTime: disableTime
                  }, () => {
                    this.disableInterval = setInterval(this._decreaseDisableTime, 1000);
                  });
                }
              });
          } else if (response.terminator) {
            this._addCommand({
              command,
              response: terminatorResponse,
              text: response.isProgress ? "" : terminatorResponse,
              status: "ok",
              isProgress: response.isProgress,
              progressStep: response.progressStep
            }, commandHistory, false);
          } else {
            this._addCommand({
              command,
              response: response.text,
              text: response.isProgress ? "" : response.text,
              status: "ok",
              isProgress: response.isProgress,
              progressStep: response.progressStep
            }, commandHistory, false);
          }

        }).catch(response => {
          this._addCommand({
            command,
            text: response.text,
            status: "ko",
            isProgress: false
          }, commandHistory, true);
        });
      }

      return false;
    }

    if (event.which === KET_CODE_ARROW_UP || event.keyCode === KET_CODE_ARROW_UP) {
      const {commandHistory, historyPosition} = this.state;

      if (commandHistory.length === 0) {
        return false;
      }
      const newPosition = historyPosition !== null ? Math.max(0, historyPosition - 1) : commandHistory.length - 1;
      this.setState({
        ...this.state,
        historyPosition: newPosition,
        command: commandHistory[newPosition]
      });
      return true;
    }

    if (event.which === KET_CODE_ARROW_DOWN || event.keyCode === KET_CODE_ARROW_DOWN) {
      const {commandHistory, historyPosition} = this.state;

      if (commandHistory.length === 0) {
        return false;
      }
      const newPosition = historyPosition !== null ? Math.min(commandHistory.length, historyPosition + 1) : commandHistory.length - 1;
      if (newPosition !== historyPosition) {
        this.setState({
          ...this.state,
          historyPosition: newPosition,
          command: commandHistory[newPosition]
        });
      }

      return true;
    }

    this.setState({
      ...this.state,
      command
    });
    return true;
  }

  _addCommand(commandToAdd, commandHistory, canInput, launchProgress = true) {
    const {consoleHistory} = this.state;

    consoleHistory.push(commandToAdd);

    this.setState({
      ...this.state,
      command: "",
      consoleHistory,
      commandHistory,
      canInput,
      historyPosition: null
    }, () => {
      this._sendWSMessage("/terminalCommand", commandToAdd);
      if (launchProgress) {
        this._progress();
      }
    });
  }

  _progress() {
    const {consoleHistory} = this.state;

    const progressIndex = consoleHistory.findIndex(cmd => cmd.isProgress);
    if (progressIndex < 0) {
      this.setState({...this.state, canInput: true});
      return;
    }

    setTimeout(() => {
      const progressDto = consoleHistory[progressIndex];
      const progressStatus = progressDto.progress || 0;
      const progressStep = progressDto.progressStep || 10;

      progressDto.progress = Math.min(100, progressStatus + Math.round(Math.random() * progressStep));
      progressDto.isProgress = progressDto.progress < 100;
      if (progressDto.isProgress) {
        progressDto.text = progressbar(progressDto.progress, 30);
      } else {
        progressDto.text = progressbar(progressDto.progress, 30) + "<br/>" + progressDto.response;
      }
      consoleHistory[progressIndex] = progressDto;

      this.setState({...this.state, consoleHistory, canInput: !progressDto.isProgress}, () => {
        this._progress();
      });
    }, 100);
  }

  _sendWSMessage(url, parameters) {
    const {open, authorization} = this.props;

    if (open && this.websocketWrapper && this.websocketWrapper.client && this.websocketWrapper.client.connected) {
      this.websocketWrapper.sendMessage(url, JSON.stringify(parameters), {"authorization": authorization.token});
      // this.websocketWrapper.disconnect();
    }
  }

}

TerminalDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired
};


export default connect(state => assign({}, {
  riddleStatus: state.riddleStatus,
  authorization: state.authorization
}), dispatch => ({
  terminalCommandAction: bindActionCreators(TerminalCommandAction, dispatch),
  authorizationAction: bindActionCreators(AuthorizationActions, dispatch)
}))(TerminalDialog);
