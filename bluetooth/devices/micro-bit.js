'use strict';
const log = require('../../logger');
const measurementStore = require('../measurementStore');

const { bluetooth } = require('webbluetooth');


const INCOMING_DATA_INTERVAL = 2000;

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
	bleDevice: null,
	txCharacteristic: null,
	rxCharacteristic: null,

	async connect() {
		log.info('Connect()');
		try {
			this.bleDevice = await bluetooth.requestDevice({
				filters: [{ namePrefix: "BBC micro:bit" }],
				optionalServices: this.services.map(s => s.SERVICE_UUID)
			});

			log.info('Connecting to GATT Server...');
			const server = await this.bleDevice.gatt.connect();
			
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
			
			const receivedString = String.fromCharCode(...receivedData).trim();
			log.debug(receivedString)

			// const message = JSON.parse(receivedString);
			// log.info('Received BT data: ' + message)

			const [ dataType, dataValue ] = receivedString.split(':');
			log.info(`Received BT data: ${dataType} = ${dataValue}`)
			if (dataType === 'Delta') {
				const fps = 1000000 / parseInt(dataValue);
				log.info(` FPS = ${fps}`)
			}

			measurementStore.saveMeasurement(this.bleDevice.id, dataType, parseFloat(dataValue),
				dataType !== 'Delta' ? INCOMING_DATA_INTERVAL : null)
		};

		this.txCharacteristic.startNotifications();
		this.txCharacteristic.addEventListener(
			'characteristicvaluechanged',
			onTxCharacteristicValueChanged
		);
	}

}

module.exports = device;
