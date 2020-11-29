const port = process.env.PORT || 8080;
const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
	port,
	isProduction,

	sqliteDatabase: './data.sqlite',
};
