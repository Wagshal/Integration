const express = require('express');

const { checkConnection } = require('../commands/check-connection');

const router = express.Router();

router.get('/', async (req, res) => {
    
    try {
        let response = await checkConnection(req.query.url);
        res.send({ response });
    } catch (error) {
        throw error;
    };
});

module.exports = router;
