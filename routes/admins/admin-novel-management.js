const express = require("express");
const Novel = require("../../models/Novels");
const { cloudinary } = require("../../cloudinary/cloudinary");
const multer = require("multer");
const { storage } = require("../../cloudinary/cloudinary");
const novelRegisrationtAndUpdateValidate = require("../../utils/novel-registration-and-update-validation");   // 小説投稿と更新のバリデーション

const router = express.Router();

// アップロードされたファイルの保存先を指定
const upload = multer({ storage });

// 小説登録画面へ遷移
router.get("/registration", (req, res) => {
  res.render("admins/novel-registration", { csrfToken: req.csrfToken() });
});

// 小説登録処理
router.post("/registration", (req, res, next) => {
  console.log("Route reached");
  console.log("Request body:", req.body);
  console.log("Request query:", req.query);
  console.log("Request file:", req.file);
  console.log("CSRF token from query:", req.query._csrf);
  next();
}, upload.single("cover"), novelRegisrationtAndUpdateValidate, async (req, res) => {
  const novelData = req.body.novel;

  // チェックボックスの値をMongoDBのBoolean型に合うように変換
  novelData.is_new = novelData.is_new === "on";
  novelData.is_recommend = novelData.is_recommend === "on";
  const novel = new Novel(req.body.novel);
  if (req.file) {
    novel.cover = { url: req.file.path, filename: req.file.filename };
  }
  try {
    const saveNovel = await novel.save();
    console.log("小説の登録に成功しました。", saveNovel);
    return res.redirect("/novel/management/registration");
  } catch (err) {
    console.log("小説の登録に失敗しました。", err);
    return res.render("admins/novel-registration", { csrfToken: req.csrfToken() });
  }
});

router.get("/all", async (req, res) => {
  try {
    const novels = await Novel.find({}).populate("author").populate("genre");
    res.render("admins/admin-novel-edit", { novels, csrfToken: req.csrfToken() });
  } catch (err) {
    console.log(err);
  }
});

router.post("/delete", async (req, res) => {
  const { novelId, coverId } = req.body;
  try {
    const novel = await Novel.findById(novelId);
    const novels = await Novel.find({}).populate("author").populate("genre");
    if (!novel) {
      return res.status(404).json({ message: "Novel not found" });
    }

    // Cloudinaryから画像を削除
    const coverToDelete = novel.cover.find((c) => c._id.toString() === coverId);
    if (coverToDelete && coverToDelete.filename) {
      await cloudinary.uploader.destroy(coverToDelete.filename);
    }

    // データベースから画像情報を削除
    novel.cover = novel.cover.filter((c) => c._id.toString() !== coverId);

    // 小説全体を削除するか、カバー画像のみを削除するか判断
    if (novel.cover.length === 0) {
      await Novel.findByIdAndDelete(novelId);
    } else {
      await novel.save();
    }

    res.render("admins/admin-novel-edit", { novels, csrfToken: req.csrfToken() });
  } catch (err) {
    console.error(err);
    res.render("admins/admin-novel-edit", { novels, csrfToken: req.csrfToken() });
  }
});

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
