import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';

import Configuration from '../../config';

export const FiltersContext = createContext();

const DumpReqContextProvider = ({ children }) => {
    const config = new Configuration();
    const [state, setState] = useState([]);
    const [update, setUpdate] = useState(true)

    async function fetchData() {
        try {
            const respone = await axios.get(`${config.API_URL}/filter_collection/get_filters`);
            setState(respone.data);
            setUpdate(false)
        } catch (error) {
            throw error;
        };
    }

    useEffect(() => {
        if (update) {
            fetchData();
        }
    }, [update]);

    const contextValues = {
        state,
        setUpdate
    };

    return (
        <FiltersContext.Provider value={contextValues} >
            {children}
        </FiltersContext.Provider>
    );
}

export default DumpReqContextProvider;
