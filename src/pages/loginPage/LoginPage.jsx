import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import './LoginPage.css';
import LoginComment from "./LoginComment";

const styles = theme => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
    },
});

class LoginPage extends Component {

    state = {
        passwordValue : "",
        loginValue : "",
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

    _handleTextFieldChange(e, field) {
        let { passwordValue, loginValue } = this.state;

        if (field === "login") {
            loginValue = e.target.value;
        } else {
            passwordValue = e.target.value;
        }

        this.setState({
            ...this.state,
            passwordValue,
            loginValue
        });
    }

    _handleTextFieldKeyPress(e) {
        if (e.key === 'Enter') {
            const { loginValue, passwordValue } = this.state;
            this.props.onValidate(loginValue, passwordValue);
        }
    }

    render() {
        const { classes, onValidate } = this.props;
        const { disableTime, loginValue, passwordValue } = this.state;

        return (
            <div id={"log"}>
                <LoginComment text={"Password : glados"}
                              fakeText={"TODO : remove hard coded password"} />

                <Paper className={classes.root} elevation={1}>
                    <h1>
                         Accès à l'extranet
                    </h1>
                    <TextField
                        id="userName"
                        label={"Utilisateur"}
                        value={loginValue}
                        onChange={(e) => this._handleTextFieldChange(e, "login")}
                        onKeyPress={this._handleTextFieldKeyPress}
                        disabled={ !!disableTime }
                        fullWidth
                    />
                    <TextField
                        id="password"
                        label={"Mot de passe"}
                        value={passwordValue}
                        onChange={(e) => this._handleTextFieldChange(e, "password")}
                        onKeyPress={this._handleTextFieldKeyPress}
                        disabled={ !!disableTime }
                        type="password"
                        fullWidth
                    />
                    <div id={"log_actions"}>
                        {
                            disableTime && <span id={"log__disableTime"}>00:{ disableTime < 10 ? "0" + disableTime : disableTime }</span>
                        }
                        <Button variant="contained"
                                color="primary"
                                onClick={ () => onValidate(loginValue, passwordValue) }
                                disabled={ !!disableTime }
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