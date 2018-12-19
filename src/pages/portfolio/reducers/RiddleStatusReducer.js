export const riddleStatus = (state = {}, action) => {
    let newStore;
    switch (action.type) {
        case "RESOLVE_RIDDLE" :
            newStore = { ...state };
            newStore[action.payload] = true;
            break;
        default :
            newStore = state;
    }
    return newStore;
};
