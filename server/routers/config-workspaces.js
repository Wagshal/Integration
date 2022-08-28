require('dotenv').config()
const express = require('express');

const { importWorkspaces } = require('../commands/config-workspaces-get-url');

const config = process.env.DEFAULT_DUMP_URL;
const WORKSPACES = process.env.WORKSPACES||`config/workspaces-configuration.json`;
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        let responeWorkspaces = importWorkspaces(WORKSPACES);
        res.send({ responeWorkspaces, config });
    } catch (error) {
        throw error;
    };
});

module.exports = router;
