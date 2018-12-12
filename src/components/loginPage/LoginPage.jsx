import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';

const styles = theme => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
    },
});

class LoginPage extends Component {

    passwordRef = null;

    state = {
        passwordValue : "",
        snackbarOpen : false,
        disableTime : localStorage.getItem("disableTime")
    };

    constructor(props) {
        super(props);
        this.handleCloseSnackbar = this.handleCloseSnackbar.bind(this);
        this._handleTextFieldChange = this._handleTextFieldChange.bind(this);
        this._handleTextFieldKeyPress = this._handleTextFieldKeyPress.bind(this);
        this._decreaseDisableTime = this._decreaseDisableTime.bind(this);
        this.disableInterval = null;

        if (this.state.disableTime) {
            this.disableInterval = setInterval(this._decreaseDisableTime, 1000);
        }
    }

    handleCloseSnackbar(event, reason) {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({...this.state, snackbarOpen: false });
    }

    wrongPasswordEntered() {
        this.setState({...this.state,
            snackbarOpen: true,
            passwordValue : "",
            disableTime : this.props.timeout
        }, () => {
            localStorage.setItem("disableTime", this.props.timeout);
            this.disableInterval = setInterval(this._decreaseDisableTime, 1000);
        });
    }

    _decreaseDisableTime() {
        const { disableTime } = this.state;

        if (disableTime <= 1) {
            this.setState({
                ...this.state,
                disableTime : null
            });
            clearInterval(this.disableInterval);
            this.disableInterval = null;
            localStorage.removeItem("disableTime");
            return;
        }

        this.setState({...this.state,
            disableTime : disableTime - 1
        });
        localStorage.setItem("disableTime", disableTime - 1);
    }

    _handleTextFieldChange(e) {
        this.setState({
            ...this.state,
            passwordValue: e.target.value
        });
    }

    _handleTextFieldKeyPress(e) {
        if (e.key === 'Enter') {
            this.props.onValidate(e.target.value);
        }
    }

    render() {
        const { classes, onValidate } = this.props;
        const { disableTime, passwordValue } = this.state;

        return (
            <div id={"log"}>
                <Paper className={classes.root} elevation={1}>
                    <h1>
                         Vous devez saisir le mot de passe pour avoir accès à l'extranet
                    </h1>
                    <TextField
                        id="password"
                        placeholder={"Mot de passe"}
                        inputRef={ node => this.passwordRef = node}
                        value={passwordValue}
                        onChange={this._handleTextFieldChange}
                        onKeyPress={this._handleTextFieldKeyPress}
                        disabled={ disableTime }
                        fullWidth
                    />
                    <div id={"log_actions"}>
                        {
                            disableTime && <span id={"log__disableTime"}>{ disableTime }</span>
                        }
                        <Button variant="contained"
                                color="primary"
                                onClick={ () => onValidate(this.passwordRef.value) }
                                disabled={ disableTime }
                        >
                            Valider
                        </Button>
                    </div>
                </Paper>

                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={this.state.snackbarOpen}
                    autoHideDuration={6000}
                    onClose={this.handleCloseSnackbar}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={<span id="message-id">Mauvais mot de passe</span>}
                    action={[
                        <IconButton
                            key="close"
                            aria-label="Close"
                            color="inherit"
                            onClick={this.handleCloseSnackbar}
                        >
                            <CloseIcon />
                        </IconButton>,
                    ]}
                />
            </div>
        );
    }

}

LoginPage.propTypes = {
    classes: PropTypes.object.isRequired,
    onValidate : PropTypes.func.isRequired,
    timeout : PropTypes.number,
    wrongPassword : PropTypes.bool
};

export default withStyles(styles)(LoginPage);