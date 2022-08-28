const express = require('express');

const { autoJobDumpAndRestore } = require('../commands/auto-job/auto-job');

const router = express.Router();

router.post('/', async (req, res) => {
    const dumpAutoResult = await autoJobDumpAndRestore(req.body);
    res.send({ isSucceeded: dumpAutoResult });
});

module.exports = router;
