'use strict';

const config = require('./config/config');
const log = require('./logger');

const fastify = require('fastify')({
	logger: log,
});

// sqlite
const database = require('./database');
database.initializeSchema().catch(() => process.exit(1));

// Fastify
fastify.get('/', async (req, res) => {
	return { name: 'Hydrant API', version: process.env.npm_package_version }
})

fastify.register(require('./routes'), { prefix: '/api' });

fastify.listen(config.port, (err) => {
	if (err) {
		fastify.log.error(err);
		process.exit(1);
	}

	fastify.log.info(`Hydrant API is running`)
});


// Bluetooth
log.info('Starting BT service...');
const bluetoothService = require('./bluetooth');
bluetoothService.start();
