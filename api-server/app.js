require("custom-env").env();
const fs = require("fs");
const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
const session = require("express-session"); // Create a session middleware
const cookieSession = require("cookie-session"); // Cookie-based session middleware.
const compression = require("compression");
const cors = require("cors");
const morgan = require("morgan");
const debug = require("debug")("admintheme:server");
const http = require("http");
const socketIo = require('socket.io');
// const server = http.createServer(app);

const events = require("events");
global.appEvent = new events.EventEmitter();
// global.io = require('socket.io')(3000);
// io.on("connection", function (socket) {
// 	console.log(JSON.stringify(socket.handshake, null, 2));
//     socket.emit("hello", "world");
// });
// const { Server } = require("socket.io");

// const io = new Server(5000, { /* options */ });

// io.on("connection", (socket) => {
// 	console.log('A client connected');

// 	socket.on('disconnect', () => {
// 		console.log('A client disconnected');
// 	});

// 	// Handle any custom events
// 	socket.on('customEvent', (data) => {
// 		console.log('Received custom event:', data);
// 		// Broadcast to all clients
// 		io.emit('customEvent', data);
// 	});
// });

if (!fs.existsSync("./logs")) {
	fs.mkdirSync("./logs");
}

// Config File Load
if (process.env["CONFIG_FILES"] == undefined || process.env["CONFIG_FILES"] == "") {
	process.exit(78);
}
console.log("Config Files: ", process.env["CONFIG_FILES"]);
const config = require("./modules/multiConfig/index")(process.env["CONFIG_FILES"]);
const messages = require("./config/messages.js");
global.config = Object.assign(config, messages);

// Set specific time-zones for node process or instance
// Its value must be like “continent/capital”
console.log("==================================config.processTimeZone================", config.processTimeZone);
process.env.TZ = config.processTimeZone;
process.env["TIMESTAMP"] = Math.round(new Date().getTime() / 1000);

// Logger
// global.logger = require("./modules/logger")(global.config.logger, global.appEvent);

// Normalize a port into a number, string, or false.
const normalizePort = function (val) {
	const port = parseInt(val, 10);
	if (isNaN(port) && port > 0) return val;
	if (port >= 0) return port;
	return false;
};

