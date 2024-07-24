const express = require("express");
const Novel = require("../../models/Novels");
const { cloudinary } = require("../../cloudinary/cloudinary");

const router = express.Router();

router.get("/cover/delete/", async (req, res) => {
  try {
    const novels = await Novel.find({}).populate("author").limit(1);
    // coverの詳細をコンソールに表示
    novels.forEach((novel, index) => {
      console.log(`Novel ${index + 1}:`);
      console.log("Title:", novel.title);
      console.log("Cover:", novel.cover);
      if (novel.cover && novel.cover.length > 0) {
        console.log("Cover URL:", novel.cover[0].url);
        console.log("Cover Filename:", novel.cover[0].filename);
        console.log("Cover ID:", novel.cover[0]._id);
      } else {
        console.log("No cover image found");
      }
      console.log("-------------------");
    });
    res.render("admins/admin-novel-management", { novels });
  } catch (err) {
    console.log(err);
  }
});

router.post("/cover/delete", async (req, res) => {
  try {
    const { coverId } = req.body;
    console.log("CoverId: ", coverId);

    const novel = await Novel.findOne({ "cover._id": coverId });

    // Cloudinaryから画像を削除
    const coverToDelete = novel.cover.find((c) => c._id.toString() === coverId);
    if (coverToDelete && coverToDelete.filename) {
      await cloudinary.uploader.destroy(coverToDelete.filename);
    }

    // データベースから画像情報を削除
    novel.cover = novel.cover.filter((c) => c._id.toString() !== coverId);
    await novel.save();

    res.redirect("/novel/management/cover/delete");
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
