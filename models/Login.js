const db = require("../lib/con.js");

const getByEmail = async (email) => {
  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    return result.rows[0];
  } catch (error) {
    console.error("Error fetching user by email:", error);
    throw error;
  }
};

const create = async (email, password) => {
  try {
    const result = await db.query("INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *", [email, password]);
    return result.rows[0];
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

module.exports = {
  getByEmail,
  create,
};
