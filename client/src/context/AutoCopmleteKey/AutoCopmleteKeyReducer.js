export const AutoCopmleteKeyReducer = (state, action) => {
    switch (action.type) {
        case "CHANGE_KEY":
            state.key = !state.key
            return {
                ...state
            };
        default:
            return state
    }
}

export default AutoCopmleteKeyReducer;
