const router = require("express").Router();
const passport = require("passport");
const genPassword = require("../lib/passwordUtils").genPassword;
const connection = require("../config/database");
const User = connection.models.User;
const isAuth = require("./authMiddleware").isAuth;

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/error.html",
    successRedirect: "login-success",
  })
);

router.post(
  "/register",
  (req, res, next) => {
    if (
      !req.body.uname.includes("@") ||
      !req.body.uname.includes(".") ||
      req.body.uname.length <= 3 ||
      req.body.pw.length <= 3
    ) {
      return res.redirect("/error.html");
    }
    const saltHash = genPassword(req.body.pw);

    const salt = saltHash.salt;
    const hash = saltHash.hash;

    const newUser = new User({
      username: req.body.uname,
      hash: hash,
      salt: salt,
    });

    newUser.save().then((user) => {
      console.log(user);
      next();
    });
  },
  passport.authenticate("local", {
    failureRedirect: "/error.html",
    // failureRedirect: "/login-failure",
    successRedirect: "login-success",
  })
);

router.get("/logout", (req, res, next) => {
  req.logout();
  res.redirect("/");
});

router.use("/dashboard.html", isAuth, (req, res, next) => {
  next();
});
router.get("/login-success", (req, res) => {
  res.redirect("/dashboard.html");
});

router.get("/login-failure", (req, res, next) => {
  res.send("You entered the wrong password.");
});

module.exports = router;
