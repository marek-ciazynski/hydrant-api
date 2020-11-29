'use strict';

const loggerConfig = {
	level: 'debug',
	prettyPrint: true,
};

const pino = require('pino')(loggerConfig);

module.exports = pino;
