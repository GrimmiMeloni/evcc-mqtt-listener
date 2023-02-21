//@ts-check
const { logger } = require('./logger.js');
const mqtt = require('./mqtt_client.js');
const { Handler } = require('./handlers.js'); 
const { TeslaAPI } = require('./tesla.js');

//wrapping main logic in async function to allow await'ing for syncronous ordered init sequence
async function app() {
    logger.debug('Starting....');
    
    const teslaAPI = new TeslaAPI();
    const teslaInit = await teslaAPI.initialize();

    if (teslaInit != true) {
        logger.error("Failed to initialize TeslaAPI. Exiting.");
        process.exit(1);
    };
    
    logger.info ("TeslaAPI init complete. Connecting to MQTT.");
    const handler = new Handler(teslaAPI);
    const client = mqtt.connect(handler);
}

app();