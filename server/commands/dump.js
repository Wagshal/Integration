require('dotenv').config()
const fs = require('fs')
const { MongoTools } = require('node-mongotools');

const { markUsedDatabase, DeleteUsedDatabaseAfterDump } = require('./dumps-queue');
const { importCollections } = require('./mongo-interface');
const { importDBS } = require('./mongo-interface');
const { createViewCollection } = require('./filter/create-view-collection');
const { dropViewCollection } = require('./filter/drop-view-collection');

const WORKSPACES = process.env.WORKSPACES || 'config/workspaces-configuration.json';
const errorMessage = require('../config/errorMessage.json');
const logger = require('../services/loggerService');
const logDetailsObj = require('../classes/details-for-log');

const mongoTools = new MongoTools();

function getWorkspacesObject() {
    const data = fs.readFileSync(WORKSPACES)
    return JSON.parse(data)
}

function getWorkspaceName(url) {
    let workspaceNameFromConfig = '';
    Object.entries(getWorkspacesObject()).forEach(([key, value]) => {
        if (value === url) {
            workspaceNameFromConfig = key;
        }
    });
    return workspaceNameFromConfig === '' ? false : workspaceNameFromConfig;
}

async function doDump(dataForDump) {
    const date = new Date();
    const fs = require('fs')
    fs.readdir(__dirname, (err, list) => {
        list.forEach(folder => {
            console.log({folder})

        })
    })
    console.log({dumpfolder:process.env.DUMP_FOLDER})
    console.log(fs.existsSync(process.env.DUMP_FOLDER))
    if (!fs.existsSync(process.env.DUMP_FOLDER)) {
        fs.mkdirSync(process.env.DUMP_FOLDER, { recursive: true });
    }
    const workspaceName = getWorkspaceName(dataForDump.dumpDetails.workspace_to_dump);
    await markUsedDatabase(dataForDump.dumpDetails, date);

    if (workspaceName == false) {
        const data = new logDetailsObj('Dump', `do dump from ${dataForDump.dumpDetails.workspace_to_dump} workspace`, false);
        logger.info({ ...data, fell_in_action: 'getWorkspaceName', errorMsg: errorMessage.ERR_1 });
        return { isSucceeded: false, errorMsg: errorMessage.ERR_1 };
    }
    const fileName = `${workspaceName}_${date.toISOString().split(':').join('.')}`;

    if (dataForDump.dumpDetails.dbs.length === 0) {
        try {
            const result = await importDBS({ workspace: dataForDump.dumpDetails.workspace_to_dump });
            dataForDump.dumpDetails.dbs = result.map(_db => ({ db: _db, collections: [] }));
        } catch (error) {
            const data = new logDetailsObj('Dump', `do dump from ${dataForDump.dumpDetails.workspace_to_dump} workspace`, false);
            logger.info({ ...data, fell_in_action: 'importDBS', errorMsg: error.message });
            return { isSucceeded: false, errorMsg: errorMessage.ERR_1 };
        }
    }
    for (let _db of dataForDump.dumpDetails.dbs) {
        if (_db.collections.length === 0) {
            try {
                const result = await importCollections({ workspace: dataForDump.dumpDetails.workspace_to_dump, db: _db.db });
                _db.collections = result;
            } catch (error) {
                const data = new logDetailsObj('Dump', `do dump from ${dataForDump.dumpDetails.workspace_to_dump} workspace`, false);
                logger.info({ ...data, fell_in_action: 'importCollections', errorMsg: error.message });
                return { isSucceeded: false, errorMsg: errorMessage.ERR_1 };
            }
        }
        for (let col of _db.collections) {
            let isObject = false;
            if (typeof col !== 'string') {
                isObject = true;
                let data = {
                    workspace: dataForDump.dumpDetails.workspace_to_dump,
                    db: _db.db,
                    collection: col.name,
                    query: col.query,
                    projection: col.projection,
                    description: col.description
                };
                try {
                    col = await createViewCollection(data)
                } catch (error) {
                    const data = new logDetailsObj('Dump', `do dump from ${dataForDump.dumpDetails.workspace_to_dump} workspace`, false);
                    logger.info({ ...data, fell_in_action: 'createViewCollection', errorMsg: error.message });
                    return { isSucceeded: false, errorMsg: error.message };
                }
            }
            try {
                const currentDump = await mongoTools.mongodump({
                    url: dataForDump.dumpDetails.workspace_to_dump,
                    path: `${process.env.DUMP_FOLDER}/${fileName}`,
                    db: _db.db,
                    collection: col,
                    fileName: `${_db.db}_${col}.gz`
                });
                console.log({ currentDump })
                isSucceeded = { isSucceeded: true, dumpFile: fileName };
            }
            catch (error) {
                const data = new logDetailsObj('Dump', `do dump from ${dataForDump.dumpDetails.workspace_to_dump} workspace`, false);
                logger.info({ ...data, fell_in_action: 'do dump', errorMsg: error.message });
                return { isSucceeded: false, errorMsg: error.message };
            }
            if (isObject) {
                data = {
                    workspace: dataForDump.dumpDetails.workspace_to_dump,
                    db: _db.db,
                    collection: col,
                }
                try {
                    await dropViewCollection(data);
                } catch {
                    const data = new logDetailsObj('Dump', `do dump from ${dataForDump.dumpDetails.workspace_to_dump} workspace`, false);
                    logger.info({ ...data, fell_in_action: 'dropViewCollection', errorMsg: error.message });
                    return { isSucceeded: false, errorMsg: error.message };
                }
            }
        }
    }
    console.log('hello dump')
    DeleteUsedDatabaseAfterDump(date);
    logger.info(new logDetailsObj('Dump', `do dump from ${dataForDump.dumpDetails.workspace_to_dump} workspace`, true));
    return isSucceeded;
}

module.exports = { doDump, getWorkspaceName };
