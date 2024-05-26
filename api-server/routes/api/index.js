module.exports = function (express) {
	const router = express.Router();
	const JWT = require("jsonwebtoken");
    
    router.post("/login", async function (req, res, next) {
        try {
            console.log(req.body);
            // Prepare object to get user details
            const conditions = {
                isDeleted: false,
                email: req.body.email.toLowerCase(),
                password : req.body.password
            };
            // Get user detsails from the database
            let user = await db.models.users.findOne(conditions);
            // Check if user is not found then return with error
            if (user === null) {
                return res.sendLogin(config.messages["1003"], true, "1003");
            }
            user = JSON.parse(JSON.stringify(user));
            // Create response object
            const response = {};
            // Prepare JWT Payload Object
            const jwtPayloadObject = {
                "_id": user._id,
            };
            // Generate token for user authentication using JWT
            const token = JWT.sign({
                data: jwtPayloadObject
            },
                config.authTokenKey
            );
            // console.log("================================");
            // console.log(token);
            // user.token = token;
            // user.deviceType = (req.body.deviceType) ? req.body.deviceType : "web";
            // Set user selected territories data in user object
            // user.userTerritories = (user.userTerritories) ? user.userTerritories : [];
            const generator = require("generate-password");
            // Generate random 4 digit unique code for store login user detail
            const uniqueCode = generator.generate({
                length: 4,
                numbers: true
            });
            user.loginCode = uniqueCode;
			res.cookie("loginCode", uniqueCode);
			res.cookie("token", token);

            response.token = token;
            response.user = user;
            // response.locationInterval = locationInterval.value;

            console.log(response);
            res.sendSuccess(response, config.messages["1005"], "1005");
        } catch (err) {
            console.log(err);
            catchErrorLogs(config.messages["1004"], "1004");
            catchErrorLogs(err);
            return res.sendError(err, "1004");
        }
    });

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
			console.log(err);
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


	router.get("/test/test",async function(req,res,next){
		try {
			console.log("===================");
			res.sendFile(__dirname + '/index01.html');
		} catch (error) {
			
		}
	})
	// router.get("/test/test/test",async function(req,res,next){
	// 	try {
	// 		const fs = require("fs");
	// 		const path = require("path");
	// 		const test = fs.readFileSync(path.join(process.cwd(), "index.html"), "utf8");
	// 		const puppeteer = require("puppeteer");
	// 		 // Set pdf page options
	// 		 const browser = await puppeteer.launch({
	// 			headless: true,
	// 			args: ["--no-sandbox"],
	// 			defaultViewport: null
	// 		});
	// 		// create a new page
	// 		const page = await browser.newPage();
	// 		// await page.emulateMediaType("screen");
	// 		// Get HTML to convert into PDF
	// 		await page.setContent(test);
	// 		// Format start date and end date of duration
	// 		// PDF file configurations
	// 		const pdf = await page.pdf({
	// 			printBackground: true,
	// 			displayHeaderFooter: false,
	// 			format: "A4",
	// 			margin: {"left": "1cm", "right": "1cm"}
	// 		});
	// 		// close the browser
	// 		await browser.close();

	// 		res.setHeader("Content-Disposition", `attachment; filename=shreyansh.pdf`);
	// 		res.setHeader("Access-Control-Expose-Headers", "Content-Disposition");
	// 		res.set("Content-Type", "application/pdf");
	// 		res.write(pdf);
	// 		return res.end();	
	// 	} catch (error) {
	// 		console.log(error);
	// 	}
	// })
	return router;
};