const express = require("express");
const Router = express.Router;
const router = Router();
const Pet = require("../models/Pet");
const { verifyToken } = require("../middleware/auth");

// router.get("/", async (req, res, next) => {
// 	try {
// 		const docs = await Pet.find();
// 		res.status(200).send(docs);
// 	} catch (e) {
// 		next(e);
// 	}
// });

// router.post("/", verifyToken, async (req, res, next) => {
// 	try {
// 		const doc = new Pet(req.body);
// 		console.log(req.body);
// 		doc.save().then(res.status(201).json(req.body));
// 	} catch (error) {
// 		next(error);
// 	}
// });

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
