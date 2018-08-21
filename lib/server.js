const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const bodyParser = require("body-parser");
const app = express();
const router = require("./api");
const PORT = process.env.PORT || config.PORT;
const uri = process.env.MONGODB_URI || config.MONGODB_URI;
const path = require("path");
const cron = require("node-cron");
const { notifyPetNotFed } = require("./middleware/notify");

app.use("/", express.static(path.join(__dirname, "../build")));

app.use(bodyParser.json());

app.use(router);

app.use((err, req, res, next) => {
	res.status(500).json({ err: err.toString() });
});

app.listen(PORT, async () => {
	await mongoose.connect(uri);
	console.log(`Listening on ${PORT}`);
});

cron.schedule("* 10 * * *", () => {
	notifyPetNotFed("5b415dc0ece44d5eabd4eccc", "morning");
});

cron.schedule("* 20 * * *", () => {
	notifyPetNotFed("5b415dc0ece44d5eabd4eccc", "evening");
});

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "../build/index.html"));
});
