const logger = require('../services/loggerService')

describe('Logger Services', () => {
    const loggerLevels = ['info', 'warn', 'error', 'debug', 'trace', 'fatal'];

    describe('logger level functions', () => {
        test.each(loggerLevels)('should have a %s function', (level) => {
            expect(logger[level]).toBeDefined();
            expect(logger[level]).toBeInstanceOf(Function);
        });
    });
});
