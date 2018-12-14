import axios from "axios";

export default {

    login: (password) => (dispatch, getState) => {
        return axios.post("http://localhost:8000/login", { password })
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