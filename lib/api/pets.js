const express = require("express");
const Router = express.Router;
const router = Router();
const Pet = require("../models/Pet");
const { verifyToken, getUserById } = require("../middleware/auth");

router.get("/", verifyToken, getUserById, async (req, res, next) => {
	if (req.user) {
		const { _id } = req.user;
		try {
			const docs = await Pet.find({ owners: { $in: [_id] } });
			res.status(200).send(docs);
		} catch (e) {
			next(e);
		}
	}
});

router.put("/:petID", verifyToken, async (req, res, next) => {
	const { petID } = req.params;
	const { name } = req.body;
	try {
		Pet.findByIdAndUpdate(petID, { name }).then(doc => {
			res.status(200).send(doc);
		});
	} catch (error) {
		next(error);
	}
});

router.get("/:petID", verifyToken, async (req, res, next) => {
	try {
		const { petID } = req.params;
		const doc = await Pet.findById(petID);
		res.status(200).send(doc);
	} catch (error) {
		next(error);
	}
});

router.delete("/:petID", verifyToken, async (req, res, next) => {
	try {
		const { petID } = req.params;
		Pet.findByIdAndRemove({ _id: petID }).then(doc => {
			res.status(200).send(doc);
		});
	} catch (error) {
		next(error);
	}
});

module.exports = router;
