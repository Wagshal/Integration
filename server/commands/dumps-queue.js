const { importDBS } = require('./mongo-interface');

let usedDumpDatabases = [];

async function markUsedDatabase(dataForDump, date) {
    date = date.toISOString();
    const workspaceDetailsToSave = {};
    const dbsPerWorkspace = {};
    dbsPerWorkspace[dataForDump.workspace_to_dump] = [];
    workspaceDetailsToSave[date] = dbsPerWorkspace;

    if (dataForDump.dbs.length === 0) {
        try {
            const response = await importDBS({ workspace: dataForDump.workspace_to_dump });
            dataForDump.dbs = response.map((_db) => ({ db: _db, collections: [] }));
        } catch (error) {
            return { isSucceeded: false, errorMsg: 'workspace is not found' };
        }
    }
    workspaceDetailsToSave[Object.keys(workspaceDetailsToSave)[0]][dataForDump.workspace_to_dump] = dataForDump.dbs.map((el) => el.db);
    usedDumpDatabases = [...usedDumpDatabases, workspaceDetailsToSave];
}

async function isTheDatabaseUsed(dataForDump) {
    for (const dt of usedDumpDatabases) {
        if (Object.keys(Object.values(dt)[0])[0] === dataForDump.workspace_to_dump) {
            if (dataForDump.dbs.length === 0)
                return true;

            for (const db1 of dataForDump.dbs) {
                for (const db2 of Object.values(Object.values(dt)[0])[0]) {
                    if (db1.db === db2)
                        return true;

                }
            }
        }
    }
    return false;
}

async function DeleteUsedDatabaseAfterDump(date) {
    usedDumpDatabases = usedDumpDatabases.filter((dt) => {
        new Date(Object.keys(dt)[0]).toTimeString() !== date.toTimeString()
            || new Date(Object.keys(dt)[0]).toDateString() !== date.toDateString();
    });
}

module.exports = { markUsedDatabase, isTheDatabaseUsed, DeleteUsedDatabaseAfterDump };
