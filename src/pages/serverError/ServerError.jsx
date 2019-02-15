import React, {Component} from 'react';
import PropTypes from 'prop-types';
import axios from "axios";

class ServerError extends Component {

    constructor(props) {
        super(props);

        this.state = {
			url: props.url
		};
    }

    _onInputChange = ({ target : { value }}) => {
        const url = value + (!value.endsWith("/") ? "/" : "");
        this.ping(url);
        this.setState({ url });
    };

    ping = (url) => {
		axios.get(url + "ping").then((response) => {
		    console.log(response);
		    if (response.status === 200) {
				localStorage.setItem("serverUrl", url);
				window.location.reload(false);
            }
		});
    };

    render() {
        const { url } = this.state;

        return (
            <div id={"serverError"}>
                <h1>Erreur lors de la requête du serveur</h1>
                <p style={{ color : "red", fontWeight : "bold"}}>Cette erreur ne fait pas partie du jeu ! Contactez le MJ pour régler le problème.</p>
                <div>
                    <label htmlFor={"serverUrl"}>Url du serveur</label>
                    <input id={"serverUrl"} type={"text"} value={url} onChange={this._onInputChange} />
                </div>
            </div>
        );
    }
}

ServerError.propTypes = {
    url : PropTypes.string.isRequired
};

export default ServerError;