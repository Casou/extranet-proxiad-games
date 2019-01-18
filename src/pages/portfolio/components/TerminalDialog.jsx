import React from 'react';
import PropTypes from 'prop-types';
import '../style/TerminalDialog.css';
import Dialog from "@material-ui/core/Dialog/Dialog";
import {handleCommand, progressbar} from "../action/handleCommand";
import {makeid} from "../../../common/common";
import connect from "react-redux/es/connect/connect";
import {assign} from "lodash";
import {bindActionCreators} from "redux";
import TerminalCommandAction from "../action/TerminalCommandAction";
import axios from "axios";
import AuthorizationActions from "../../loginPage/actions/AuthorizationActions";
import SockJsClient from 'react-stomp';
import {SERVER_URL} from "../../../index";

class TerminalDialog extends React.Component {

    state = {
        command : "",
        commandHistory : [],
        historyPosition : null,
        consoleHistory : [],
        canInput : true
    };

    constructor(props) {
        super(props);

        this._onChange = this._onChange.bind(this);
        this._onKeyPressed = this._onKeyPressed.bind(this);
        this._progress = this._progress.bind(this);
        this._addCommand = this._addCommand.bind(this);
        this._sendWSMessage = this._sendWSMessage.bind(this);

        this.websocketWrapper = null;
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.open !== nextProps.open && nextProps.open) {
            this.setState({
                ...this.state,
                consoleHistory : [],
                canInput : true
            });

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

    render() {
        const { open, handleClose, authorization } = this.props;
        const { command, consoleHistory, canInput } = this.state;

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
                <SockJsClient url={ SERVER_URL + 'ws?token=' + authorization.token}
                              headers={ { "Authorization" : authorization.token } }
                              topics={['/topic/nothing-happens']}
                              onMessage={(msg) => { console.log(msg); }}
                              debug={true}
                              onConnect={ (frame) => { console.log("Connected", frame); this.forceUpdate(); }}
                              ref={ (client) => { this.websocketWrapper = client }} />

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
                                <span>$ root@extranet > { c.command }</span><br/>
                                <span dangerouslySetInnerHTML={{__html: c.text}}
                                      className={c.status === "ok" ? "" : "errorCommand"}></span>
                            </div>)
                    }
                    {
                        canInput &&
                        <div>
                            <span>$ root@extranet > </span>
                            <input type={"text"}
                                   onChange={this._onChange.bind(this)}
                                   onKeyDown={this._onKeyPressed.bind(this)}
                                   autoFocus={true}
                                   value={command} />
                        </div>
                    }
                </main>
            </Dialog>
        );
    }

    _onChange(event) {
        this.setState({
            ...this.state,
            command : event.target.value
        });
    }

    _onKeyPressed(event) {
        const command = event.target.value;
        const { riddleStatus, terminalCommandAction } = this.props;

        if (event.which === 13 || event.keyCode === 13) {
            event.preventDefault();
            const { commandHistory } = this.state;

            commandHistory.push(command);

            if (command === "clean") {
                this.setState({
                    ...this.state,
                    command : "",
                    commandHistory,
                    consoleHistory : []
                });
            } else {
                handleCommand(command, riddleStatus).then(response => {
                    if (response.redpill) {
                        terminalCommandAction.postRedpill().then(() => {
                            this._addCommand({
                                command,
                                response : response.text,
                                text : response.text,
                                status : "ok",
                                isProgress : false
                            }, commandHistory, false, false);
                        })
                        .catch(postError => {
                            this._addCommand({
                                command,
                                response : postError,
                                text : postError,
                                status : "ko",
                                isProgress : false
                            }, commandHistory, true);
                        });
                    } else if (response.unlock && response.unlock.id) {
                        terminalCommandAction.postUnlockRequest(response)
                            .then(postOk => {
                                this._addCommand({
                                    command,
                                    response : postOk.text,
                                    text : "",
                                    status : "ok",
                                    isProgress : true
                                }, commandHistory, false);
                            })
                            .catch(postError => {
                                this._addCommand({
                                    command,
                                    response : postError,
                                    text : postError,
                                    status : "ko",
                                    isProgress : false
                                }, commandHistory, true);
                            });
                    } else {
                        this._addCommand({
                            command,
                            response : response.text,
                            text : response.isProgress ? "" : response.text,
                            status : "ok",
                            isProgress : response.isProgress,
                            progressStep : response.progressStep
                        }, commandHistory, false);
                    }

                }).catch(response => {
                    this._addCommand({
                        command,
                        text : response.text,
                        status : "ko",
                        isProgress : false
                    }, commandHistory, true);
                });
            }

            return false;
        }

        // Up
        if (event.which === 38 || event.keyCode === 38) {
            const { commandHistory, historyPosition } = this.state;

            if (commandHistory.length === 0) {
                return false;
            }
            const newPosition = historyPosition !== null ? Math.max(0, historyPosition - 1) : commandHistory.length - 1;
            this.setState({
                ...this.state,
                historyPosition : newPosition,
                command : commandHistory[newPosition]
            });
            return true;
        }
        
        // Down
        if (event.which === 40 || event.keyCode === 40) {
            const { commandHistory, historyPosition } = this.state;

            if (commandHistory.length === 0) {
                return false;
            }
            const newPosition = historyPosition !== null ? Math.min(commandHistory.length, historyPosition + 1) : commandHistory.length - 1;
            if (newPosition !== historyPosition) {
                this.setState({
                    ...this.state,
                    historyPosition : newPosition,
                    command : commandHistory[newPosition]
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
        const { consoleHistory } = this.state;

        consoleHistory.push(commandToAdd);

        this.setState({
            ...this.state,
            command : "",
            consoleHistory,
            commandHistory,
            canInput,
            historyPosition : null
        }, () => {
            this._sendWSMessage("/terminalCommand", commandToAdd);
            if (launchProgress) {
                this._progress();
            }
        });
    }

    _progress() {
        const { consoleHistory } = this.state;

        const progressIndex = consoleHistory.findIndex(cmd => cmd.isProgress);
        if (progressIndex < 0) {
            this.setState({ ...this.state, canInput : true });
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

            this.setState({ ...this.state, consoleHistory, canInput : !progressDto.isProgress }, () => {
                this._progress();
            });
        }, 100);
    }

    _sendWSMessage(url, parameters) {
        const { open, authorization } = this.props;

        if (open && this.websocketWrapper && this.websocketWrapper.client && this.websocketWrapper.client.connected) {
            this.websocketWrapper.sendMessage(url, JSON.stringify(parameters), { "authorization" : authorization.token });
            // this.websocketWrapper.disconnect();
        }
    }

}

TerminalDialog.propTypes = {
    open : PropTypes.bool.isRequired,
    handleClose : PropTypes.func.isRequired
};


export default connect(state => assign({}, {
    riddleStatus: state.riddleStatus,
    authorization: state.authorization
}), dispatch => ({
    terminalCommandAction: bindActionCreators(TerminalCommandAction, dispatch),
    authorizationAction: bindActionCreators(AuthorizationActions, dispatch)
}))(TerminalDialog);
