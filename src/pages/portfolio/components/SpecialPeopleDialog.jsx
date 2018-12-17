import React from 'react';
import PropTypes from 'prop-types';
import '../style/SpecialPeopleDialog.css';
import Dialog from "@material-ui/core/Dialog/Dialog";
import {handleCommand, progressbar} from "../action/handleCommand";

class SpecialPeopleDialog extends React.Component {

    state = {
        command : "",
        commandHistory : [],
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
                commandHistory : []
            });
        }
    }

    render() {
        const { open, handleClose } = this.props;
        const { command, commandHistory, canInput } = this.state;

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
                <div>
                    Welcome to IA Root domain.<br/>
                    Type 'help' to list all the commandHistory.<br/>
                    ---
                </div>

                {
                    commandHistory.map(c =>
                        <span>
                            <span>$ root@extranet > { c.command }</span><br/>
                            <span dangerouslySetInnerHTML={{__html: c.text}}
                                  className={c.status === "ok" ? "" : "errorCommand"}></span>
                        </span>)
                }
                {
                    canInput &&
                    <div>
                        <span>$ root@extranet > </span>
                        <input type={"text"}
                               onChange={this._onChange.bind(this)}
                               onKeyPress={this._onKeyPressed.bind(this)}
                               autoFocus={true}
                               value={command} />
                    </div>
                }
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

        if (event.which === 13 || event.keyCode === 13) {
            event.preventDefault();
            const { commandHistory } = this.state;

            if (command === "clean") {
                this.setState({
                    ...this.state,
                    command : "",
                    commandHistory : []
                });
            } else {
                handleCommand(command).then(response => {
                    commandHistory.push({
                        command,
                        response : response.text,
                        text : response.isProgress ? "" : response.text,
                        status : "ok",
                        isProgress : response.isProgress
                    });

                    this.setState({
                        ...this.state,
                        command : "",
                        commandHistory,
                        canInput : false
                    }, this._progress);


                }).catch(response => {
                    commandHistory.push({
                        command,
                        text : response.text,
                        status : "ko",
                        isProgress : false
                    });

                    this.setState({
                        ...this.state,
                        command : "",
                        commandHistory
                    });
                });
            }

            return false;
        }

        this.setState({
            ...this.state,
            command
        });
        return true;
    }

    _progress() {
        const { commandHistory } = this.state;

        const progressIndex = commandHistory.findIndex(cmd => cmd.isProgress);
        if (progressIndex < 0) {
            return;
        }

        setTimeout(() => {
            const progressDto = commandHistory[progressIndex];
            const progressStatus = progressDto.progress || 0;

            progressDto.progress = Math.min(100, progressStatus + Math.round(Math.random() * 10));
            progressDto.isProgress = progressDto.progress < 100;
            if (progressDto.isProgress) {
                progressDto.text = progressbar(progressDto.progress, 30);
            } else {
                progressDto.text = progressbar(progressDto.progress, 30) + "<br/>" + progressDto.response;
            }
            commandHistory[progressIndex] = progressDto;

            this.setState({ ...this.state, commandHistory, canInput : !progressDto.isProgress }, () => {
                this._progress();
            });
        }, 100);
    }

}

SpecialPeopleDialog.propTypes = {
    open : PropTypes.bool.isRequired,
    handleClose : PropTypes.func.isRequired
};

export default SpecialPeopleDialog;