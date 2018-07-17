const express = require("express");
const Router = express.Router;
const router = Router();
const User = require("../models/User");

const { verifyToken } = require("../middleware/auth");

const getUserById = async (req, res, next) => {
	const { user } = req.decoded;
	if (user && user.id) {
		try {
			const doc = await User.findById(user.id).populate("pets");
			req.user = doc;
			next();
		} catch (e) {
			next(e);
		}
	}
};

router.get("/", async (req, res, next) => {
	try {
		//get all users employing the user model
		const docs = await User.find();
		res.status(200).send(docs);
	} catch (e) {
		next(e);
	}
});

router.get("/current", verifyToken, getUserById, (req, res, next) => {
	if (req.user) {
		const { _id, email, firstName, lastName, gravatar, pets } = req.user;
		res.status(200).json({ _id, email, firstName, lastName, gravatar, pets });
	} else {
		next(new Error("not found"));
	}
});

router.put("/current", verifyToken, getUserById, async (req, res, next) => {
	if (req.user) {
		const { _id } = req.user;
		const { email, firstName, lastName } = req.body;
		try {
			User.findByIdAndUpdate(_id, { email, firstName, lastName }).then(doc => {
				res.status(200).send(doc);
			});
		} catch (error) {
			next(error);
		}
	}
});

router.delete("/:userID", verifyToken, async (req, res, next) => {
	try {
		const { userID } = req.params;
		User.findByIdAndRemove({ _id: userID }).then(doc => {
			res.status(200).send(doc);
		});
	} catch (error) {
		next(error);
	}
});

module.exports = router;
