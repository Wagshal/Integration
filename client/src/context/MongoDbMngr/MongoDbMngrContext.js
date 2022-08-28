import React, { createContext, useReducer } from 'react';
import { MongoDbMngrReducer, dumpDetails } from './MongoDbMngrReducer';

export const MongoDbMngrContext = createContext();

const storage = localStorage.getItem('dump') ? JSON.parse(localStorage.getItem('dump')) : {};

const MongoDbMngrContextProvider = ({ children }) => {

    const [state, dispatch] = useReducer(MongoDbMngrReducer, dumpDetails(storage));

    const workspace_dump = payload => {
        dispatch({ type: 'WORKSPACE_DUMP', payload })
    };

    const add_db = payload => {
        dispatch({ type: 'ADD_DB', payload })
    };

    const remove_db = payload => {
        dispatch({ type: 'REMOVE_DB', payload })
    };

    const add_collection = payload => {
        dispatch({ type: 'ADD_COLLECTION', payload })
    };

    const remove_collection = payload => {
        dispatch({ type: 'REMOVE_COLLECTION', payload })
    };

    const workspace_restore = payload => {
        dispatch({ type: 'WORKSPACE_RESTORE', payload })
    };


    const contextValues = {
        workspace_dump,
        add_db,
        remove_db,
        add_collection,
        remove_collection,
        workspace_restore,
        state
    };

    return (
        <MongoDbMngrContext.Provider value={contextValues} >
            {children}
        </MongoDbMngrContext.Provider>
    );
}

export default MongoDbMngrContextProvider;