// logger.separator("Starting Server");
// eslint-disable-next-line max-statements
(async () => {
	try {
		// await runMigration(config.datasource);
		let port = process.env.APP_PORT || 80;
		port = normalizePort(port);
		// Check and set port from config
		if (typeof global.config === "object" && global.config.http && typeof global.config.http.port === "number") {
			port = global.config.http.port;
		}
		// Create Express App
		const app = express();
		// Test Log
		app.use(function (req, res, next) {
			console.log(`URL: ${req.originalUrl}`);
			next();
		});
		app.set("port", port);
		const server = http.createServer(app);
		// Express Custom Function
		require("./common/express-custom-function")(express);

		server.on("error", onError);
		server.on("listening", onListening);
		server.listen(port, () => {
			console.log(`Server started on port ${port}`);
		});

		// app.use(morgan(global.config.logger.morgan.pattern, {
		// 	stream: logger.stream
		// }));

		// Handle
		process.on("uncaughtException", function (err) {
			// console.log(err.message);
		});

		// allow cross browser request
		app.use(cors());


		const io = socketIo(server, {
			cors: {
				origin: "http://54.242.148.189",
				methods: ["GET", "POST"]
			}
		});

		// Connect database and Model registration
		global.db = await require("./models")(config.datasource);

		const users = {};
		io.on('connection', async (socket) => {
			console.log('A client connected');
			// Store user with their socket ID
			await socket.on('registerUser', (userId) => {
				console.log(userId, "usersusersusers");
				users[userId] = socket.id;
			});
			socket.on('disconnect', () => {
				console.log('A user disconnected');
				// Remove disconnected user from users object
				const userId = Object.keys(users).find(key => users[key] === socket.id);
				if (userId) {
					console.log("++++++===******");
					delete users[userId];
				}
			});

			socket.on('sendMessageToUser', async (data) => {
				const userSocket = users[data.receivedBy];
				await db.models.chats.create({
					receivedBy: data.receivedBy,
					sendBy: data.sendBy,
					message: data.message
				})
				if (userSocket) {
					io.to(userSocket).emit('message', data.message);
				} else {
					// Handle user not found
					console.log('User not found');
				}
			});
		});

		// Initialize export module globally
		// global.exportModule = require("./modules/export/index")();

		// HTTP server listener "error" event.
		function onError(error) {
			if (error.syscall !== "listen") {
				throw error;
			}
			const bind = typeof port === "string" ? `Pipe ${port}` : `Port ${port}`;
			// handle specific listen errors with friendly messages
			switch (error.code) {
				case "EACCES":
					console.error(`${bind} requires elevated privileges`);
					process.exit(1);
					break;
				case "EADDRINUSE":
					console.error(`${bind} is already in use`);
					process.exit(1);
					break;
				default:
					throw error;
			}
		}

		// HTTP server "listening" event.
		function onListening() {
			const addr = server.address();
			const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;
			debug(`Listening on ${bind}`);
		}

		app.use(compression());

		/** **************************body parser */
		app.use(
			bodyParser.json({
				limit: "50mb",
				parameterLimit: 1000000
			})
		);
		app.use(
			bodyParser.urlencoded({
				limit: "50mb",
				extended: true,
				parameterLimit: 1000000
			})
		);

		// app.use(
		// 	expressValidator({
		// 		errorFormatter: function(param, msg, value) {
		// 			const namespace = param.split(".");
		// 			const root = namespace.shift();
		// 			let formParam = root;
		// 			while (namespace.length) {
		// 				formParam += `[${namespace.shift()}]`;
		// 			}
		// 			return {
		// 				param: formParam,
		// 				msg: msg
		// 			};
		// 		}
		// 	})
		// );

		/** ******************************************** */
		app.use(cookieSession(config.cookie));
		// express session
		app.use(session(config.session));

		app.use(cookieParser());
		// eval(fs.readFileSync("./helpers/auth.js") + "");
		// appAuth.login(app);

		// load middleware functions
		const Middlewares = require("./common/middlewares");
		global.Middlewares = new Middlewares();

		// define auth helper
		const { verifyAuthToken, checkAuth, verifySecureCode } = require("./helpers/auth");

		/** ******************************************** */
		app.use("/public", express.static(path.join(__dirname, "public")));
		app.locals.use_minified = process.env["APP_ENV"] === "production";
		app.locals.site_title = config.site_title;
		app.locals.app_timestamp = process.env["TIMESTAMP"];

		/**
		 * @param {Request} req
		 * @param {Response} res
		 * @param {CallBack} next
		 * @return {undefined}
		 */
		function setEnvironment(req, res, next) {
			res.locals.sort_url = unescape(req.url);

			// config.base_url = req.protocol + "://" + req.get("host") + "/"; // set base url
			// Store user sessions
			res.locals.user_session = req.user;
			return next();
		}

		app.use(setEnvironment);

		// All Routers
		// Add initial data
		// await require("./services/initial.service.js")();
		app.use("/index", require("./routes/api/index")(express));
		app.use("/users", require("./routes/api/users")(express));
		// // user verifyAuthToken middleware for verify auth token
		app.use(verifyAuthToken);
		app.use("/products", require("./routes/api/product.js")(express));
		app.use("/chats", require("./routes/api/chats.js")(express));
		// Router initialize with auth token
		// app.use(checkAuth);
		// app.use("/bankMaster", require("./routes/api/bankMaster.js")(express));
		console.log("Routes bind.");

		// Function to log the request/response body
		const logReqResBody = function (req, res, next) {
			if (["get", "post", "delete", "put", "head"].indexOf(req.method.toLowerCase()) >= 0) {
				const commonFn = require("./common/functions.js");
				const oldEnd = res.end;
				const chunks = [];
				res.end = function (chunk) {
					if (chunk) {
						chunks.push(chunk);
					}
					try {
						const response = Buffer.concat(chunks).toString("utf8");
						// eslint-disable-next-line prefer-rest-params
						oldEnd.apply(res, arguments);
						commonFn.createReqResLog(req, response);
					} catch (error) {
						console.log(error);
					}
				};
			}
			next();
		};
		// Check if environment is development then use a fn to log the req/res body
		if (config.environment === "development") {
			console.log("Developer routes bind.");
			app.use(logReqResBody);
		}
		// Check if allScheduler status "on" then initialize all cronjobs here
		// try {
		// 	Object.assign(config, {"schedulers": require("./config/schedulers.json")});
		// 	if (config.allScheduler === "on") {
		// 		for (const i in config.schedulers) {
		// 			// Check if scheduler is active then load that scheduler file
		// 			if (config.schedulers[i].active) {
		// 				console.log(`Cron:${i}  ==> ${config.schedulers[i].time}`);
		// 				const options = {
		// 					"cronTime": config.schedulers[i].time
		// 				};
		// 				// Load cron file
		// 				require(`${__dirname}/crons/${config.schedulers[i].file}`)(options);
		// 			}
		// 		}
		// 	}
		// } catch (error) {
		// 	console.log("------------Error on cronjobs initialization----------");
		// 	console.log(error);
		// }
	} catch (err) {
		console.error(err);
		console.log("----------------- DB Error and Exit -----------------");
		process.exit(3); // DB not connect
	}
})();

// async function runMigration(mongodb) {
// 	try {
// 		const MSN = require(`${__dirname}/modules/migration/mongo-stage-migration`);
// 		const msn = new MSN({
// 			mongodb: mongodb,
// 			versionFileDir: `${__dirname}/stage-migration/`,
// 			versions: config.versions
// 		});

// 		// function for before start migration
// 		msn.beforeMigrationStart = function(versions) {
// 			try {
// 				console.log("Following file will be execute in migration");
// 				for (const version of versions) {
// 					console.log(`Version name: ${version.name}, Required: ${version.required ? "Yes" : "No"}`);
// 				}
// 			} catch (error) {
// 				console.log(error);
// 			}
// 		};

// 		// Function for after migration
// 		msn.afterMigrationEnd = function(successVersions, failedVersions) {
// 			try {
// 				for (const failedVersion of failedVersions) {
// 					console.log(`Version name: ${failedVersion.name}, Required: ${failedVersion.required ? "Yes" : "No"}`);
// 				}
// 			} catch (error) {
// 				console.log(error);
// 			}
// 		};

// 		// Start migration
// 		await msn.start();
// 	} catch (error) {
// 		console.log(error);
// 	}
// }
