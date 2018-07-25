const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const bodyParser = require("body-parser");
const app = express();
const router = require("./api");
const PORT = process.env.PORT || config.PORT;
const uri = process.env.MONGODB_URI || config.MONGODB_URI;

app.use(bodyParser.json());

app.use(router);

app.use((err, req, res, next) => {
	res.status(500).json({ err: err.toString() });
});

app.listen(PORT, async () => {
	await mongoose.connect(uri);
	console.log(`Listening on ${PORT}`);
});
