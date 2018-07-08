const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const uri = "mongodb://localhost:27017/dogfeed";
const app = express();
const PORT = 8080;

app.use(bodyParser.json());

app.use("/users", require("./api/users"));
app.use("/pets", require("./api/pets"));
app.use("/entries", require("./api/entries"));

app.use((err, req, res, next) => {
	res.status(500).json({ err: err.toString() });
});

app.listen(PORT, async () => {
	await mongoose.connect(uri);
	console.log(`Listening on ${PORT}`);
});
