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
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.open !== nextProps.open && nextProps.open) {
            this.setState({
                ...this.state,
                consoleHistory : []
            });
        }
    }

    render() {
        const { open, handleClose } = this.props;
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
            const { consoleHistory, commandHistory } = this.state;

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
                    if (response.options && response.options.id) {
                        terminalCommandAction.postUnlockRequest(response)
                            .then(postOk => {
                                consoleHistory.push({
                                    command,
                                    response : postOk.text,
                                    text : "",
                                    status : "ok",
                                    isProgress : true
                                });

                                this.setState({
                                    ...this.state,
                                    command : "",
                                    consoleHistory,
                                    commandHistory,
                                    canInput : false,
                                    historyPosition : null
                                }, this._progress);
                            })
                            .catch(postError => {
                                consoleHistory.push({
                                    command,
                                    response : postError,
                                    text : postError,
                                    status : "ko",
                                    isProgress : false
                                });

                                this.setState({
                                    ...this.state,
                                    command : "",
                                    consoleHistory,
                                    commandHistory,
                                    canInput : true,
                                    historyPosition : null
                                }, this._progress);
                            });
                    } else {
                        consoleHistory.push({
                            command,
                            response : response.text,
                            text : response.isProgress ? "" : response.text,
                            status : "ok",
                            isProgress : response.isProgress,
                            progressStep : response.progressStep
                        });

                        this.setState({
                            ...this.state,
                            command : "",
                            consoleHistory,
                            commandHistory,
                            canInput : false,
                            historyPosition : null
                        }, this._progress);
                    }

                }).catch(response => {
                    consoleHistory.push({
                        command,
                        text : response.text,
                        status : "ko",
                        isProgress : false
                    });

                    this.setState({
                        ...this.state,
                        command : "",
                        consoleHistory,
                        commandHistory,
                        canInput : true,
                        historyPosition : null
                    });
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

}

TerminalDialog.propTypes = {
    open : PropTypes.bool.isRequired,
    handleClose : PropTypes.func.isRequired
};


export default connect(state => assign({}, {
    riddleStatus: state.riddleStatus
}), dispatch => ({
    terminalCommandAction: bindActionCreators(TerminalCommandAction, dispatch)
}))(TerminalDialog);
