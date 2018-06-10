const express = require("express");
const app = express();
const PORT = 8080;

app.get("/healthcheck", (req, res) => {
	res.status(200).json({ message: "success" });
});

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});
