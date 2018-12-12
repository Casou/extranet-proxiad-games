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
        snackbarOpen : true
    };

    constructor(props) {
        super(props);
        this.handleCloseSnackbar = this.handleCloseSnackbar.bind(this);
    }

    handleCloseSnackbar(event, reason) {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({...this.state, snackbarOpen: false });
    }

    render() {
        const { classes, onValidate } = this.props;

        return (
            <div id={"log"}>
                <Paper className={classes.root} elevation={1}>
                    <h1>
                         Vous devez saisir le mot de passe pour avoir accès au portfolio
                    </h1>
                    <TextField
                        id="password"
                        placeholder={"Mot de passe"}
                        inputRef={ node => this.passwordRef = node}
                        fullWidth
                    />
                    <div id={"log_actions"}>
                        <Button variant="contained"
                                color="primary"
                                onClick={ () => onValidate(this.passwordRef.value) }>
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
    onValidate : PropTypes.func.isRequired
};

export default withStyles(styles)(LoginPage);