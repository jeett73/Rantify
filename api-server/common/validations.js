// Define validations rules for required models
module.exports = {
	"user-login": {
		username: {
			trim: true,
			notEmpty: true,
			errorMessage: "Please enter username"
		},
		password: {
			trim: true,
			notEmpty: true,
			errorMessage: "Please enter password",
			isLength: {
				options: {
					min: 6,
					max: 20
				},
				errorMessage: "Password must be between 6-20 characters long"
			}
		}
	}
};
