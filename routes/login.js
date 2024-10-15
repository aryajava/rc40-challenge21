const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { getByEmail, create } = require("../models/Login");

const checkSession = (req, res, next) => {
  if (req.session.user) {
    res.redirect("/todos");
    return;
  }
  next();
};

router.get("/", checkSession, (req, res) => {
  res.render("login/signin", { title: "Signin - Rubicamp", success: req.flash("success"), error: req.flash("error") });
});

router.get("/register", checkSession, function (req, res) {
  res.render("login/signup", { title: "Register - Rubicamp", success: req.flash("success"), error: req.flash("error") });
});

router.post("/", checkSession, async (req, res) => {
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

router.post("/register", checkSession, async (req, res) => {
  const { email, password, retype } = req.body;
  if (password !== retype) {
    req.flash("error", "Password does not match");
    res.redirect("/register");
    return;
  }
  if (password.trim() === "") {
    req.flash("error", "Password is required");
    res.redirect("/register");
    return;
  }
  try {
    const getUser = await getByEmail(email);
    if (getUser) {
      req.flash("error", "Email already registered");
      res.redirect("/register");
    } else {
      const hashedPassword = bcrypt.hashSync(password, 10);
      await create(email, hashedPassword);
      req.flash("success", "Registration successful. Please sign in.");
      res.redirect("/");
    }
  } catch (error) {
    console.error(error);
    req.flash("error", "An unexpected error occurred");
    res.redirect("/register");
  }
});

router.get("/signout", (req, res) => {
  if (req.session.user) {
    req.session.destroy();
  }
  res.redirect("/");
});

module.exports = router;

