//@ts-check
const mqtt = require('mqtt');
const { logger } = require('./logger.js');
const { mqtt_url, chargeModeTopic, chargeStateTopic, plannerActiveTopic } = require("./config");

function connect(handler) {
    const client = mqtt.connect(mqtt_url);
    
    // connect to same client and subscribe to same topic name  
    client.on('connect', () => {
        logger.info("connected, subscribing....");
        // can also accept objects in the form {'topic': qos} 
        client.subscribe(chargeModeTopic, (err, granted) => {
            if (err) {
                logger.error(err, 'err');
            }
            logger.info("subscribed to %s", chargeModeTopic);
        });

        client.subscribe(chargeStateTopic, (err, granted) => {
            if (err) {
                logger.error(err, 'err');
            }
            logger.info("subscribed to %s", chargeStateTopic);
        });

        client.subscribe(plannerActiveTopic, (err, granted) => {
            if (err) {
                logger.error(err, 'err');
            }
            logger.info("subscribed to %s", plannerActiveTopic);
        });

    });

    // on receive message event, log the message to the console 
    client.on('message', (topic, message, packet) => {
        logger.trace(packet);
        if (topic === chargeModeTopic) {
            let newMode =packet.payload.toString(); 
            logger.trace('read chargeMode %s', newMode);
            handler.setChargeMode(newMode);
            return;
        }

        if (topic === chargeStateTopic) {
            let newState = JSON.parse(packet.payload.toString());
            logger.trace('read chargeState %s', newState);
            handler.setCharging(newState);
            return;
        }

        if (topic === plannerActiveTopic) {
            let newState = JSON.parse(packet.payload.toString());
            logger.trace('read plannerActive %s', newState);
            handler.setPlannerActive(newState);
            return;
        }
    });

    client.on("packetsend", (packet) => {
        logger.trace(packet, 'packet2');
    });

    return client;
}

exports.connect = connect;