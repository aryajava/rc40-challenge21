const db = require("../lib/con.js");

const getAll = (user_id) => {
  return db.query("SELECT t.* FROM todos as t LEFT JOIN users as u ON t.user_id = $1 ORDER BY t.id", [user_id]).then((result) => result.rows);
};

const getById = (id) => {
  return db.query("SELECT * FROM todos WHERE id = $1", [id]).then((result) => result.rows[0]);
};

const create = (title, user_id) => {
  return db.query("INSERT INTO todos (title, user_id) VALUES ($1, $2) RETURNING *", [title, user_id]).then((result) => result.rows[0]);
};

const update = (id, title, deadline, complete) => {
  return db.query("UPDATE todos SET title = $1, complete = $2, deadline = $3 WHERE id = $4 RETURNING *", [title, complete, deadline, id]).then((result) => result.rows[0]);
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

