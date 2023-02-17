const { logger } = require('./logger.js');
const mqtt = require('./mqtt_client.js');
const { Handler } = require('./handlers.js'); 

const handler = new Handler();

logger.debug('Starting....');

mqtt.connect(handler);
