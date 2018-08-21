const moment = require("moment");
const Expo = require("exponent-server-sdk");
const User = require("../models/User");
const Pet = require("../models/Pet");
let expo = new Expo();

const notifyPetFed = async body => {
	const { user, pet } = body;
	const users = await User.find({ pet }, "tokenDevice");
	const petName = await Pet.findById(pet, "name");
	const firstName = await User.findById(user, "firstName");

	const receipts = users.map(async user => {
		try {
			await expo.sendPushNotificationsAsync([
				{
					to: user.tokenDevice,
					sound: "default",
					title: `${firstName} fed ${petName}`,
					body: "Just Now"
				}
			]);
			res.json({ receipts });
		} catch (error) {
			next(error);
		}
	});
};

const notifyPetNotFed = async (pet, time) => {
	const users = await User.find({ pet }, "tokenDevice");
	const petName = await Pet.findById(pet, "name");

	const receipts = users.map(async user => {
		try {
			await expo.sendPushNotificationsAsync([
				{
					to: user.tokenDevice,
					sound: "default",
					title: `${petName} has not been fed yet`,
					body: `For ${time} schedule.`
				}
			]);
			res.json({ receipts });
		} catch (error) {
			next(error);
		}
	});
};

module.export = {
	notifyPetFed,
	notifyPetNotFed
};
