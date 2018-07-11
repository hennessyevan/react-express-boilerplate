const User = require("../models/User");
const pets = require("./pets");

const users = [];

const evan = new User({
	_id: "5b43c12a667060aeb4d2478a",
	firstName: "Evan",
	lastName: "Hennessy",
	email: "evan@email.com",
	gravatar: "15c4638d71a3e5ee3f445a1fe98cffa5",
	pets: [pets[0]]
});

users.push(evan);

const brendan = new User({
	firstName: "Brendan",
	lastName: "Hennessy",
	email: "brendan@email.com"
});

users.push(brendan);

module.exports = users;
