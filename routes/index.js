'use strict';

async function routes(fastify, options) {
	fastify.get('/', async (request, reply) => {
		return { name: 'Hydrant API', version: process.env.npm_package_version, routes: 'api' }
	})
}

module.exports = routes;
