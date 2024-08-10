const express = require("express");
const User = require("../../controllers/users/user-logout-controller");
const router = express.Router();

router.post("/logout", User.userLogout);

module.exports = router;