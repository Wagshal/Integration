require('dotenv').config()
const express = require('express');
const fs = require('fs');

const dumpFolder = process.env.DUMP_FOLDER;
const logger = require('../services/loggerService');
const logDetailsObj = require('../classes/details-for-log');

const router = express.Router();

router.get('/', (req, res) => {
    let file = fs.readdirSync(dumpFolder);
    if (file.length > 0) {
        logger.info(new logDetailsObj('returenDumpFiles', true));
        res.send(file);
    }
    else {
        const loggerDetails = new logDetailsObj('returenDumpFiles', false);
        logger.info({ ...loggerDetails, errorMsg: 'not exists dump file' });
        res.send("not found");
    }
})

module.exports = router;
