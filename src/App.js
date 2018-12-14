import React, {Component} from 'react';
import './App.css';
import Portfolio from "./pages/portfolio/Portfolio";
import LoginPage from "./pages/loginPage/LoginPage";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import AuthorizationActions from "./pages/loginPage/actions/AuthorizationActions";
import {assign} from "lodash";

class App extends Component {

    constructor(props) {
        super(props);
        this.validatePassword = this.validatePassword.bind(this);
        this.loginPage = null;
    }

    validatePassword(password) {
        this.props.authorizationAction.login(password)
            .catch(() => this.loginPage.wrongPasswordEntered());
    }

    render() {
        const { authorization } = this.props;

        return (
            <div id={"app"}>
                {!authorization ?
                    <LoginPage onValidate={this.validatePassword}
                               timeout={0}
                               innerRef={ref => this.loginPage = ref}
                    />
                    :
                    <Portfolio/>
                }
            </div>
        );
    }
}

export default connect(state => assign({}, {
    authorization: state.authorization
}), dispatch => ({
    authorizationAction: bindActionCreators(AuthorizationActions, dispatch)
}))(App);
