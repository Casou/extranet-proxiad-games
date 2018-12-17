import React from 'react';
import PropTypes from 'prop-types';
import '../style/SpecialPeopleDialog.css';
import Dialog from "@material-ui/core/Dialog/Dialog";
import {handleCommand} from "../action/handleCommand";

class SpecialPeopleDialog extends React.Component {

    state = {
        command : "",
        commandHistory : []
    };

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
        const { command, commandHistory } = this.state;

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
                            <span dangerouslySetInnerHTML={{__html: c.response}}
                                  className={c.status === "ok" ? "" : "errorCommand"}></span>
                        </span>)
                }
                <div>
                    <span>$ root@extranet > </span>
                    <input type={"text"}
                           onChange={this._onChange.bind(this)}
                           onKeyPress={this._onKeyPressed.bind(this)}
                           value={command} />
                </div>
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
                        response : response,
                        status : "ok"
                    });

                    this.setState({
                        ...this.state,
                        command : "",
                        commandHistory
                    });
                }).catch(error => {
                    commandHistory.push({
                        command,
                        response : error,
                        status : "ko"
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

}

/*
<span id={"commandInput"} contentEditable={true}
                          suppressContentEditableWarning
                          onKeyPress={this.onKeyPressed}
                          ref={ instance => this.commandInput = instance }>
                    </span>
                    <span>_</span>
 */

SpecialPeopleDialog.propTypes = {
    open : PropTypes.bool.isRequired,
    handleClose : PropTypes.func.isRequired
};

export default SpecialPeopleDialog;