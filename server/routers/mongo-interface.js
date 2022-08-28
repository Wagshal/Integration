const express = require('express');

const { importDBS } = require('../commands/mongo-interface');
const { importCollections } = require('../commands/mongo-interface');

const router = express.Router();

router.get('/get_collection_per_db', async (req, res) => {
    try {
        let response = await importCollections(req.query);
        res.send({ collections: response });
    } catch (error) {
        res.send(error);
    }
})

router.get('/get_dbs', async (req, res) => {
    try {
        let response = await importDBS(req.query);
        res.send({ DBS: response });
    } catch (error) {
        res.send(error);
    }
});

module.exports = router;
