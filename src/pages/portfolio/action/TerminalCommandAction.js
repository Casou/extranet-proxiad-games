import axios from "axios";

export default {

    initLockStatus: (unlockedRiddles) => (dispatch, getState) => {
        dispatch({
            type : "INIT_LOCK_STATUS",
            payload : unlockedRiddles
        });
    },

    postUnlockRequest: (unlockRequest) => (dispatch, getState) => {
        const url = "http://localhost:8000/unlock";
        return axios.post(url, {id: unlockRequest.options.id, password: unlockRequest.options.password})
            .then(response => {
                if (response.status !== 200) {
                    return Promise.reject("Error while fetching " + url + " : " + response.status + " " + response.statusText);
                } else {
                    return response.data;
                }
            })
            .then(() => {
                unlockRequest.text = `<i class="fa fa-unlock"></i> <span class="lock_status unlocked">UNLOCKED</span> Riddle [${ unlockRequest.options.id }] unlocked`;
                unlockRequest.isProgress = true;

                dispatch({
                    type : "RESOLVE_RIDDLE",
                    payload : unlockRequest.options.id
                });

                return unlockRequest;
            })
            .catch((error) => {
                console.error(error);
                return Promise.reject(`Error while trying to unlock riddle [${ unlockRequest.options.id}] with password [${ unlockRequest.options.password}] : ${error.response.data}`);
            });
    }

};