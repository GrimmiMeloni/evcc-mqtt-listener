const pino = require('pino');

// const logger = pino();
const logger = pino({
    transport: {
        target: 'pino-pretty'
    }
})

logger.level = 'debug';

module.exports.logger = logger;