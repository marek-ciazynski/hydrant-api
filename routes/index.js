'use strict';
const { promisify } = require('util') 

const { db } = require('../database');
// const dbAllAsync = promisify(db.all);

async function routes(fastify, options) {
	fastify.get('/', async (request, reply) => {
		return { name: 'Hydrant API', version: process.env.npm_package_version, routes: 'api' }
	})

	fastify.get('/measurement', (request, reply) => {
		const $top = request.query.top;
		if ($top)
			db.all('SELECT * FROM Measurements LIMIT $top', { $top }, (err, rows) => {
				reply.send(rows);
			});
		else
			db.all('SELECT * FROM Measurements', (err, rows) => {
				reply.send(rows);
			})
	});
}

module.exports = routes;
