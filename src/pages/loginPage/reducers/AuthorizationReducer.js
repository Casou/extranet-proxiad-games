export const authorization = (stateWeather = {}, action) => {
    let newStore;
    switch (action.type) {
        case "SET_AUTHORIZATION" :
            newStore = action.payload;
            break;
        case "UNAUTHORIZED" :
            newStore = null;
            break;
        default :
            newStore = stateWeather;
    }
    return newStore;
};
