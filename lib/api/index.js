const express = require("express");
const Router = express.Router;
const router = Router();

router.use("/auth", require("./auth"));
router.use("/users", require("./users"));
router.use("/entries", require("./entries"));
router.use("/pets", require("./pets"));

module.exports = router;
