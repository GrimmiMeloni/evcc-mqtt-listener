const config = require('config');

//const mqtt_url = "mqtt://192.168.3.46:1883";
const mqtt_url = config.get('mqtt.broker.url');
exports.mqtt_url = mqtt_url;

// const chargeModeTopic = 'evcc/loadpoints/1/mode';
const chargeModeTopic = config.get('mqtt.topics.mode');
exports.chargeModeTopic = chargeModeTopic;

// const chargeStateTopic = 'evcc/loadpoints/1/charging';
const chargeStateTopic = config.get('mqtt.topics.charging');
exports.chargeStateTopic = chargeStateTopic;
