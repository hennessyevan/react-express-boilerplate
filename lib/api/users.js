const express = require("express");
const Router = express.Router;
const router = Router();
const User = require("../models/User");
const Pet = require("../models/Pet");

const { verifyToken, getUserById } = require("../middleware/auth");

router.get("/", verifyToken, async (req, res, next) => {
	try {
		//get all users employing the user model
		const docs = await User.find().limit(10);
		res.status(200).send(docs);
	} catch (e) {
		next(e);
	}
});

router.get("/current", verifyToken, getUserById, async (req, res, next) => {
	if (req.user) {
		const { _id, email, firstName, lastName, gravatar, pet } = req.user;
		const petObject = await Pet.findById(pet).populate();
		res.status(200).json({ _id, email, firstName, lastName, gravatar, pet: petObject });
	} else {
		next(new Error("not found"));
	}
});

router.put("/current", verifyToken, getUserById, async (req, res, next) => {
	if (req.user) {
		const { _id } = req.user;
		const { email = req.user.email, firstName = req.user.firstName, lastName = req.user.lastName, password } = req.body;

		try {
			User.findByIdAndUpdate(_id, { email, firstName, lastName, password }).then(doc => {
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
