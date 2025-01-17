// ローカルモジュール
const Novel = require("../../models/Novels");
const Author = require("../../models/Authors");
const Genre = require("../../models/Genres");
const User = require("../../models/Users");
const catchAsync = require("../../utils/catchAsync");
const setTopImage = require("../../utils/setTopImage");

// ホーム画面へ遷移
module.exports.goToHome = catchAsync(async (req, res) => {
  const newNovels = await Novel.find({ is_new: true })
    .sort({_id: -1})
    .populate("author")
    .limit(5);

  const bunkoNovels = await Novel.find({ novel_type: "文庫" })
    .sort({_id: -1})
    .populate("author")
    .limit(5);

  const tankobonNovels = await Novel.find({ novel_type: "単行本" })
    .sort({_id: -1})
    .populate("author")
    .limit(5);

  const lightNovels = await Novel.find({ novel_type: "ライトノベル" })
    .sort({_id: -1})
    .populate("author")
    .limit(5);

  const recommendedNovels = await Novel.find({ is_recommend: true })
    .sort({_id: -1})
    .populate("author")
    .limit(5);

  const otherGenre = await Genre.findOne({ genre_name: "その他" });
  const otherNovels = await Novel.find({ genre: otherGenre._id })
    .sort({_id: -1})
    .populate("author")
    .limit(5);

    let topImg = await setTopImage(res);

  res.render("novels/home", {
    newNovels,
    bunkoNovels,
    tankobonNovels,
    lightNovels,
    recommendedNovels,
    otherNovels,
    topImg,
    csrfToken: req.csrfToken(),
  });
});

// 「もっと見る」以降の小説一覧
module.exports.seeMoreNovelList = catchAsync(async (req, res) => {
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
  } else if (req.query.genre_name === "その他") {
    pageTitle = "その他";
  }

  let topImg = await setTopImage(res);
  const novels = await Novel.find(query).sort({_id: -1}).populate("author").populate("genre");
  res.render("novels/novel-lists", { novels, topImg , pageTitle, csrfToken: req.csrfToken(), });
});

// 小説詳細画面へ遷移
module.exports.goToNovelDetails = catchAsync(async (req, res) => {
  const id = req.params.id;
  const novelDetails = await Novel.findById(id)
    .populate("author")
    .populate("genre");

  let topImg = await setTopImage(res);
  res.render("novels/novel-details", { novelDetails, topImg, csrfToken: req.csrfToken() });
});

// 作家名取得（非同期）
module.exports.getAuthorNames = async (req, res, next) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.json([]);
    }
    const suggestions = await Author.find({
      author_name: { $regex: query, $options: "i" },
    })
      .limit(50)
      .lean()
      .exec();
    const authorNames = suggestions.map((item) => item.author_name);
    res.json(authorNames);
  } catch (err) {
    console.error("作家の取得に失敗しました。", err);
    next(err); // エラーを Express のエラーハンドリングミドルウェアに渡す
  }
};

// 検索結果画面へ遷移&処理
module.exports.goToSearchResultAndSearchProcess = catchAsync( async (req, res) => {
  const searchQuery = req.query.search;
  let pageTitle = "";
  let topImg = await setTopImage(res);
  if (!searchQuery || searchQuery.trim() === "") {
    req.flash("info", "検索結果がありませんでした");
    pageTitle = "検索結果";
    return res.render("novels/novel-search-result", {
      pageTitle,
      topImg,
      results: [],
      messages: req.flash(),
      csrfToken: req.csrfToken()
    });
  }
  try {
    const regex = new RegExp(searchQuery, "i");

    // 検索クエリに一致する作家を見つける
    const matchingAuthors = await Author.find({ author_name: regex });
    const authorIds = matchingAuthors.map((author) => author._id);

    // タイトルまたは一致した作家IDで小説を検索
    const results = await Novel.find({
      $or: [{ title: regex }, { author: { $in: authorIds } }],
    })
      .sort({_id: -1})
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
      topImg,
      pageTitle,
      messages: req.flash(),
      csrfToken: req.csrfToken()
    });
  } catch (err) {
    console.error("検索エラー", err);
    req.flash("error", "検索中にエラーが発生しました");
    res.status(500).render("novels/novel-search-result", {
      results: [],
      topImg,
      pageTitle: "エラー",
      messages: req.flash(),
      csrfToken: req.csrfToken()
    });
  }
});

// ジャンル別小説一覧画面へ遷移&取得
module.exports.goToByGenreNovelListAndGNovelGet = catchAsync( async (req, res) => {
  const genreId = req.params.id;
  let pageTitle = "";
  const genre = await Genre.findById(genreId);
  if (genre) {
    pageTitle = genre.genre_name;
  }
  let topImg = await setTopImage(res);
  const novelByGenreList = await Novel.find({ genre: genreId })
    .sort({_id: -1})
    .populate("author")
    .populate("genre");
  console.log(novelByGenreList);
  res.render("novels/novel-genre-list", { novelByGenreList,topImg,  pageTitle, csrfToken: req.csrfToken() });
});