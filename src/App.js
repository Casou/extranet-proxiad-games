import React, { Component } from 'react';
import './App.css';
import Portfolio from "./pages/portfolio/Portfolio";
import LoginPage from "./pages/loginPage/LoginPage";

class App extends Component {

    state = {
        jsonData : [],
        isLogged : true,
        token : "12345"
    };

    constructor(props) {
        super(props);
        this.validatePassword = this.validatePassword.bind(this);
        this.loginPage = null;
    }

    validatePassword(password) {
        if (password === "414") {
            this.setState({
                ...this.state,
                isLogged : true
            });
        } else {
            this.loginPage.wrongPasswordEntered();
        }
    }

  render() {
    return (
      <div id={"app"}>
          { !this.state.isLogged ?
              <LoginPage onValidate={this.validatePassword}
                         timeout={30}
                         innerRef={ref => this.loginPage = ref}
              />
          :
              <Portfolio />
          }
      </div>
    );
  }
}

export default App;
