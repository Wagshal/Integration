const express = require('express');
const Emitter = require('events').EventEmitter;

const DumpQueue = require('../models/dump.queue');

const { doRestore } = require('../commands/restore');

const router = express.Router();

router.post('/dump', async (req, res) => {
  const newDump = { dumpDetails: req.body, finish: new Emitter() };
  newDump.finish.on('finish', (dumpResult) => {
    res.send(dumpResult);
  });
  DumpQueue.addItem(newDump);
});

router.post('/restore', async (req, res) => {
  const restoreResult = await doRestore(req.body);
  res.send(restoreResult);
});

module.exports = router;
