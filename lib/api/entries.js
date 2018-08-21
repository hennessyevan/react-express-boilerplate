const express = require("express");
const Router = express.Router;
const mongoose = require("mongoose");
const router = Router();
const Entry = require("../models/Entry");
const moment = require("moment");
const { verifyToken } = require("../middleware/auth");
const { notifyPetFed } = require("../middleware/notify");

router.get("/", verifyToken, async (req, res, next) => {
	const today = moment().startOf("day");
	const tomorrow = moment().endOf("day");
	//Only if pet is specified
	if (req.query.pet) {
		switch (req.query.time) {
			case "today":
				try {
					const docs = await Entry.find({
						pet: { _id: new mongoose.Types.ObjectId(req.query.pet) },
						updatedAt: {
							$gte: today.toDate(),
							$lte: tomorrow.toDate()
						}
					})
						.populate("user", "firstName lastName gravatar")
						.populate("pet", "name");

					res.status(200).send(docs);
				} catch (e) {
					next(e);
				}
				break;
			case "history":
				try {
					const docs = await Entry.find({
						pet: { _id: new mongoose.Types.ObjectId(req.query.pet) },
						updatedAt: {
							$lte: today.toDate()
						}
					})
						.limit(20)
						.sort("-updatedAt")
						.populate("user", "firstName lastName gravatar")
						.populate("pet", "name");
					res.status(200).send(docs);
				} catch (e) {
					next(e);
				}
				break;
			default:
				try {
					const docs = await Entry.find()
						.populate("user", "firstName")
						.populate("pet", "name");
					res.status(200).send(docs);
				} catch (e) {
					next(e);
				}
		}
	}
});

router.post("/", verifyToken, async (req, res, next) => {
	try {
		const doc = new Entry(req.body);
		doc.save().then(async () => {
			res.status(201).json(req.body);
		});
	} catch (e) {
		next(e);
	}
	try {
		notifyPetFed(req.body, next);
	} catch (error) {
		console.error(error);
	}
});

router.get("/:entryID", async (req, res, next) => {
	try {
		const { entryID } = req.params;
		const doc = await Entry.findById(entryID).populate(["user", "pet"]);
		res.status(200).send(doc);
	} catch (e) {
		next(e);
	}
});

router.delete("/:entryID", verifyToken, async (req, res, next) => {
	try {
		const { entryID } = req.params;
		Entry.findByIdAndDelete(entryID).then(doc => {
			res.status(200).send(doc);
		});
	} catch (error) {
		next(error);
	}
});

module.exports = router;
