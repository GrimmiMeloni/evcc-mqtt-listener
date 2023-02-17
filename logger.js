const pino = require('pino');

// const logger = pino();
const logger = pino({
    transport: {
        target: 'pino-pretty'
    }
})

logger.level = 'debug';

exports.logger = logger;