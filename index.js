const { logger } = require('./logger.js');
const mqtt = require('./mqtt_client.js');
const { Handler } = require('./handlers.js'); 
const { TeslaAPI } = require('./tesla.js');

logger.debug('Starting....');

const teslaAPI = new TeslaAPI();
if (!teslaAPI.initialize()) {
    logger.error("Failed to initialize TeslaAPI. Exiting.");
    process.exit(1);
};

const handler = new Handler();

const client = mqtt.connect(handler);

process.on('SIGINT', function () {
    console.log('Got SIGINT.  Going to exit.');
    //Your code to execute before process kill.
    client.end();
    process.kill(process.pid);
});
