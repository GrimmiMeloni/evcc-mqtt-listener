const mqtt = require('mqtt');

const logger = require('./logger.js').logger;

logger.debug('Starting....');

const client = mqtt.connect("mqtt://192.168.3.46:1883");

const topicName = 'evcc/loadpoints/1/mode';
// connect to same client and subscribe to same topic name  
client.on('connect', () => {
    // can also accept objects in the form {'topic': qos} 
    client.subscribe(topicName, (err, granted) => {
        if (err) {
            logger.error(err, 'err');
        }
        logger.info("connected");
    })
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
}) 

process.on('SIGINT', function() {
    console.log('Got SIGINT.  Going to exit.');
    //Your code to execute before process kill.
    client.end();
    process.kill(process.pid);
});