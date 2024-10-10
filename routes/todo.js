const express = require("express");
const router = express.Router();
const { getAll, getById, create, update, remove } = require("../models/Todo.js");

function checkSession(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/");
  }
  next();
}

router.get("/", checkSession, function (req, res, next) {
  getAll().then((todos) => {
    res.render("todos", {
      title: "BREADS (Browse, Read, Edit, Add, Delete, Sort)",
      todos,
      user: req.session.user,
    });
  });
});

router.get("/add", checkSession, function (req, res, next) {
  res.render("todos/form", { title: "Adding Data" });
});

router.post("/add", checkSession, function (req, res, next) {
  const { title, description } = req.body;
  create(title, description).then(() => {
    res.redirect("todos");
  });
});

router.get("/edit/:id", checkSession, function (req, res, next) {
  getById(req.params.id).then((todo) => {
    res.render("todos/form", { title: "Updating Data", todo });
  });
});

router.post("/edit/:id", checkSession, function (req, res, next) {
  const { title, description } = req.body;
  update(req.params.id, title, description).then(() => {
    res.redirect("todos");
  });
});

router.get("/delete/:id", checkSession, function (req, res, next) {
  remove(req.params.id).then(() => {
    res.redirect("todos");
  });
});

module.exports = router;

