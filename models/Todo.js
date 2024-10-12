const db = require("../lib/con.js");

const getAll = (user_id, sort, order, limit, offset, queries, params, operation) => {
  const validSortColumns = ["title", "deadline", "complete"];
  const validOrders = ["asc", "desc"];
  if (!validSortColumns.includes(sort)) {
    sort = "id";
  }
  if (!validOrders.includes(order)) {
    order = "desc";
  }
  let query = `SELECT t.* FROM todos as t LEFT JOIN users as u ON t.user_id = u.id WHERE t.user_id = $1`;
  if (queries.length > 0) {
    query += ` AND (${queries.join(` ${operation} `)})`;
  }
  query += ` ORDER BY ${sort} ${order} LIMIT $${params.length + 2} OFFSET $${params.length + 3}`;
  return db.query(query, [user_id, ...params, limit, offset]).then((result) => result.rows);
};

const getTotal = (user_id, queries, params, operation) => {
  let query = "SELECT COUNT(*) AS total FROM todos WHERE user_id = $1";
  if (queries.length > 0) {
    query += ` AND (${queries.join(` ${operation} `)})`;
  }
  return db.query(query, [user_id, ...params]).then((result) => result.rows[0].total);
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
  getTotal,
  getById,
  create,
  update,
  remove,
};

