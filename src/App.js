import React, { Component } from 'react';
import './App.css';
import Portfolio from "./pages/portfolio/Portfolio";
import LoginPage from "./pages/loginPage/LoginPage";

class App extends Component {

    state = {
        jsonData : [],
        isLogged : true
    };

    constructor(props) {
        super(props);
        fetch("data.json")
            .then(response => response.json())
            .then(response => {
                this.setState({
                    ...this.state,
                    jsonData : response
                });
            });
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
              <Portfolio jsonData={ this.state.jsonData }/>
          }
      </div>
    );
  }
}

export default App;
