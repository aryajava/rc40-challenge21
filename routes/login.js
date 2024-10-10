const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { getByEmail, create } = require("../models/Login");

router.get("/", function (req, res, next) {
  if (req.session.user) {
    return res.redirect("/todos");
  }
  res.render("login/signin", { title: "Signin - Rubicamp", success: req.flash("success"), error: req.flash("error") });
});

router.get("/register", function (req, res, next) {
  if (req.session.user) {
    return res.redirect("/todos");
  }
  res.render("login/signup", { title: "Register - Rubicamp", error: req.flash("error") });
});

router.post("/", async function (req, res, next) {
  const { email, password } = req.body;
  try {
    const user = await getByEmail(email);
    if (!user || user.email !== email) {
      req.flash("error", "Invalid email");
      return res.redirect("/");
    }
    if (!bcrypt.compareSync(password, user.password)) {
      req.flash("error", "Password is wrong");
      return res.redirect("/");
    }
    req.session.user = user;
    res.redirect("/todos");
  } catch (error) {
    // handle unexpected errors from database
    console.error(error);
    req.flash("error", "An unexpected error occurred");
    res.redirect("/");
  }
});

router.post("/register", function (req, res, next) {
  const { email, password, retype } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  if (password !== retype) {
    req.flash("error", "Password does not match");
    res.redirect("/register");
    return;
  }

  getByEmail(email).then((user) => {
    if (user) {
      req.flash("error", "Email already registered");
      res.redirect("/register");
    } else {
      create(email, hashedPassword).then(() => {
        req.flash("success", "Registration successful. Please sign in.");
        res.redirect("/");
      });
    }
  });
});

module.exports = router;

