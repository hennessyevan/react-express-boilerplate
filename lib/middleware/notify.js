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
	console.log({ firstName });

	const receipts = users.map(async user => {
		if (user.tokenDevice) {
			try {
				const receipt = await expo.sendPushNotificationsAsync([
					{
						to: user.tokenDevice,
						sound: "default",
						title: `${firstName.firstName} fed ${petName.name}`,
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
	const today = moment().startOf("day");
	const tomorrow = moment().endOf("day");
	try {
		const docs = await Entry.find({
			pet: { _id: new mongoose.Types.ObjectId(req.query.pet) },
			updatedAt: {
				$gte: today.toDate(),
				$lte: tomorrow.toDate()
			}
		});
		if (!docs.length) {
			const receipts = users.map(async user => {
				if (user.tokenDevice) {
					try {
						await expo.sendPushNotificationsAsync([
							{
								to: user.tokenDevice,
								sound: "default",
								title: `${petName.petName} has not been fed yet`,
								body: `For ${time} schedule.`
							}
						]);
						res.json({ receipts });
					} catch (error) {
						console.error(error);
					}
				}
			});
		}
	} catch (e) {
		console.error(e);
	}
};

module.exports = {
	notifyPetFed,
	notifyPetNotFed
};
