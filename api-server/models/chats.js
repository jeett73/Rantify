module.exports = function (mongoose) {
	const options = {
		collection: "chats",
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
		collation: { locale: "en_US", strength: 2 }
	};
	const productSchema = new mongoose.Schema({
		message: {
			type: String
		},
		sendBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "users",
			index: true
		},
		receivedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "users",
			index: true
		},
		isDeleted: {
			type: Boolean,
			default: false
		}
	}, options);

	return productSchema;
};
