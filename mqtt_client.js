const mqtt = require('mqtt');

const { logger } = require('./logger.js');
const { mqtt_url, topicName } = require("./config");

function connect() {
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
            logger.debug(packet.payload.toString());
        }
    });
    client.on("packetsend", (packet) => {
        logger.trace(packet, 'packet2');
    });
    process.on('SIGINT', function () {
        console.log('Got SIGINT.  Going to exit.');
        //Your code to execute before process kill.
        client.end();
        process.kill(process.pid);
    });

    return client;
}

exports.connect = connect;