const express = require("express");
const router = express.Router();
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const { getAvatarByEmail, uploadAvatar } = require("../models/User");

const checkSession = (req, res, next) => {
  if (!req.session.user) {
    res.redirect("/");
    return;
  }
  next();
};

router.get("/avatar", checkSession, async (req, res, next) => {
  try {
    const avatar = await getAvatarByEmail(req.session.user.email);
    const avatarPath = avatar && avatar.avatar ? `/images/${req.session.user.email}/${avatar.avatar}` : "/images/default256.png";
    res.render("user/avatar", { title: "Upload Avatar", user: { avatar, avatarPath }, success: req.flash("success"), error: req.flash("error") });
  } catch (error) {
    next(error);
  }
});

router.post("/avatar", checkSession, async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    req.flash("error", "No files uploaded.");
    res.redirect("/user/avatar");
    return;
  }
  const { avatar } = req.files;
  const email = req.session.user.email;
  const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, "");
  const userDir = path.join(__dirname, "../public/images", email);
  if (!fs.existsSync(userDir)) {
    fs.mkdirSync(userDir, { recursive: true });
  }
  //   const avatar64Path = path.join(userDir, `${timestamp}_avatar64.jpg`);
  const avatar256Path = path.join(userDir, `${timestamp}_avatar256.jpg`);
  try {
    // await sharp(avatar.data).resize(64, 64).toFile(avatar64Path);
    await sharp(avatar.data).resize(256, 256).toFile(avatar256Path);
    await uploadAvatar(req.session.user.id, `${timestamp}_avatar256.jpg`);

    req.session.user.avatar = `${email}/${timestamp}_avatar256.jpg`;
    req.flash("success", "Avatar updated.");
    res.redirect("/todos");
  } catch (error) {
    next(error);
  }
});

module.exports = router;

