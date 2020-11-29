'use strict';
const log = require('../logger');
const { db } = require('../database');

const saveMeasurement = (deviceId, measurementType, measurementValue, interval = null) => {
	const insertData = [
		deviceId,
		measurementType,
		measurementValue,
		interval,
	];

	db.run(`INSERT INTO Measurements(
			deviceId,
			type,
			value,
			interval) VALUES(?, ?, ?, ?)`, insertData,
		function (err) {
			if (err) {
				return log.error(err.message);
		}
		// get the last insert id
		log.debug(`A measurement has been inserted with row id ${this.lastID}`);
	});
};

module.exports = {
	saveMeasurement,
};
