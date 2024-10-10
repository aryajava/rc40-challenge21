const db = require("../lib/con.js");

const getAll = () => {
  return db.query("SELECT * FROM todos").then((result) => result.rows);
};

const getById = (id) => {
  return db.query("SELECT * FROM todos WHERE id = $1", [id]).then((result) => result.rows[0]);
};

const create = (title, description) => {
  return db.query("INSERT INTO todos (title, description) VALUES ($1, $2) RETURNING *", [title, description]).then((result) => result.rows[0]);
};

const update = (id, title, description) => {
  return db.query("UPDATE todos SET title = $1, description = $2 WHERE id = $3 RETURNING *", [title, description, id]).then((result) => result.rows[0]);
};

const remove = (id) => {
  return db.query("DELETE FROM todos WHERE id = $1 RETURNING *", [id]).then((result) => result.rows[0]);
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};

