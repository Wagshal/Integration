const req = { workspace_to_dump: '', dbs: [], workspace_to_restore: '' };

const Storage = (data) => {
    localStorage.setItem('dump', JSON.stringify(JSON.stringify(data) == '{}' ? req : data));
};

export const dumpDetails = data => {
    Storage(data);
    return JSON.parse(localStorage.getItem('dump'))
};

export const MongoDbMngrReducer = (state, action) => {
    switch (action.type) {
        case "WORKSPACE_DUMP":
            state.workspace_to_dump = action.payload.workspace;
            state.dbs = [];
            return {
                ...state
            };
        case "ADD_DB":
            if (state.dbs === []) {
                state.dbs[0] = { db: action.payload.db, collections: [] };
            } else {
                state.dbs = [...state.dbs, { db: action.payload.db, collections: [] }];
            }
            return {
                ...state
            };
        case "REMOVE_DB":
            state.dbs = state.dbs.filter(d => !(d.db === action.payload.db));
            return {
                ...state
            }
        case "ADD_COLLECTION":
            let exists = false;
            state.dbs.map(d => {
                if (d.db === action.payload.db) {
                    d.collections.push(action.payload.collection);
                    exists = true;
                }
            });
            if (!exists) {
                state.dbs = [...state.dbs, { db: action.payload.db, collections: [action.payload.collection] }];
            }
            return {
                ...state
            };
        case "REMOVE_COLLECTION":
            state.dbs.map(d => {
                if (d.db === action.payload.db) {
                    d.collections = d.collections.filter(c => JSON.stringify(c) !== JSON.stringify(action.payload.collection));
                }
            })
            return {
                ...state
            };
        case "WORKSPACE_RESTORE":
            state.workspace_to_restore = action.payload.workspace;
            return {
                ...state
            };
        default:
            return state;
    }
}

export default MongoDbMngrReducer;
