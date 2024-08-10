const passport = require("passport");

module.exports.userLogout = (req, res) => {
  // console.log("Logout route hit");
  // console.log("CSRF token from form:", req.body._csrf);
  // console.log("CSRF token from request:", req.csrfToken());
  // console.log("Session:", req.session);
  req.logout((err) => {
    if (err) {
      console.error("Logout error:", err);
      return next(err);
    }
    res.redirect("/");
  });
};