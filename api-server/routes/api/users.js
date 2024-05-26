/* eslint-disable max-len */
module.exports = function (express) {
	const router = express.Router();
	const Forge = require("node-forge");
	const commonFn = require("../../common/functions.js");
	// Create user service object
	const JWT = require("jsonwebtoken");
	router.post("/user/save",  async function (req, res, next) {
		try {
			console.log(req.body);
			const postData = req.body;
			// Convert user email to lowercase
			postData.email = (postData.email) ? postData.email.toLowerCase() : postData.email;
			// Calling a function to check user email Unique if user found then return with error
			await checkUserEmailUniqueWhileAdd(req, res);
			// Calling a function to check user mobile Unique if user found then return with error
			await checkUserMobileUniqueWhileAdd(req, res);
			// Check if postData.email is truthy then convert it to lowercase
			if (postData.email) {
				postData.email = postData.email.toLowerCase();
			}
			// Convert password in hash using sha512
			// postData.password = Forge.md.sha512.create().update(postData.password).digest().toHex();
			// postData.creator = req.loggedUser._id;
			const createdUser = await db.models.users.create(postData);
			// Calling mailer function to send email to created user with its default password
			// mailer.sendTemplateMail("welcome-mail", {
			// 	"user": {
			// 		"name": createdUser.fullName,
			// 		"password": password,
			// 		"siteTitle": config.site_title,
			// 		"loginURL": config.base_url
			// 	}
			// }, {
			// 	"to": createdUser.email,
			// 	"queue": false
			// });
			// Set options of send SMS to created user
			// const smsOptions = {
			// 	"queue": false,
			// 	"template": "welcome-user",
			// 	"sendBy": "system",
			// 	"receiver": createdUser.mobile,
			// 	// Object to parse template its variable
			// 	"data": {
			// 		"user": {
			// 			"name": createdUser.fullName,
			// 			"password": password,
			// 			"siteTitle": config.site_title,
			// 			"loginURL": config.base_url
			// 		}
			// 	}
			// };
			// smsService.sendSMS(smsOptions);
			res.sendCreated(config.messages["1001"], createdUser, "1001");
		} catch (err) {
			catchErrorLogs(config.messages["1002"], "1002");
			catchErrorLogs(err);
			res.sendError(err, "1002");
		}
	});

	function checkUserEmailUniqueWhileAdd(req, res) {
		return new Promise(async (resolve) => {
			try {
				// Fetch the user detail based on the passed params
				const user = await db.models.users.findOne({
					email: req.body.email,
					isDeleted: false
				}, "_id email", {
					"lean": true
				});
				// Check if user data is not null then return with error
				if (user !== null) {
					return res.sendDuplicate(`User email '${user.email}' already exists.`);
				}
				resolve();
			} catch (error) {
				reject(error);
			}
		});
	}

	function checkUserMobileUniqueWhileAdd(req, res) {
		return new Promise(async (resolve) => {
			try {
				// Fetch the user detail based on the passed params
				const user = await db.models.users.findOne({
					mobile: req.body.mobile,
					isDeleted: false
				}, "_id mobile", {
					"lean": true
				});
				// Check if user data is not null then return with error
				if (user !== null) {
					return res.sendDuplicate(`User mobile '${user.mobile}' already exists.`);
				}
				resolve();
			} catch (error) {
				reject(error);
			}
		});
	}

	router.post("/logout",async function(req,res,next){
		try {
			if(req.loggedUser && req.loggedUser._id){
				res.clearCookie("loginCode");
				res.clearCookie("token");
			}
			res.sendMessage("success", "Logout Successfully");
		} catch (error) {
			catchErrorLogs(config.messages["1010"], "1010");
			catchErrorLogs(error);
			res.sendError(error, "1010");
		}
	})
	return router;
};
