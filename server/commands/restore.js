require('dotenv').config()
const fs = require('fs');

const dumpFolder = process.env.DUMP_FOLDER;
const logDetailsObj = require('../classes/details-for-log')
const logger = require('../services/loggerService')
const errorMessage = require('../config/errorMessage.json');

const { MongoTools, MTOptions } = require('node-mongotools');

const descriptionR = 'Restore to the dumpFile into the database'

function isNotEmptyDumpFile(dumpFile) {
    const files = fs.readdirSync(dumpFile);
    return files != undefined;
}

async function restore(urlPathCollection) {
    const mongoTools = new MongoTools();
    const detailsToRestore = new MTOptions({
        uri: urlPathCollection.uri,
        dropBeforeRestore: true,
        dumpFile: urlPathCollection.dumpFile,
    });
    let response;
    try {
        response = await mongoTools.mongorestore(detailsToRestore);
        if (response.stderr) {
            response = { isSucceeded: true };
        }
    } catch (err) {
        if (err.message != undefined) {
            const restoreDetails = new logDetailsObj('restore', descriptionR, false);
            logger.info({
                ...restoreDetails,
                errorMsg: err.message
            });
            response = { isSucceded: false, errorMsg: err.message };
        } else {
            const restoreDetails = new logDetailsObj('restore', descriptionR, false);
            logger.info({
                ...restoreDetails, dumpFile: urlPathCollection.dumpFile,
                workspaceUrl: urlPathCollection.uri, errorMsg: errorMessage.ERR_1
            });
            response = { isSucceded: false, errorMsg: errorMessage.ERR_1 };
        }
    }
    return response;
}

async function doRestore(dataForRestore, dumpFileUri = dumpFolder) {
    if (!isNotEmptyDumpFile(dumpFolder))
        return;
    const currentDumpFile = dataForRestore.dumpFile;
    const uri = dataForRestore.uri;

    dumpFileUri = `${dumpFileUri}/${currentDumpFile}/`;
    try {
        const files = fs.readdirSync(dumpFileUri);
        for (let file of files) {
            const result = await restore({
                uri: uri,
                dumpFile: `${dumpFileUri}/${file}`
            });
            if (!result.isSucceeded)
                return result;
        }
        const restoreDetails = new logDetailsObj('restore', descriptionR, true);
        logger.info({
            ...restoreDetails,
            dumpFile: dataForRestore.dumpFile, workspaceUrl: dataForRestore.uri
        });
        return { isSucceeded: true };
    } catch (err) {
        const restoreDetails = new logDetailsObj('restore', descriptionR, false);
        logger.info({
            ...restoreDetails,
            dumpFile: dataForRestore.dumpFile
            , workspaceUrl: dataForRestore.uri,
            errorMsg: errorMessage.ERR_2
        });
        return { isSucceeded: false, errorMsg: errorMessage.ERR_2 };
    }
}

module.exports = { doRestore, restore };
