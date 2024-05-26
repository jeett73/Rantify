// var model = require('../models/users')
const md5 = require("md5");
const usersModel = require("../models/app-users");
module.exports = {
	login: function(app) {
		const passport = require("passport");
		const LocalStrategy = require("passport-local").Strategy;
		app.use(passport.initialize());
		app.use(passport.session());
		passport.use(
			new LocalStrategy(
				{
					usernameField: "email",
					passwordField: "password",
					passReqToCallback: true
				},
				/** function for login user
         * @param  {string} username
         * @param  {string} password
         * @param  {Function} done
         * @return {[type]}
         */
				async function(req, username, password, done) {
					console.log("login");
					// console.log(username)
					// console.log(password)
					const user = await usersModel.Model.findOne({
						email: username
					});
					// console.log(user);
					if (!user) {
						console.log("user is not available");

						return done(null, false, {
							message: "User is not available"
						});
					} else {
						if (user.isEmailVerified == true) {
							if (user.password == md5(password)) {
								console.log(user);

								return done(null, user);
							} else {
								console.log("Incorrect PAssword");

								return done(null, false, {
									message: "Incorrect password"
								});
							}
						} else {
							return done(null, false, {
								message: "You are not OTP Verified "
							});
						}
					}

					// if (username == 'rakesh@wcg.com' && password == 'rakesh') {
					//     return done(null, {
					//         username: username,
					//         name: "Rakesh"
					//     });
					// } else {
					//     return done(null, false, {
					//         message: 'Invalid username or password'
					//     });
					// }
				}
			)
		);
		passport.serializeUser(function(user, done) {
			console.log("serializeUser");
			done(null, user.id);
		});
		passport.deserializeUser(function(id, done) {
			dbObj.models.users.findById(id, function(err, user) {
				done(err, user);
			});
			// console.log('deserializeUser')
			// done(null, user);
		});
	}
};
