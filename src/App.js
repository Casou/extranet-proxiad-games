import React, {Component} from 'react';
import './App.css';
import Portfolio from "./pages/portfolio/Portfolio";
import LoginPage from "./pages/loginPage/LoginPage";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import AuthorizationActions from "./pages/loginPage/actions/AuthorizationActions";
import {assign} from "lodash";
import ServerError from "./pages/serverError/ServerError";
import {SERVER_URL} from "./index";
import axios from "axios";

class App extends Component {

  state = {
    serverStatus: "NOT_YET_PINGED"
  };

  constructor(props) {
    super(props);
    this.validatePassword = this.validatePassword.bind(this);
    this.loginPage = null;
  }

  componentDidMount() {
    axios.get(SERVER_URL + "ping").then(() => this.setState({serverStatus: "SERVER_OK"}))
      .catch(() => this.setState({serverStatus: "SERVER_ERROR"}));
  }

  validatePassword(login, password) {
    this.props.authorizationAction.login(login, password)
      .then(() => localStorage.removeItem("terminalErrors"))
      .catch(() => this.loginPage.wrongPasswordEntered());
  }

  render() {
    const {authorization} = this.props;
    const {serverStatus} = this.state;

    if (serverStatus === "NOT_YET_PINGED") {
      return <div/>;
    }

    if (serverStatus === "SERVER_ERROR") {
      return <ServerError url={SERVER_URL}/>;
    }

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
