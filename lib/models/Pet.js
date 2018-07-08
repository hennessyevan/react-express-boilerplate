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
				type: Number,
				required: true
			},
			endTime: {
				type: Number,
				required: true
			}
		}
	]
});

module.exports = mongoose.model("Pet", petSchema);
