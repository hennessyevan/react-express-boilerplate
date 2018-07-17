const express = require("express");
const Router = express.Router;
const router = Router();
const Entry = require("../models/Entry");
const moment = require("moment");
const { verifyToken } = require("../middleware/auth");

const today = moment().startOf("day");
const tomorrow = moment().endOf("day");

router.get("/", verifyToken, async (req, res, next) => {
	try {
		const docs = await Entry.find()
			.populate("user", "firstName")
			.populate("pet", "name");
		res.status(200).send(docs);
	} catch (e) {
		next(e);
	}
});

router.post("/add", verifyToken, (req, res, next) => {
	try {
		const doc = new Entry(req.body);
		doc.save().then(res.status(201).json(req.body));
	} catch (e) {
		next(e);
	}
});

router.get("/today", verifyToken, async (req, res, next) => {
	try {
		const docs = await Entry.find({
			time: {
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
});

router.get("/history", async (req, res, next) => {
	try {
		const docs = await Entry.find({
			time: {
				$lte: today.toDate()
			}
		})
			.sort("-time")
			.populate("user", "firstName lastName gravatar")
			.populate("pet", "name");
		res.status(200).send(docs);
	} catch (e) {
		next(e);
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

router.delete("/:entryID", async (req, res, next) => {
	try {
		const { entryID } = req.params;
		Entry.findByIdAndRemove({ _id: entryID }).then(doc => {
			res.status(200).send(doc);
		});
	} catch (error) {
		next(error);
	}
});

module.exports = router;
