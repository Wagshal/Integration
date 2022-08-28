const express = require('express');

const { checkQuery } = require('../commands/filter/check-query');
const { getFilters } = require('../commands/filter/get-filters');

const router = express.Router();

router.get('/add_query', async (req, res) => {
    try {
        let response = await checkQuery(req.query);
        res.send(response);
    } catch (error) {
        throw error;
    };

});

router.get('/get_filters', async (req, res) => {
    try {
        let response = await getFilters();
        res.send(response);
    } catch (error) {
        throw error;
    };
});

module.exports = router;