import React, { createContext, useReducer } from 'react';

import { AutoCopmleteKeyReducer } from './AutoCopmleteKeyReducer';

export const AutoCopmleteKeyContext = createContext();

const key = { key: true };

const AutoCopmleteKeyProvider = ({ children }) => {

    const [state, dispatch] = useReducer(AutoCopmleteKeyReducer, key);

    const change_key = payload => {
        dispatch({ type: 'CHANGE_KEY', payload })
    };

    const contextValues = {
        change_key,
        state
    };

    return (
        <AutoCopmleteKeyContext.Provider value={contextValues} >
            {children}
        </AutoCopmleteKeyContext.Provider>
    );
}

export default AutoCopmleteKeyProvider;
