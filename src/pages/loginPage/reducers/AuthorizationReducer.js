export const authorization = (stateWeather = {}, action) => {
    let newStore;
    switch (action.type) {
        case "SET_AUTHORIZATION" :
            localStorage.setItem("authorization", JSON.stringify(action.payload));
            newStore = action.payload;
            break;
        case "UNAUTHORIZED" :
            localStorage.removeItem("authorization");
            newStore = null;
            break;
        default :
            newStore = stateWeather;
    }
    return newStore;
};
