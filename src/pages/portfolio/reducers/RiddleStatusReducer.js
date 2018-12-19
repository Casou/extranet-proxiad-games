export const riddleStatus = (state = {}, action) => {
    let newStore;
    switch (action.type) {
        case "INIT_LOCK_STATUS" :
            newStore = { ...state };
            action.payload.forEach(riddle => newStore[riddle] = true)
            break;
        case "RESOLVE_RIDDLE" :
            newStore = { ...state };
            newStore[action.payload] = true;
            break;
        default :
            newStore = state;
    }
    return newStore;
};