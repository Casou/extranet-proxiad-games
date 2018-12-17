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

const initialStore = {
    authorization : localStorage.getItem("authorization") && JSON.parse(localStorage.getItem("authorization"))
};

const store = createStore(reducers, initialStore,
    composeWithDevTools(applyMiddleware(thunk)));

store.subscribe(() => {
    delete axios.defaults.headers.common['Authorization'];
    axios.defaults.headers.common['Authorization'] = store.getState().authorization && store.getState().authorization.token;
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
