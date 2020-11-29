'use strict';
const log = require('./logger');
const config = require('./config/config');

const sqlite3 = require('sqlite3').verbose();

const databaseSchema = `CREATE TABLE IF NOT EXISTS Measurements (
		id integer NOT NULL PRIMARY KEY,
		deviceId text NOT NULL,
		type text NOT NULL,
		value double NOT NULL,
		interval integer
	);
`;

const initializeSchema = () => new Promise((resolve, reject) => {
	db.run(databaseSchema, (err) => {
		if (err) {
			log.error('Cannot create schema! Closing database');
			log.error(err);
			db.close();
			reject(err);
		}
		resolve();
	})
});

const db = new sqlite3.Database(config.sqliteDatabase, (err) => {
	if (err)
		log.error('Cannot open SQLite database: ' + error);

	log.debug('Opened sqlite3 database: ' + config.sqliteDatabase);
});


module.exports = {
	db,
	initializeSchema,
};
