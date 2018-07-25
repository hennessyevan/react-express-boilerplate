const Pet = require("../models/Pet");
const User = require("../models/User");
const Entry = require("../models/Entry");
const pets = require("./pets");
const users = require("./users");
const entries = require("./entries");
const config = require("config");
const mongoose = require("mongoose");
const uri = process.env.MONGODB_URI || config.MONGODB_URI;

const truncateDatabase = async () => {
	return Promise.all([User.deleteMany(), Entry.deleteMany(), Pet.deleteMany()]);
};

const makeSeeds = async () => {
	// wait for mongoose to connect to db
	await mongoose.connect(uri);
	// delete all current content in db
	await truncateDatabase();
	// save seeded pets into db
	await Promise.all(pets.map(pet => pet.save()));
	// save user seeds into db
	await Promise.all(users.map(user => user.save()));
	// save seeded entries into db
	await Promise.all(entries.map(entry => entry.save()));
	// close db connection
	mongoose.connection.close();
};

makeSeeds();
