//@ts-check
const config = require('config');

const mqtt_url = config.get('mqtt.broker.url');
exports.mqtt_url = mqtt_url;

const chargeModeTopic = config.get('mqtt.topics.mode');
exports.chargeModeTopic = chargeModeTopic;

const chargeStateTopic = config.get('mqtt.topics.charging');
exports.chargeStateTopic = chargeStateTopic;

const plannerActiveTopic = config.get('mqtt.topics.plannerActive');
exports.plannerActiveTopic = plannerActiveTopic;
