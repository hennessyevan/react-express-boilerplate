const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
	firstName: {
		type: String,
		required: true
	},
	lastName: {
		type: String,
		required: true
	},
	email: {
		type: String,
		unique: true,
		required: true
	},
	gravatar: {
		type: String,
		required: false
	},
	pets: [
		{
			type: Schema.Types.ObjectId,
			ref: "Pet"
		}
	]
});

module.exports = mongoose.model("User", userSchema);
