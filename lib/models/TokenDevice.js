const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TokenDevice = new Schema(
	{
		tokenDevice: String,
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User"
		}
	},
	{
		timestamps: true
	}
);

module.exports = mongoose.model("TokenDevice", TokenDevice);
