const validates = require("./validations.js");
// class for middleware functions
const middlewares = class {
	/**
	 * constructor
	 */
	constructor() {}

	/**
	 * Function to validate user inputs
	 * @param {string} modelName , name of model to validate
	 * @returns
	 */
	validations(modelName, messageCode) {
		return function(req, res, next) {
			// Here validates is variable that we defined in top of the page, which has the validations rules of each model
			const model = validates[modelName];
			req.checkBody(model);
			const errors = req.validationErrors();
			const validationErrors = {};
			if (errors) {
				for (const inx in errors) {
					if (validationErrors[errors[inx].param] == undefined) {
						validationErrors[errors[inx].param] = errors[inx].msg;
					}
				}
			}
			// Check if validation error then return with error, otherwise go for next
			if (Object.keys(validationErrors).length > 0) {
				return res.status(400).send({
					type: "error",
					message: config.messages["1005"],
					status: 400,
					validationErrors: validationErrors,
					messageCode: messageCode
				});
			} else {
				next();
			}
		};
	}

	// eslint-disable-next-line valid-jsdoc
	/**
	 * Function to check the authorization of request based on the user role
	 * @param {string} access name of route to check its access
	 */
	isAccessible(access) {
		return function(req, res, next) {
			// Check if requested user has access of requested module access then allow to access otherwise return with error
			if (req.loggedUser.moduleAccess != undefined && req.loggedUser.moduleAccess.indexOf(access) > -1) {
				next();
			} else {
				console.log(`${access} not accessible to profile. User ${req.loggedUser && req.loggedUser.email}`);
				res.sendUnauthorized(config.messages["1306"], "1306");
			}
		};
	}
};

module.exports = middlewares;
