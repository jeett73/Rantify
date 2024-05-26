/* eslint-disable max-len */
/**
 * Script is used for setup db first time this script will work only in docker
 */

global.models = null; // load all models in global conn var.
global.conn = null;
// inport config file
global.config = require("../config/config.json");

/** *********create uploads and logs folder */
const fs = require("fs");
const uploadDirs = ["./public/uploads"];
for (inx in config.dir_constants) {
	if (!Object.prototype.hasOwnProperty.call(config.dir_constants, inx)) {
		continue;
	}
	uploadDirs.push(`./public/uploads${config.dir_constants[inx]}`);
}
for (inx in uploadDirs) {
	if (!fs.existsSync(uploadDirs[inx])) {
		fs.mkdirSync(uploadDirs[inx]);
	}
}
if (!fs.existsSync("./logs")) {
	fs.mkdirSync("./logs");
}
/** ************************************** */

// create client of mongo
const MongoClient = require("mongodb").MongoClient;
// get dbconfig
const dbConfig = config["datasource"];
// create database connection uri for central db
const database = `mongodb://${dbConfig.host}:${dbConfig.port}/admin`;

console.log(database);
// connect database
MongoClient.connect(database, {
	useNewUrlParser: true
}, function(err, client) {
	if (!err) {
		console.log("==============>Central db connected");
		// authentication if centraldb already created
		const centralDatabase = `mongodb://${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`;
		MongoClient.connect(centralDatabase, {
			useNewUrlParser: true
		}, async function(centralErr, centralClient) {
			if (centralErr) {
				// Add the new user to the admin database
				const db = client.db(dbConfig.database);
				db.addUser(dbConfig.username, dbConfig.password, {
					roles: []
				}, async function(err, result) {
					// db.close();
					if (err) {
						console.log("==============>Error while add user");
						console.log(err);
					} else {
						console.log("==============>Central db user added");

						require("../models");

						// create super admin
						const uuidv4 = require("uuid/v4");
						const md5 = require("md5");
						const User = require("../models/users.js");

						try {
							await User.Model.create({
								first_name: "admin",
								last_name: "admin",
								password: md5("admin"),
								deleted: false,
								email: "admin@site.com",
								mobile: "9999999999",
							});
							console.log("==============>Superadmin created");
						} catch (err) {
							console.log(err);
							console.log("==============>Superadmin create failed");
						}

						process.exit();
					}
				});
			} else {
				console.log("==============>central db and user already created");
				process.exit();
			}
		});
	} else {
		console.log("==============>Error while connect admin db");
		console.log(err);
	}
});
