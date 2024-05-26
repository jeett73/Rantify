/* eslint-disable max-len */
/* eslint-disable no-invalid-this */
module.exports = function(mongoose) {
	const options = {
		collection: "users",
		timestamps: {
			createdAt: "createdOn",
			updatedAt: "updatedOn"
		},
		toObject: {
			virtuals: true
		},
		toJSON: {
			virtuals: true
		},
		// Set collation to make sorting case-insensitive
		collation: {locale: "en_US", strength: 2}
	};
	const userSchema = new mongoose.Schema({
		firstName: {
			type: String
		},
		lastName: {
			type: String
		},
		fullName: {
			type: String
		},
		mobile: {
			type: String,
			index: true
		},
		email: {
			type: String,
			index: true
		},
		password: {
			type: String
		},
		// token for password reset
		token: {
			type: String
		},
		isDeleted: {
			type: Boolean,
			default: false
		},
		address:{
			line1:{
				type: String
			},
			line2:{
				type: String
			},
			city:{
				type: String
			},
			state:{
				type: String
			},
			pinCode:{
				type: String
			},
			country:{
				type: String
			}
		},
		isDeleted : {
			type : Boolean,
			default : false
		}
	}, options);

	return userSchema;
};
