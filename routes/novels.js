const express = require("express");
const router = express.Router();
const Novel = require("../models/Novels");
const Author = require("../models/Authors");
const multer = require("multer");
const { storage } = require("../cloudinary/cloudinary");
const upload = multer({ storage });
// const { isLoggedIn } = require("../middleware");

// ホーム画面へ遷移
router.get("/home", async (req, res) => {
  try {
    const newNovels = await Novel.find({ is_new: true })
      .populate("author")
      .limit(5);

    const bunkoNovels = await Novel.find({ novel_type: "文庫" })
      .populate("author")
      .limit(5);

    const tankobonNovels = await Novel.find({ novel_type: "単行本" })
      .populate("author")
      .limit(5);

    const lightNovels = await Novel.find({ novel_type: "ライトノベル" })
      .populate("author")
      .limit(5);

    const recommendedNovels = await Novel.find({ is_recommend: true })
      .populate("author")
      .limit(5);

    res.render("novels/home", {
      newNovels,
      bunkoNovels,
      tankobonNovels,
      lightNovels,
      recommendedNovels,
    });
  } catch (err) {
    console.error("小説の取得に失敗しました:", error);
  }
});

// 「もっと見る」以降の小説一覧
router.get("/list", async (req, res) => {
  try {
    let query = {};
    let pageTitle = "";

    if (req.query.is_new === "true") {
      query.is_new = true;
      pageTitle = "注目の新作";
    } else if (req.query.novel_type) {
      query.novel_type = req.query.novel_type;
      pageTitle = `おすすめの${req.query.novel_type}`;
    } else if (req.query.is_recommend === "true") {
      query.is_recommend = true;
      pageTitle = "ノベルバースおすすめ";
    }
    const novels = await Novel.find(query).populate("author").populate("genre");
    res.render("novels/novel-lists", { novels, pageTitle });
  } catch (err) {
    console.log(err);
  }
});

// 小説投稿画面へ遷移
router.get("/registration", (req, res) => {
  res.render("authors/novel-test");
});

// 小説投稿処理
router.post("/registration", upload.single("cover"), async (req, res) => {
  try {
    const novelData = req.body.novel;

    // チェックボックスの値をMongoDBのBoolean型に合うように変換
    novelData.is_new = novelData.is_new === "on";
    novelData.is_recommend = novelData.is_recommend === "on";
    const novel = new Novel(req.body.novel);
    if (req.file) {
      novel.cover = { url: req.file.path, filename: req.file.filename };
    }
    const saveNovel = await novel.save();
    console.log("小説の登録に成功しました。", saveNovel);
    res.redirect("/novel/registration");
  } catch (err) {
    console.log("小説の登録に失敗しました。", err);
    res.redirect("/novel/registration");
  }
});

// 小説詳細画面へ遷移
router.get("/detail/:id", async (req, res) => {
  const id = req.params.id;
  const novelDetails = await Novel.findById(id)
    .populate("author")
    .populate("genre");
  console.log(novelDetails);
  res.render("novels/novel-details", { novelDetails });
});

// 作家取得
router.get("/author", async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.json([]);
  }

  try {
    const suggestion = await Author.find({
      author_name: { $regex: query, $options: "i" },
    })
      .limit(50)
      .lean()
      .exec();
    res.json(suggestion.map((item) => item.author_name));
  } catch (err) {
    console.log("作家の取得に失敗しました。", err);
  }
});

// 検索結果画面へ遷移&処理
router.get("/search", async (req, res) => {
  const searchQuery = req.query.search;
  let pageTitle = "";

  if (!searchQuery || searchQuery.trim() === '') {
    req.flash("info", "検索キーワードを入力してください");
    return res.render("novels/novel-search-result", { results: [], messages: req.flash() });
  }

  try {
    const regex = new RegExp(searchQuery, 'i');
    
    // 検索クエリに一致する作家を見つける
    const matchingAuthors = await Author.find({ author_name: regex });
    const authorIds = matchingAuthors.map(author => author._id);

    // タイトルまたは一致した作家IDで小説を検索
    const results = await Novel.find({
      $or: [
        { title: regex },
        { author: { $in: authorIds } }
      ]
    })
    .populate("author")
    .populate("genre")
    .exec();

    if (results.length < 1) {
      req.flash("info", "検索結果がありません");
      pageTitle = "検索結果";
    } else {
      pageTitle = `${searchQuery}の検索結果`;
    }

    res.render("novels/novel-search-result", { 
      results, 
      pageTitle, 
      messages: req.flash() 
    });

  } catch (err) {
    console.error("検索エラー", err);
    req.flash("error", "検索中にエラーが発生しました");
    res.status(500).render("novels/novel-search-result", { 
      results: [], 
      pageTitle: "エラー", 
      messages: req.flash() 
    });
  }
});

module.exports = router;
