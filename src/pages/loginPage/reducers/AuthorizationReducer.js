export const authorization = (state = {}, action) => {
    let newStore;
    switch (action.type) {
        case "SET_AUTHORIZATION" :
            newStore = action.payload;
            break;
        case "UNAUTHORIZED" :
            newStore = null;
            break;
        default :
            newStore = state;
    }
    return newStore;
};
