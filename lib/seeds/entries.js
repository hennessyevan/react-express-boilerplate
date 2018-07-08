const Entry = require("../models/Entry");
const users = require("./users");
const pets = require("./pets");

const entries = [];

const today = new Entry({
	user: users[0],
	pet: pets[0]
});

entries.push(today);

const history1 = new Entry({
	time: new Date("2018-07-04"),
	user: users[0],
	pet: pets[0]
});

entries.push(history1);

const history2 = new Entry({
	time: new Date("2018-07-05"),
	user: users[1],
	pet: pets[0]
});

entries.push(history2);

module.exports = entries;
