const db = require("../lib/config");

const getAvatarByEmail = async (email) => {
  try {
    const result = await db.query("SELECT avatar FROM users WHERE email = $1", [email]);
    return result.rows[0];
  } catch (error) {
    console.error("Error fetching avatar by email:", error);
    throw error;
  }
};

const uploadAvatar = async (id, avatar) => {
  try {
    const result = await db.query("UPDATE users SET avatar = $1 WHERE id = $2 RETURNING *", [avatar, id]);
    return result.rows[0];
  } catch (error) {
    console.error("Error uploading avatar:", error);
    throw error;
  }
};

module.exports = {
  getAvatarByEmail,
  uploadAvatar,
};
