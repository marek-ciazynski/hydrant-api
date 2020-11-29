'use strict';
const log = require('../../logger');

const { bluetooth } = require('webbluetooth');


const UART = {
	SERVICE_UUID: "6e400001-b5a3-f393-e0a9-e50e24dcca9e",

	// Allows the micro:bit to transmit a byte array
	TX_CHARACTERISTIC_UUID: "6e400002-b5a3-f393-e0a9-e50e24dcca9e",

	// Allows a connected client to send a byte array
	RX_CHARACTERISTIC_UUID: "6e400003-b5a3-f393-e0a9-e50e24dcca9e",
};
Object.freeze(UART);


const device = {
	name: 'micro:bit',

	// BT servies
	UART,
	services: [UART],

	// Connection
	txCharacteristic: null,
	rxCharacteristic: null,

	async connect() {
		log.info('Connect()');
		try {
			const bleDevice = await bluetooth.requestDevice({
				filters: [{ namePrefix: "BBC micro:bit" }],
				optionalServices: [UART.SERVICE_UUID] //this.services.map(s => s.SERVICE_UUID)
			});
			
			log.info('Connecting to GATT Server...');
			const server = await bleDevice.gatt.connect();
			
			log.info('Getting Service...');
			const service = await server.getPrimaryService(this.UART.SERVICE_UUID);
			
			log.info('Getting Characteristics...');
			this.txCharacteristic = await service.getCharacteristic(
				this.UART.TX_CHARACTERISTIC_UUID
			);

			this.rxCharacteristic = await service.getCharacteristic(
				this.UART.RX_CHARACTERISTIC_UUID
			);
		} catch (error) {
			log.error(`Bluetooth connection error. Hydrant API will not be able to collect data from ${this.name} sensor`);
			log.error(`BLE connection error: ${error}`);
		}
	},

	uartStartReceiving() {
		const onTxCharacteristicValueChanged = (event) => {
			let receivedData = [];
			for (var i = 0; i < event.target.value.byteLength; i++) {
				receivedData[i] = event.target.value.getUint8(i);
			}
			log.debug(receivedData)

			const receivedString = String.fromCharCode(...receivedData);
			const fps = 1000000 / parseInt(receivedString);
			log.debug(`Received BT data: delta = ${receivedString}, FPS = ${fps}`)
		};

		this.txCharacteristic.startNotifications();
		this.txCharacteristic.addEventListener(
			'characteristicvaluechanged',
			onTxCharacteristicValueChanged
		);
	}

}

module.exports = device;
