const pino = require('pino');

module.exports = pino({
    level: process.env.LOG_LEVEL || 'info',
    timestamp: pino.stdTimeFunctions.isoTime,
    prettyPrint: { colorize: false },
},
    pino.destination(`${__dirname}/logger.log`)
);
