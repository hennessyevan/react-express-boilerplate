const express = require("express");
const app = express();
const PORT = 8080;

app.get("/healthcheck", (req, res) => {
	res.status(200).send("ok");
});

app.post("/login", (req, res) => {
	res.status(201).json({ name: "Default User", email: "default@example.com" });
});

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});
