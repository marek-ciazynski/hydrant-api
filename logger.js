'use strict';

const loggerConfig = {
	// level: 'debug',
	level: 'info',
	prettyPrint: true,
};

const pino = require('pino')(loggerConfig);

module.exports = pino;
