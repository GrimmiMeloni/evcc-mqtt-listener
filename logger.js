//@ts-check
const pino = require('pino');

// const logger = pino();
const logger = pino.pino({
    transport: {
        target: 'pino-pretty',
        options: {
            translateTime: 'SYS:standard'
        }
    }
})

logger.level = 'debug';

exports.logger = logger;