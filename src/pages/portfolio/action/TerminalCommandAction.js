import axios from "axios";
import {SERVEUR_URL} from "../../../index";

export default {

    initLockStatus: (unlockedRiddles) => (dispatch, getState) => {
        dispatch({
            type : "INIT_LOCK_STATUS",
            payload : unlockedRiddles
        });
    },

    postUnlockRequest: (unlockRequest) => (dispatch, getState) => {
        const url = SERVEUR_URL + "unlock";
        return axios.post(url, {riddleId: unlockRequest.unlock.id, password: unlockRequest.unlock.password})
            .then(response => {
                if (response.status !== 200) {
                    return Promise.reject("Error while fetching " + url + " : " + response.status + " " + response.statusText);
                } else {
                    return response.data;
                }
            })
            .then(() => {
                unlockRequest.text = `
                    <i class="fa fa-unlock"></i> <span class="lock_status unlocked">UNLOCKED</span> Riddle [${ unlockRequest.unlock.id }] unlocked<br />
                    Type <b>'unlock -list'</b> to check the status of all riddles.`;
                unlockRequest.isProgress = true;

                dispatch({
                    type : "RESOLVE_RIDDLE",
                    payload : unlockRequest.unlock.id
                });

                return unlockRequest;
            })
            .catch((error) => {
                console.error(error);
                return Promise.reject(`Error while trying to unlock riddle [${ unlockRequest.unlock.id}] with password [${ unlockRequest.unlock.password}] : ${error.response.data}`);
            });
    },

    postRedpill: () => (dispatch, getState) => {
        const url = SERVEUR_URL + "redpill";
        return axios.get(url)
            .then(response => {
                if (response.status === 403) {
                    return Promise.reject("You shouldn't have call the redpill command until all the riddles are resolved.");
                } else if (response.status !== 200) {
                    return Promise.reject("Error while fetching " + url + " : " + response.status + " " + response.statusText);
                } else {
                    return response;
                }
            })
            .catch((error) => {
                return Promise.reject((error.response && error.response.data)
                    || `Error while executing redpill command : ${error}`);
            });
    }

};