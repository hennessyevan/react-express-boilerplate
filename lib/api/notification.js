const express = require("express");
const Router = express.Router;
const router = Router();
const TokenDevice = require("../models/TokenDevice");
const Expo = require("exponent-server-sdk");
const config = require("config");

const secretCodeMiddleware = (req, res, next) => {
	const secretCode = req.body.secretCode || req.query.secretCode;
	console.log(req.body);
	if (secretCode === config.SECRET) {
		next();
	} else {
		res.json({ error: "'secretCode' doesn't match" });
	}
};

let expo = new Expo();

async function checkExistsToken(tokenDevice) {
	let device = await TokenDevice.findOne({ tokenDevice });
	if (device) return true;
	else return false;
}

/**
 * List token device
 */
router.get("/list-token-device", async (req, res, next) => {
	try {
		let devices = await TokenDevice.find({});
		res.json(devices);
	} catch (error) {
		next(error);
	}
});

/**
 * Push notification
 * @tokenDevice: string
 * @message: string
 * @data: object
 */
router.post("/push-notification", async (req, res, next) => {
	const { message, data, tokenDevice } = req.body;
	try {
		let receipts = await expo.sendPushNotificationsAsync([
			{
				to: tokenDevice,
				sound: "default",
				body: message,
				data: data
			}
		]);
		res.json({ receipts });
	} catch (error) {
		next(error);
	}
});

/**
 * Register token device
 * @tokenDevice: string
 * @userId: string
 */
router.post("/register-token-device", secretCodeMiddleware, async (req, res) => {
	try {
		const { tokenDevice, userId } = req.body;
		const isExists = checkExistsToken(tokenDevice);
		if (isExists) {
			res.json({
				error: true,
				message: "Token have registed"
			});
			return;
		}
		let device = new TokenDevice({
			tokenDevice,
			userId
		});
		device = await device.save();
		res.json({ device });
	} catch (error) {
		next(error);
	}
});

module.exports = router;
