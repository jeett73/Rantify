/* eslint-disable prefer-rest-params */
const path = require("path");
const winston = require("winston");
const appRoot = path.resolve("./");
module.exports = function(configs, logEvent) {
	let globalConsole;
	const transportsArray = [];
	for (const index in configs.configs) {
		if (!configs.configs[index].enable) {
			continue;
		}
		if (configs.configs[index].type === "file") {
			configs.configs[index].filename = configs.configs[index].filename.replace("${appRoot}", appRoot);
			transportsArray.push(new winston.transports.File(configs.configs[index]));
		} else if (configs.configs[index].type === "console") {
			transportsArray.push(new winston.transports.Console(configs.configs[index]));
		} else {
			console.warn(`Logger: Winston transport type '${configs.configs[index].type}' not supported or not implemented not suppert.`);
		}
	}
	const logger = new winston.Logger({
		transports: transportsArray,
		exitOnError: configs.exitOnError // do not exit on handled exceptions
	});
	// Set global
	if (configs.setGlobal) {
		global.logger = logger;
	}
	// create a stream object with a 'write' function that will be used by `morgan`
	logger.stream = {
		write: function(message, encoding) {
			// use the 'info' log level so the output will be picked up by both transports (file and console)
			logger.info(message);
		}
	};
	// Log separation
	logger.separator = function(msg = "", maxCharPerLine = 80, defaultSeparationChar = "-") {
		let logString = "";
		if (msg !== "") {
			let separationCount = 0;
			const separationLen = maxCharPerLine - (msg.length + 2);
			if (separationLen < 1) {
				separationCount = 1;
			} else {
				separationCount = Math.round(separationLen / 2);
			}
			for (let index = 1; index <= separationCount; index++) {
				logString += defaultSeparationChar;
			}
			logString += ` ${msg} `;
			for (let index = 1; index <= separationCount; index++) {
				logString += defaultSeparationChar;
			}
		} else {
			for (let index = 1; index <= maxCharPerLine; index++) {
				logString += defaultSeparationChar;
			}
		}
		logger.info(logString);
	};
	logger.getModuleLogger = function(name) {
		// console.warn("getModuleLogger() function not tested yet!!!");
		if (name.trim() === "") {
			throw new Error("Please provide module name.");
		}
		return {
			logger: logger,
			log: function(msg) {
				logger.info(`${name}: ${msg}`);
			},
			info: function(msg) {
				logger.info(`${name}: ${msg}`);
			},
			warn: function(msg) {
				logger.warn(`${name}: ${msg}`);
			},
			debug: function(msg) {
				logger.debug(`${name}: ${JSON.stringify(msg, null, 4)}`);
			},
			error: function(err) {
				logger.error(err);
			},
			getName: function() {
				return name;
			}
		};
	};
	logger.replaceDefaultLogger = function() {
		if (!console._stderr || !console._stdout) {
			console.debug("Logger not able to replace global console object");
			return false;
		}
		if (!globalConsole) {
			globalConsole = {};
		}
		// Replace info function
		globalConsole.info = console.info;
		console.info = function() {
			// eslint-disable-next-line prefer-rest-params, prefer-spread
			logger.info.apply(logger, arguments);
		};
		// Replace log function
		globalConsole.log = console.log;
		if (configs.enableLoggerStream === true && logEvent) {
			console.log = function() {
				// eslint-disable-next-line prefer-rest-params, prefer-spread
				logger.info.apply(logger, arguments);
				const logData = {type: "info", message: arguments[0], data: arguments[1]};
				logEvent.emit("logging", logData);
			};
		} else {
			console.log = function() {
				// eslint-disable-next-line prefer-rest-params, prefer-spread
				logger.info.apply(logger, arguments);
			};
		}

		// Replace warning function
		globalConsole.warn = console.warn;
		if (configs.enableLoggerStream === true && logEvent) {
			console.warn = function() {
				// eslint-disable-next-line prefer-rest-params, prefer-spread
				logger.warn.apply(logger, arguments);
				const logData = {type: "warn", message: arguments[0]};
				logEvent.emit("logging", logData);
			};
		} else {
			console.warn = function() {
				// eslint-disable-next-line prefer-rest-params, prefer-spread
				logger.warn.apply(logger, arguments);
			};
		}

		// Replace debug function
		globalConsole.debug = console.debug;
		if (configs.enableLoggerStream === true && logEvent) {
			console.debug = function() {
				// eslint-disable-next-line prefer-rest-params, prefer-spread
				logger.debug.apply(logger, arguments);
				const logData = {type: "debug", message: arguments[0]};
				logEvent.emit("logging", logData);
			};
		} else {
			console.debug = function() {
				// eslint-disable-next-line prefer-rest-params, prefer-spread
				logger.debug.apply(logger, arguments);
			};
		}

		// Replace error function
		globalConsole.error = console.error;
		if (configs.enableLoggerStream === true && logEvent) {
			console.error = function() {
				// eslint-disable-next-line prefer-rest-params, prefer-spread
				logger.error.apply(logger, arguments);
				const logData = {type: "error", message: arguments[0]};
				logEvent.emit("logging", logData);
			};
		} else {
			console.error = function() {
				// eslint-disable-next-line prefer-rest-params, prefer-spread
				logger.error.apply(logger, arguments);
			};
		}

		console.logger = logger;
		console.resetDefaultConsole = function() {
			console.info = globalConsole.info;
			console.log = globalConsole.log;
			console.warn = globalConsole.warn;
			console.debug = globalConsole.debug;
			console.error = globalConsole.error;
			globalConsole = undefined;
			delete console.resetDefaultConsole;
		};
	};
	// Replace global
	if (configs.replaceGlobalConsole) {
		logger.replaceDefaultLogger();
	}
	return logger;
};
