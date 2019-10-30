export const riddleStatus = (state = {}, action) => {
    let riddleStoreArray;
    switch (action.type) {
        case "INIT_LOCK_STATUS" :
            riddleStoreArray = action.payload;
            break;
        case "RESOLVE_RIDDLE" :
            riddleStoreArray = { ...state };
            riddleStoreArray.riddles.filter(r => r.riddleId === action.payload)[0].resolved = true;
            break;
        default :
            riddleStoreArray = state;
    }
    return riddleStoreArray;
};
