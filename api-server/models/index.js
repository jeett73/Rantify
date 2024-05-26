/**
 * Script for load db and models
 */
// DB library
const mongoose = require("mongoose");
const Fs = require("fs");
const Path = require("path");
const basename = Path.basename(module.filename);

// mongoose.set("debug", true);

module.exports = function(dbConfig) {
	mongoose.Promise = require("bluebird");
	const options = {
		user: dbConfig.user,
		pass: dbConfig.password,
		socketTimeoutMS: 0,
		connectTimeoutMS: 0,
		useNewUrlParser: true,
		useUnifiedTopology: true,
		// useFindAndModify: false,
		// useCreateIndex: true,
		authSource: "admin"
	};
	const connUri = `mongodb://${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`;
	console.log("=============Connection URL");
	console.log(connUri);
	return new Promise(async function(resolve, reject) {
		try {
			// make connection with database
			await mongoose.connect(connUri, options);
			console.log(`DB Connected: "${dbConfig.host}:${dbConfig.port}/${dbConfig.database}"`);
			// Enable below line if want to print query logs
			// mongoose.set('debug', true);

			// Read each model schema
			Fs.readdirSync(__dirname).filter((file) => {
				// check if file is not current file and file ext. is js the go for read its schema
				return (file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js");
			}).forEach((file) => {
				// Read schema
				mongoose.model(Path.parse(file).name, require(Path.join(__dirname, file))(mongoose));
			});
			resolve(mongoose);
		} catch (error) {
			console.error("DB Error");
			reject(error);
		}
	});
};
