const { logger } = require('./logger.js');
const mqtt = require('./mqtt_client.js');

logger.debug('Starting....');

mqtt.connect();
