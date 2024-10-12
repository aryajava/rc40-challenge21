const express = require("express");
const router = express.Router();
const { getAll, getTotal, getById, create, update, remove } = require("../models/Todo.js");
const { getAvatarByEmail } = require("../models/User.js");

const checkSession = (req, res, next) => {
  if (!req.session.user) {
    res.redirect("/");
    return;
  }
  next();
};

router.get("/", checkSession, async (req, res, next) => {
  const { title = "", startdate = "", lastdate = "", complete = "", operation = "", sort = "", order = "", page = 1 } = req.query;
  const limit = 5;
  const offset = (parseInt(page, 10) - 1) * limit;
  const queries = [];
  const params = [];
  if (title) {
    params.push(title);
    queries.push(`title ILIKE '%' || $${params.length + 1} || '%'`);
  }
  if (startdate && lastdate) {
    params.push(startdate, lastdate);
    queries.push(`DATE(deadline) BETWEEN $${params.length} AND $${params.length + 1}`);
  } else if (startdate) {
    params.push(startdate);
    queries.push(`DATE(deadline) >= $${params.length + 1}`);
  } else if (lastdate) {
    params.push(lastdate);
    queries.push(`DATE(deadline) <= $${params.length + 1}`);
  }
  if (complete) {
    params.push(complete === "true");
    queries.push(`complete = $${params.length + 1}`);
  }
  try {
    const total = await getTotal(req.session.user.id, queries, params, operation);
    const pages = Math.ceil(parseInt(total) / limit);
    const todos = await getAll(req.session.user.id, sort, order, limit, offset, queries, params, operation);
    const searchPage = Object.keys(req.query)
      .filter((key) => key !== "page")
      .map((key) => key + "=" + req.query[key])
      .join("&");
    const avatarResult = await getAvatarByEmail(req.session.user.email);
    const avatar = avatarResult ? avatarResult.avatar : null;
    const avatarPath = avatar ? `/images/${req.session.user.email}/${avatar}` : null;
    res.render("todos", {
      user: { ...req.session.user, avatarPath },
      title: "PostgreSQL Breads (Browse, Read, Edit, Add, Delete, Sort)",
      todos,
      page: parseInt(page),
      total,
      pages,
      offset,
      sort,
      order,
      search: req.query,
      searchPage,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/add", checkSession, (req, res) => {
  res.render("todos/form", { title: "Adding Data", todo: null, success: req.flash("success"), error: req.flash("error") });
});

router.post("/add", checkSession, async (req, res, next) => {
  try {
    const { title } = req.body;
    if (title.trim() === "") {
      req.flash("error", "Title is required.");
      res.redirect("/todos/add");
      return;
    }
    await create(title, req.session.user.id);
    res.redirect("/todos");
  } catch (error) {
    next(error);
  }
});

router.get("/edit/:id", checkSession, async (req, res, next) => {
  try {
    const todo = await getById(req.params.id);
    res.render("todos/form", { title: "Updating Data", todo, success: req.flash("success"), error: req.flash("error") });
  } catch (error) {
    next(error);
  }
});

router.post("/edit/:id", checkSession, async (req, res, next) => {
  try {
    const { title, deadline, complete } = req.body;
    const formattedDeadline = new Date(deadline);
    if (title.trim() === "") {
      req.flash("error", "Title is required.");
      res.redirect(`/todos/edit/${req.params.id}`);
      return;
    }
    await update(req.params.id, title, formattedDeadline, complete === "on");
    res.redirect("/todos");
  } catch (error) {
    next(error);
  }
});

router.post("/delete/:id", checkSession, async (req, res, next) => {
  try {
    await remove(req.params.id);
    res.redirect("/todos");
  } catch (error) {
    next(error);
  }
});

module.exports = router;

