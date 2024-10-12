const db = require("../lib/con.js");

const getAvatarByEmail = (email) => {
  return db.query("SELECT avatar FROM users WHERE email = $1", [email]).then((result) => result.rows[0]);
};

const uploadAvatar = (id, avatar) => {
  return db.query("UPDATE users SET avatar = $1 WHERE id = $2 RETURNING *", [avatar, id]);
};

module.exports = {
  getAvatarByEmail,
  uploadAvatar,
};
