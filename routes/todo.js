const express = require("express");
const router = express.Router();
const { getAll, getById, create, update, remove } = require("../models/Todo.js");

const checkSession = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/");
  }
  next();
};

router.get("/", checkSession, async (req, res, next) => {
  try {
    const todos = await getAll(req.session.user.id);
    res.render("todos", {
      title: "BREADS (Browse, Read, Edit, Add, Delete, Sort)",
      todos,
      user: req.session.user,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/add", checkSession, (_, res) => {
  res.render("todos/form", { title: "Adding Data", todo: {} });
});

router.post("/add", checkSession, async (req, res, next) => {
  try {
    const { title } = req.body;
    await create(title, req.session.user.id);
    res.redirect("/todos");
  } catch (error) {
    next(error);
  }
});

router.get("/edit/:id", checkSession, async (req, res, next) => {
  try {
    const todo = await getById(req.params.id);
    res.render("todos/form", { title: "Updating Data", todo });
  } catch (error) {
    next(error);
  }
});

router.post("/edit/:id", checkSession, async (req, res, next) => {
  try {
    const { title, deadline, complete } = req.body;
    const formattedDeadline = new Date(deadline);
    await update(req.params.id, title, formattedDeadline, complete === "on");
    res.redirect("/todos");
  } catch (error) {
    next(error);
  }
});

router.get("/delete/:id", checkSession, async (req, res, next) => {
  try {
    await remove(req.params.id);
    res.redirect("/todos");
  } catch (error) {
    next(error);
  }
});

module.exports = router;

