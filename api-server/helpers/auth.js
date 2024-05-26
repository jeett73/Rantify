/**
 * authService is used for create function related to authorization
 */
const mongoose = require("mongoose");
const objectId = mongoose.Types.ObjectId;
module.exports = {
	/**
     * verifyAuthToken middleware is used for verify authorization token
     * and decrypt token data from AES cipher
     */
	verifyAuthToken: function(req, res, next) {
		// get token from header
		const token = req.headers["authorization"];
		if (token) {
			// Check if is service flag set in request header then by pass jwt and verify only service token
			
			const jwt = require("jsonwebtoken");
			// verify token
			jwt.verify(token, config.authTokenKey, async function(err, decoded) {
				// check verification details
				if (err == null && decoded != undefined) {
					// decrypt data from token
					const data = decoded.data;
					const loginCode = (req.cookies["loginCode"]) ? req.cookies["loginCode"] : req.headers["logincode"];
					// Get user details from the redis
					// const redisUserData = await RedisObj.hmget(`loginUser:${data._id}:${loginCode}`, "token");
					// Check if redis user data found and its token match match requested header token then allow to process next otherwise return error
					// if (redisUserData.length > 0 && redisUserData[0] != null && redisUserData[0] == token) {
						let userData = await db.models.users.findOne({
							"_id": data._id,
							"isDeleted": false,
							// "isDisabled": false
						},
						"-isDeleted -createdOn -updatedOn -password -updater"
						);
						// Check if user data is null then return error
						if (userData === null) {
							return res.sendLogin();
						}
						userData = JSON.parse(JSON.stringify(userData));
						console.log(JSON.stringify(userData,null,2));
						// set data in req body
						req["loggedUser"] = userData;
						return next();
					// } else {
						// if token verification failed send 401 response
					// 	return res.sendLogin("Your session is expired, Please login");
					// }
				} else {
					// if token verification failed send 401 response
					return res.sendLogin("Your session is expired, Please login");
				}
			});
		} else {
			next();
		}
	},

	// Function to check the user authentication
	checkAuth: function(req, res, next) {
		if (req.loggedUser != undefined && req.loggedUser != null && req.loggedUser != "" && Object.keys(req.loggedUser).length > 0) {
			return next();
		} else {
			// if token verification failed send 401 response
			return res.sendLogin();
		}
	},	/**
	 * Function to verify nginx secure code. if secure code note found or valid then return error response.
	*/

	verifySecureCode: function(req, res, next) {
		// Verify nginx-secure-code header
		const secureCode = req.headers["nginx-secure-code"];
		if (secureCode && secureCode === config.internalSystem.nginxSecureCode) {
			return next();
		}
		return res.sendError({message: "Internal server error."});
	}
};
