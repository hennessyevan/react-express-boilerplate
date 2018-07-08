const User = require("../models/User");
const pets = require("./pets");

const users = [];

const evan = new User({
	firstName: "Evan",
	lastName: "Hennessy",
	pets: [pets[0]]
});

users.push(evan);

const brendan = new User({
	firstName: "Brendan",
	lastName: "Hennessy"
});

users.push(brendan);

module.exports = users;
