const md5 = require("js-md5");

const getGravatarByEmail = async (req, res, next) => {
	try {
		const { email } = req.body;
		const gravatarSlug = await md5(email);
		req.body.gravatar = gravatarSlug;
		next();
	} catch (error) {
		next(error);
	}
};

module.exports = {
	getGravatarByEmail
};
