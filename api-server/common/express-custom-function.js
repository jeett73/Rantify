module.exports = function(express) {
	global.HTTP_STATUS_CODES = {
		OK: 200, // For send data, message
		CREATED: 201, // Resource Created
		ACCEPTED: 202, // Update, edit, delete request accepted
		NO_BODY: 204, // No content
		PARTIAL_SUCCESS: 206, // Partial content, request success but some part might failed
		NO_MODIFIED: 304, // No Data change
		BAD_REQUEST: 400, // Validation failed
		UNAUTHORIZED: 401, // Access without login
		FORBIDDEN: 403, // Forbidden
		NOT_FOUND: 404, // URL, Route, Page not found
		METHOD_NOT_ALLOWED: 405, // HTTP method
		CONFLICT: 409, // Duplicate, Already identity available
		UNSUPPORTED_TYPE: 415, // Unsupported media type
		LOCKED: 423, // Resource Locked
		ILLEGAL_ACCESS: 451, // Resource restrict by admin/system
		SERVER_ERROR: 500,
		BAD_GATEWAY: 502, // Not able to connect third party service or other service.
		SERVICE_UNAVAILABLE: 503, // Current service not available
		NOT_ACCEPTABLE: 406 // Request is not acceptable as some thing is missing
	};
	express.response.sendNotAcceptable = function(message, messageCode) {
		this.status(406).json({
			status: 406,
			message: message,
			messageCode: messageCode || undefined
		});
	};
	express.response.sendBadGateway = function(message, messageCode) {
		this.status(502).json({
			status: 502,
			message: message,
			messageCode: messageCode || undefined
		});
	};
	express.response.sendSuccess = function(data = {}, customMessage, messageCode) {
		this.status(200).send({
			status: 200,
			data: data,
			message: customMessage || undefined,
			messageCode: messageCode || undefined
		});
	};
	express.response.sendInvalidIdForList = function(customMessage, messageCode) {
		this.status(200).send({
			status: 200,
			data: {list: [], recordsTotal: 0, recordsFiltered: 0},
			message: customMessage || undefined,
			messageCode: messageCode || undefined
		});
	};
	express.response.sendDuplicate = function(message, messageCode) {
		this.status(409).send({
			status: 409,
			message: message,
			messageCode: messageCode || undefined
		});
	};
	express.response.sendIsExists = function(response) {
		const code = response ? 200 : 404; // 200 = Resource exists, 404 = Resource does not exit

		this.status(code).send();
	};
	express.response.sendCreated = function(message, data = {}, messageCode) {
		this.status(201).json({
			status: 201,
			data: data,
			message: message,
			messageCode: messageCode || undefined
		});
	};
	express.response.sendUpdated = function(message, data = {}, messageCode) {
		this.status(202).json({
			status: 202,
			data: data,
			message: message,
			messageCode: messageCode || undefined
		});
	};
	express.response.sendDeleted = function(message, messageCode) {
		this.status(202).json({
			status: 202,
			message: message,
			messageCode: messageCode || undefined
		});
	};
	express.response.sendInvalidRequest = function(message, messageCode) {
		this.status(400).json({
			status: 400,
			message: message,
			messageCode: messageCode || undefined
		});
	};
	express.response.sendMessage = function(title, message, messageCode) {
		// We've set code 200 to send response message in body
		this.status(200).json({
			status: 204,
			messageOnly: true,
			title: title,
			message: message,
			messageCode: messageCode || undefined
		});
	};
	express.response.sendResourceNotFound = function(message, messageCode) {
		this.status(404).json({
			status: 404,
			message: message,
			messageCode: messageCode || undefined
		});
	};
	express.response.sendLogin = function(message, fromLogin = false, messageCode) {
		if (!fromLogin) {
			// Based on RFC:https://tools.ietf.org/html/rfc6750
			this.set(
				"WWW-Authenticate",
				"Bearer realm=\"Aura\", error=\"invalid_token\", error_description=\"You are not authorize to access.\""
			);
		}
		this.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({
			status: HTTP_STATUS_CODES.UNAUTHORIZED,
			title: fromLogin ? "Login Failed" : "",
			message: message || "You are not authorize to access.",
			messageCode: messageCode || undefined
		});
	};
	express.response.sendUnauthorized = function(message, messageCode) {
		this.status(HTTP_STATUS_CODES.FORBIDDEN).json({
			status: HTTP_STATUS_CODES.FORBIDDEN,
			message: message || "You are not allowed to access.",
			messageCode: messageCode || undefined
		});
	};

	// eslint-disable-next-line complexity
	express.response.sendError = function(err, messageCode) {
		if (err.name === "MulterError") {
			// Multer Error
			if (err.code === "LIMIT_FILE_SIZE") {
				this.status(413).json({
					status: 413,
					expose: true,
					message: err.message,
					messageCode: messageCode || undefined
				});
			}
		} else if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
			// JSON validation field
			this.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
				status: HTTP_STATUS_CODES.BAD_REQUEST,
				expose: false,
				message: "JSON validation failed.",
				messageCode: messageCode || undefined
			});
		} else if (err.name === "ValidationError") {
			// Manage Mongoose error
			const message = [];
			let title = "Validation Error";
			let code = HTTP_STATUS_CODES.BAD_REQUEST;
			let expose = true;
			const fields = {
				required: [],
				len: [],
				castError: []
			};
			for (const field in err.errors) {
				if (Object.prototype.hasOwnProperty.call(err.errors, field)) {
					continue;
				}
				switch (err.errors[field].kind) {
				case "required":
					fields.required.push(field);
					break;
				case "maxlength":
				case "minlength":
					fields.len.push(field);
					break;
				case "String":
				case "Number":
					if (err.errors[field].name === "CastError") {
						fields.castError.push(field);
					}
					break;
				default:
					break;
				}
			}
			if (fields.required.length > 0) {
				message.push(`Following fields are required: ${fields.required.join(", ")}`);
			}
			if (fields.len.length > 0) {
				message.push(`Following fields do not match length criteria: ${fields.len.join(", ")}`);
			}
			if (fields.castError.length > 0) {
				message.push(`Following fields do not have valid value: ${fields.castError.join(", ", s)}`);
			}
			if (message.length === 0) {
				console.error(err);
				title = "Error";
				code = 500;
				expose = false;
				message.push("Unknown Error");
			}
			this.status(code).json({
				data: err.data || undefined,
				status: code,
				expose: expose,
				messageCode: messageCode || undefined,
				message: message.join(", "),
				title: title
			});
		} else if (err.name === "MongoError") {
			if (err.code === 11000) {
				// TODO:Manage duplicate key error.
				let msg = "Duplicate Value.";
				const fields = [];
				try {
					const field = err.errmsg.split("index:")[1].split("dup key")[0].split("_")[0].trim();
					let value = "";
					try {
						value = err.errmsg.split("index:")[1].split("dup key")[1].split("\"")[1].trim();
					} catch (err) {}
					if (value === "") {
						msg = `Value already exist or duplicate for '${field}' field`;
					} else {
						msg = `'${value}' value already exist or duplicate for '${field}' field`;
					}
					const fieldValue = {};
					fieldValue[field] = value;
					fields.push(fieldValue);
				} catch (err) {
					msg = "Duplicate Value.";
				}
				this.status(HTTP_STATUS_CODES.CONFLICT).json({
					data: err.data || undefined,
					status: HTTP_STATUS_CODES.CONFLICT,
					expose: true,
					title: "Value already exists.",
					message: msg,
					fields: fields,
					messageCode: messageCode || undefined
				});
				console.debug(`Duplicate value: ${err.errmsg}`);
			} else {
				console.error("Mongo error error-code: ", err);
				this.status(HTTP_STATUS_CODES.SERVER_ERROR).json({
					data: err.data || undefined,
					status: HTTP_STATUS_CODES,
					expose: false,
					title: "System Error",
					messageCode: messageCode || undefined,
					message: "Unknown database error."
				});
			}
		} else {
			const code = err.statusCode || err.code || HTTP_STATUS_CODES.SERVER_ERROR;
			if (code === HTTP_STATUS_CODES.SERVER_ERROR) {
				console.error(err);
			}
			console.log(code);
			const expose = HTTP_STATUS_CODES.SERVER_ERROR !== code;
			this.status(code).json({
				data: err.data || undefined,
				messageCode: messageCode || undefined,
				status: code,
				expose: expose,
				message: err.message
			});
		}
	};

	express.response.sendAlreadyExists = function(message, data = null, messageCode) {
		this.status(HTTP_STATUS_CODES.CONFLICT).json({
			status: HTTP_STATUS_CODES.CONFLICT,
			message: message,
			data: data ? data : [],
			messageCode: messageCode || undefined
		});
	};
};
