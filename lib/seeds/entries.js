const Entry = require("../models/Entry");
const users = require("./users");
const pets = require("./pets");
const moment = require("moment");

const entries = [];

const today = new Entry({
	updatedAt: moment(),
	user: users[0],
	pet: pets[0],
	description: "Dog was happy"
});

entries.push(today);

const history1 = new Entry({
	updatedAt: new Date(moment().add(-1, "days")),
	user: users[0],
	pet: pets[0],
	description: "Some description"
});

entries.push(history1);

const history2 = new Entry({
	updatedAt: new Date(moment().add(-2, "days")),
	user: users[1],
	pet: pets[0],
	description: "Some other description"
});

entries.push(history2);

module.exports = entries;
