'use strict';
const log = require('../logger');
const MicroBit = require('./devices/micro-bit');

function start() {
	MicroBit.connect().then(() => {
		log.info('BT conected, starting UART RX...')
		MicroBit.uartStartReceiving();
		log.info('Bluetooth started.')
	});
}

module.exports = {
	start,
};
