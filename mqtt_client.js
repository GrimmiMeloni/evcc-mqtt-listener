const mqtt = require('mqtt');

const { logger } = require('./logger.js');
const { mqtt_url, topicName } = require("./config");

function connect(handler) {
    const client = mqtt.connect(mqtt_url);
    
    // connect to same client and subscribe to same topic name  
    client.on('connect', () => {
        // can also accept objects in the form {'topic': qos} 
        client.subscribe(topicName, (err, granted) => {
            if (err) {
                logger.error(err, 'err');
            }
            logger.info("connected");
        });
    });
    // on receive message event, log the message to the console 
    client.on('message', (topic, message, packet) => {
        logger.trace(packet);
        if (topic === topicName) {
            let newMode =packet.payload.toString(); 
            logger.debug(newMode);
            handler.setChargeMode(newMode);
        }
    });
    client.on("packetsend", (packet) => {
        logger.trace(packet, 'packet2');
    });

    return client;
}

exports.connect = connect;