const db = require("../lib/config");

const getAll = async (user_id, sort, order, limit, offset, queries, params, operation) => {
  const validSortColumns = ["title", "deadline", "complete"];
  const validOrders = ["asc", "desc"];
  if (!validSortColumns.includes(sort)) {
    sort = "id";
  }
  if (!validOrders.includes(order)) {
    order = "desc";
  }
  try {
    let query = `SELECT t.* FROM todos as t LEFT JOIN users as u ON t.user_id = u.id WHERE t.user_id = $1`;
    if (queries.length > 0) {
      query += ` AND (${queries.join(` ${operation} `)})`;
    }
    query += ` ORDER BY ${sort} ${order} LIMIT $${params.length + 2} OFFSET $${params.length + 3}`;
    const result = await db.query(query, [user_id, ...params, limit, offset]);
    return result.rows;
  } catch (error) {
    console.error("Error fetching todos:", error);
    throw error;
  }
};

const getTotal = async (user_id, queries, params, operation) => {
  try {
    let query = "SELECT COUNT(*) AS total FROM todos WHERE user_id = $1";
    if (queries.length > 0) {
      query += ` AND (${queries.join(` ${operation} `)})`;
    }
    const result = await db.query(query, [user_id, ...params]);
    return result.rows[0].total;
  } catch (error) {
    console.error("Error fetching total todos:", error);
    throw error;
  }
};

const getById = async (id) => {
  try {
    const result = await db.query("SELECT * FROM todos WHERE id = $1", [id]);
    return result.rows[0];
  } catch (error) {
    console.error("Error fetching todo by ID:", error);
    throw error;
  }
};

const create = async (title, user_id) => {
  try {
    const result = await db.query("INSERT INTO todos (title, user_id) VALUES ($1, $2) RETURNING *", [title, user_id]);
    return result.rows[0];
  } catch (error) {
    console.error("Error creating todo:", error);
    throw error;
  }
};

const update = async (id, title, deadline, complete) => {
  try {
    const result = await db.query("UPDATE todos SET title = $1, deadline = $2, complete = $3 WHERE id = $4 RETURNING *", [title, deadline, complete, id]);
    return result.rows[0];
  } catch (error) {
    console.error("Error updating todo:", error);
    throw error;
  }
};

const remove = async (id) => {
  try {
    const result = await db.query("DELETE FROM todos WHERE id = $1 RETURNING *", [id]);
    return result.rows[0];
  } catch (error) {
    console.error("Error removing todo:", error);
    throw error;
  }
};

module.exports = {
  getAll,
  getTotal,
  getById,
  create,
  update,
  remove,
};
