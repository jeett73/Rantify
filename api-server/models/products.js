module.exports = function (mongoose) {
	const options = {
		collection: "products",
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
		type: {
			type: String
		},
		uploadedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "users",
			index: true
		},
		rent: {
			type: Number
		},
		time: {
			type: String
		},
		description: {
			type: String
		},
		attachments: [{
			name: {
				type: String
			},
			originalName: {
				type: String
			},
			attachmentFor: {
				type: String
			},
			storedIn: {
				type: String,
				enum: ["local", "s3"]
			},
			path: {
				type: String
			},
			date: {
				type: Date
			}
		}],
		isavailable: {
			type: Boolean,
			default: true
		}
	}, options);

	return productSchema;
};
