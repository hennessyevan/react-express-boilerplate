const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const petSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	schedule: [
		{
			startTime: {
				type: String,
				required: true
			},
			endTime: {
				type: String,
				required: true
			}
		}
	]
});

module.exports = mongoose.model("Pet", petSchema);
