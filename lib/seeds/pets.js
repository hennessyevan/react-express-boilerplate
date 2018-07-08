const Pet = require("../models/Pet");

const pets = [];

const apollo = new Pet({
	_id: "5b415dc0ece44d5eabd4eccc",
	name: "Apollo",
	schedule: [{ startTime: 0000, endTime: 1400 }, { startTime: 1401, endTime: 2359 }]
});

pets.push(apollo);

module.exports = pets;
