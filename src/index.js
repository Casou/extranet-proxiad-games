import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {applyMiddleware, createStore} from "redux";
import {Provider} from "react-redux";
import thunk from "redux-thunk";
import {composeWithDevTools} from "redux-devtools-extension";
import reducers from "./reducers";
import axios from "axios";

console.debug("Environnement : " + process.env.NODE_ENV);
export let SERVEUR_URL = "http://localhost:8000/";
if (process.env.NODE_ENV === "production") {
    SERVEUR_URL = "http://localhost:8000/";
}

const getStorageItem = (name) => {
    return localStorage.getItem(name) && JSON.parse(localStorage.getItem(name));
};

const initialStore = {
    authorization : getStorageItem("authorization"),
    riddleStatus : getStorageItem("riddleStatus") || []
};
axios.defaults.headers.common['Authorization'] = initialStore.authorization && initialStore.authorization.token;

const store = createStore(reducers, initialStore,
    composeWithDevTools(applyMiddleware(thunk)));

store.subscribe(() => {
    delete axios.defaults.headers.common['Authorization'];

    const authorization = store.getState().authorization || getStorageItem("authorization");

    axios.defaults.headers.common['Authorization'] = authorization.token;
    localStorage.setItem("authorization", JSON.stringify(authorization));

    const riddleStatus = store.getState().riddleStatus || getStorageItem("riddleStatus");
    localStorage.setItem("riddleStatus", JSON.stringify(riddleStatus));
});


ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
