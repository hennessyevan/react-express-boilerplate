const moment = require("moment");
const Expo = require("exponent-server-sdk");
const User = require("../models/User");
const Pet = require("../models/Pet");
let expo = new Expo();

async function notifyPetFed(body, next) {
	const { user, pet } = body;
	const users = await User.find({ pet }, "tokenDevice");
	const petName = await Pet.findById(pet, "name");
	const firstName = await User.findById(user, "firstName");

	const receipts = users.map(async user => {
		if (user.tokenDevice) {
			try {
				const receipt = await expo.sendPushNotificationsAsync([
					{
						to: user.tokenDevice,
						sound: "default",
						title: `${firstName} fed ${petName}`,
						body: "Just Now"
					}
				]);
				res.json({ receipt });
			} catch (error) {
				next(error);
			}
		}
	});
}

const notifyPetNotFed = async (pet, time) => {
	const users = await User.find({ pet }, "tokenDevice");
	const petName = await Pet.findById(pet, "name");

	const receipts = users.map(async user => {
		if (user.tokenDevice) {
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
				console.error(error);
			}
		}
	});
};

module.exports = {
	notifyPetFed,
	notifyPetNotFed
};
