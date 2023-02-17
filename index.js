const { logger } = require('./logger.js');
const mqtt = require('./mqtt_client.js');
const { Handler } = require('./handlers.js'); 

const handler = new Handler();

logger.debug('Starting....');

const client = mqtt.connect(handler);

process.on('SIGINT', function () {
    console.log('Got SIGINT.  Going to exit.');
    //Your code to execute before process kill.
    client.end();
    process.kill(process.pid);
});
