require('dotenv').config()
const express = require('express');
const app = express();
const cors = require('cors');
const expressPinoLogger = require('express-pino-logger');

const logger = require('./services/loggerService');
const workspacesRouter = require('./routers/config-workspaces');
const editWorkspaceRouter = require('./routers/edit-workspace');
const APP_PORT = process.env.APP_PORT;
const mongoInterface = require('./routers/mongo-interface');
const submitRouter = require('./routers/submit');
const autoJob = require('./routers/auto-job');
const checkConnectionRouter = require('./routers/check-connection');
const filterCollectionRouter = require('./routers/filter-collection');
const getDumpFile = require('./routers/get-dump-files');

const { cronFunction } = require('./commands/auto-job/auto-delete-dump-files');

const loggerMidlleware = expressPinoLogger({
    logger: logger,
    autoLogging: false,
});

app.use(loggerMidlleware);
app.use(express.json());
app.use(cors());

console.log({ env: process.env })

app.listen(process.env.APP_PORT, _ => {
    console.log(`app listening on port ${process.env.APP_PORT}!`);
});

cronFunction();

app.use('/get_workspaces', workspacesRouter);
app.use('/mongo_interface', mongoInterface)
app.use('/submit', submitRouter);
app.use('/check_connection', checkConnectionRouter);
app.use('/get_dump_file', getDumpFile);
app.use('/filter_collection', filterCollectionRouter);
app.use('/edit_workspace', editWorkspaceRouter);
app.use('/auto_job', autoJob);

module.exports = app;
