const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const pets = require("../seeds/pets");
const md5 = require("js-md5");

const userSchema = new Schema({
	firstName: {
		type: String,
		required: true
	},
	lastName: {
		type: String,
		required: true
	},
	email: {
		type: String,
		unique: true,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	gravatar: {
		type: String,
		required: false
	},
	pet: {
		type: Schema.Types.ObjectId,
		ref: "Pet",
		default: "5b415dc0ece44d5eabd4eccc"
	}
});

userSchema.pre("save", async function(next) {
	const user = this;

	if (user.isModified("password") || user.isNew) {
		try {
			const hash = await bcrypt.hash(user.password, 10);
			user.password = hash;
			next();
		} catch (e) {
			next(e);
		}
	}
	next();
});

userSchema.pre("findOneAndUpdate", async function(next) {
	const user = this;
	if (user._update.password) {
		try {
			const hash = await bcrypt.hash(user._update.password, 10);
			user._update.password = hash;
			next();
		} catch (e) {
			next(e);
		}
	}
	next();
});

userSchema.pre("findOneAndUpdate", async function(next) {
	const user = this;
	if (user._update.email) {
		try {
			const gravatar = await md5(user._update.email);
			user._update.gravatar = gravatar;
			next();
		} catch (e) {
			next(e);
		}
	}
	next();
});

userSchema.methods.comparePassword = function(password) {
	return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
