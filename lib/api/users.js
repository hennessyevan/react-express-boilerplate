const express = require("express");
const Router = express.Router;
const router = Router();
const User = require("../models/User");

router.get("/", async (req, res, next) => {
	try {
		//get all users employing the user model
		const docs = await User.find();
		res.status(200).send(docs);
	} catch (e) {
		next(e);
	}
});

router.post("/", async (req, res, next) => {
	try {
		const doc = new User(req.body);
		console.log(req.body);
		doc.save().then(res.status(201).json(req.body));
	} catch (e) {
		next(e);
	}
});

router.get("/:userID", async (req, res, next) => {
	try {
		const { userID } = req.params;
		const doc = await User.findById(userID).populate("pets");
		res.status(200).send(doc);
	} catch (e) {
		next(e);
	}
});

router.delete("/:userID", async (req, res, next) => {
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
