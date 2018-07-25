const jwt = require("jsonwebtoken");
const config = require("config");
const tokenService = require("../tokenservice");
const User = require("../models/User");

const getUserById = async (req, res, next) => {
	const { user } = req.decoded;
	if (user && user.id) {
		try {
			const doc = await User.findById(user.id).populate("pets");
			req.user = doc;
			next();
		} catch (e) {
			next(e);
		}
	}
};

const issueToken = async (req, res, next) => {
	const { password } = req.body;
	const { user } = req;
	const match = await user.comparePassword(password);

	if (match) {
		req.token = tokenService.create(user);
		next();
	} else {
		next(new Error("unauthorized"));
	}
};

const verifyToken = async (req, res, next) => {
	const authHeader = req.get("authorization");

	if (!authHeader) {
		next(new Error("unauthorized"));
	}
	const token = authHeader.split(" ")[1]; // grab just the token
	try {
		const decoded = await jwt.verify(token, config.SECRET);
		if (decoded) {
			req.decoded = decoded;
		}
		next();
	} catch (e) {
		next(e);
	}
};

module.exports = {
	issueToken,
	verifyToken,
	getUserById
};
