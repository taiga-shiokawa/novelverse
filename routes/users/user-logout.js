const express = require("express");
const passport = require("passport");
const router = express.Router();

router.post("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    // req.flash("logout-success", "ログアウトしました");
    res.redirect("/novel/home");
  });
});

module.exports = router;