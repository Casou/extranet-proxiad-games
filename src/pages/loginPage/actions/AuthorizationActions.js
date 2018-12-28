import axios from "axios";
import {SERVEUR_URL} from "../../../index";

export default {

    login: (login, password) => (dispatch, getState) => {
        return axios.post(SERVEUR_URL + "login", { login, password })
            .then((response) => response.data)
            .then((response) => {
                dispatch({
                    type : "SET_AUTHORIZATION",
                    payload : response
                });
            });
    },
    unauthorizedToken: () => (dispatch, getState) => {
        return dispatch({
                    type : "UNAUTHORIZED",
                    payload : null
                });
    },

};