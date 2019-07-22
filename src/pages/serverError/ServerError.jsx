import React, {Component} from 'react';
import PropTypes from 'prop-types';
import axios from "axios";

class ServerError extends Component {

  constructor(props) {
    super(props);

    this.state = {
      value: props.url,
      url: props.url
    };
  }

  _onInputChange = ({target: {value}}) => {
    this.ping(value);
    this.setState({url: value});
  };

  ping = (url) => {
    const urlPing = url + (!url.endsWith("/") ? "/" : "") + "ping";
    axios.get(urlPing)
      .then((response) => {
        console.debug("PING", response);
        if (response.status === 200) {
          localStorage.setItem("serverUrl", url);
          window.location.reload(false);
        }
      })
      .catch(err => {
        console.error("Error while pinging server on " + urlPing, err);
      });
  };

  render() {
    const {url} = this.state;

    return (
      <div id={"serverError"}>
        <h1>Erreur lors de la requête du serveur</h1>
        <p style={{color: "red", fontWeight: "bold"}}>Cette erreur ne fait pas partie du jeu ! Contactez le MJ pour
          régler le problème.</p>
        <div>
          <label htmlFor={"serverUrl"}>Url du serveur</label>
          <input id={"serverUrl"} type={"text"} value={url} onChange={this._onInputChange}/>
        </div>
      </div>
    );
  }
}

ServerError.propTypes = {
  url: PropTypes.string.isRequired
};

export default ServerError;