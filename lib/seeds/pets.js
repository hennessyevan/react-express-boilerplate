const Pet = require("../models/Pet");

const pets = [];

const apollo = new Pet({
	name: "Apollo",
	schedule: [{ startTime: 0000, endTime: 1400 }, { startTime: 1401, endTime: 2359 }]
});

pets.push(apollo);

module.exports = pets;
