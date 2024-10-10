const db = require("../lib/con.js");

const getByEmail = (email) => {
  return db.query("SELECT * FROM users WHERE email = $1", [email]).then((result) => result.rows[0]);
};

const create = (email, password) => {
  return db.query("INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *", [email, password]).then((result) => result.rows[0]);
};

module.exports = {
  getByEmail,
  create,
};

