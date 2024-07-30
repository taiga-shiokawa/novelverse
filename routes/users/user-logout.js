const express = require("express");
const passport = require("passport");
const router = express.Router();

router.post("/logout", (req, res, next) => {
  console.log("Logout route hit");
  console.log("CSRF token from form:", req.body._csrf);
  console.log("CSRF token from request:", req.csrfToken());
  console.log("Session:", req.session);

  req.logout((err) => {
    if (err) {
      console.error("Logout error:", err);
      return next(err);
    }
    // req.flash("logout-success", "ログアウトしました");
    res.redirect("/");
  });
});

module.exports = router;