const mongoose = require("mongoose");

var { Schema } = mongoose;

var TokenDevice = new Schema({
	tokenDevice: String,
	userId: String,
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("TokenDevice", TokenDevice);
