const express = require("express");
const Router = express.Router;
const router = Router();
const Pet = require("../models/Pet");

router.get("/", async (req, res, next) => {
	try {
		const docs = await Pet.find();
		res.status(200).send(docs);
	} catch (e) {
		next(e);
	}
});

router.post("/", async (req, res, next) => {
	try {
		const doc = new Pet(req.body);
		console.log(req.body);
		doc.save().then(res.status(201).json(req.body));
	} catch (e) {
		next(e);
	}
});

router.get("/:petID", async (req, res, next) => {
	try {
		const { petID } = req.params;
		const doc = await Pet.findById(petID);
		res.status(200).send(doc);
	} catch (e) {
		next(e);
	}
});

router.delete("/:petID", async (req, res, next) => {
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
