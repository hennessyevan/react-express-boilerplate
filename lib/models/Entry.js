const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const entrySchema = new Schema(
	{
		time: {
			type: Date,
			default: new Date()
		},
		description: {
			type: String,
			required: false
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true
		},
		pet: {
			type: Schema.Types.ObjectId,
			ref: "Pet",
			required: true
		}
	},
	{
		timestamps: true
	}
);

module.exports = mongoose.model("Entry", entrySchema);
