const Genre = require('../../models/Genres');
const Novel = require('../../models/Novels');
const Author = require('../../models/Authors');
const ObjectId = require('mongodb').ObjectId;
const catchAsync = require("../../utils/catchAsync");


// ジャンル追加画面へ遷移
module.exports.renderAddGenres= async ( req , res ) => {
  const genreList = await Genre.find({});
  const count = await Novel.estimatedDocumentCount(); 
  const message = "";
  const pageTitle = "ジャンル追加";
  res.render("admins/genre-add" , { pageTitle ,  genreList , count , message , csrfToken: req.csrfToken()});
}

// ジャンル追加実装
module.exports.addGenres= async ( req , res ) => {
  const { addGenre } = req.body;
  const currentGenreList = await Genre.find({ genre_name: addGenre });
  console.log(`currentGenreList:${currentGenreList}`);
  let message = "";
  if(currentGenreList.length == 0){
    const genre = new Genre({ genre_name: addGenre });
    const saveGenre = await genre.save(); 
    message = `ジャンル「${addGenre}」を追加しました`;
  } else {
    message = addGenre + "はすでに存在しています";
  }

  const genreList = await Genre.find({});
  const count = await Novel.estimatedDocumentCount(); 
  const pageTitle = "ジャンル追加";
  
  res.render("admins/genre-add" , { pageTitle , genreList , count , message , csrfToken: req.csrfToken()});
}


// ジャンル削除画面へ遷移
module.exports.renderGenreDeletion = async ( req , res ) => {
  const genreList = await Genre.find({});
  const count = await Novel.estimatedDocumentCount();
  const message = "";
  const pageTitle = "ジャンル削除";
  res.render("admins/genre-delete" , {  pageTitle , genreList , count , message , csrfToken: req.csrfToken()});
}

// ジャンル削除 実装
module.exports.deleteGenres = async ( req , res ) => {
  const { genreId , genreName } = req.body;
  let message = "";
  
  console.log(`1`);
  //既存の小説に削除予定のジャンルがないか確認
  const novelList = await Novel.find({ genre: genreId });  
  try{

    if( genreName == 'その他'){
      //その他は削除しない
      message = `「その他」は削除できません`;
    } else if( novelList.length > 0 ){
      //あれば削除しない
      message = `「${genreName}」を選択中の小説があるため、削除できません`;
    } else {
      //なければ削除処理
      await Genre.findByIdAndDelete(genreId);
      message = `「${genreName}」を削除しました`;
    }

  }catch(e){
    console.log(e);
  }
  const pageTitle = "ジャンル削除";
  const genreList = await Genre.find({});
  const count = await Novel.estimatedDocumentCount();
  res.render("admins/genre-delete" , {  pageTitle , genreList , count , message , csrfToken: req.csrfToken()});
}


// 小説詳細画面へ遷移
module.exports.renderAdminNovelDetails = catchAsync(async (req, res) => {
  const id = req.params.id;
  const novelDetails = await Novel.findById(id)
    .populate("author")
    .populate("genre");
    const pageTitle = "書籍詳細・編集";

  res.render("admins/admin-novel-details", { pageTitle , novelDetails, csrfToken: req.csrfToken() });
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
module.exports.renderAdminSearchResultAndSearchProcess = catchAsync(
  async (req, res) => {
    const searchQuery = req.query.search;
    let pageTitle = "";

    if (!searchQuery || searchQuery.trim() === "") {
      req.flash("info", "検索結果がありませんでした");
      pageTitle = "検索結果";
      return res.render("admins/admin-novel-search-result", {
        pageTitle,
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

      res.render("admins/admin-search-result", {
        results,
        pageTitle,
        messages: req.flash(),
        csrfToken: req.csrfToken()
      });
    } catch (err) {
      console.error("検索エラー", err);
      req.flash("error", "検索中にエラーが発生しました");
      res.status(500).render("admins/admin-search-result", {
        results: [],
        pageTitle: "エラー",
        messages: req.flash(),
        csrfToken: req.csrfToken()
      });
    }
  }
);

// ジャンル別小説一覧画面へ遷移&取得
module.exports.renderAdminGenreNovelListAndNovelGet = catchAsync(
  async (req, res) => {
    const genreId = req.params.id;
    let pageTitle = "";
    const genre = await Genre.findById(genreId);
    if (genre) {
      pageTitle = genre.genre_name;
    }
    const novelByGenreList = await Novel.find({ genre: genreId })
      .sort({_id: -1})
      .populate("author")
      .populate("genre");
    console.log(novelByGenreList);
    res.render("admins/admin-novel-genre-list", { novelByGenreList, pageTitle, csrfToken: req.csrfToken() });
  }
);

// 表紙画像変更
module.exports.changeCoverImg = catchAsync(async (req, res) => {

  const novelId = req.body.novelId;
  const novel = await Novel.findById(novelId);


  //このIDの小説が存在するかチェック
  if (!novel) {
    return res.status(404).json({ message: "Novel not found" });
  }

  try {

    console.log(`変更後のreq.file.pathは${req.file.path}`);
    console.log(`変更後のreq.file.filenameは${req.file.filename}`);
    await Novel.findByIdAndUpdate(novelId, {
      cover: { url: req.file.path, filename: req.file.filename },
    });

    req.flash("success", "表紙画像を変更しました");

    const novelDetails = await Novel.findById(novelId)
    .populate("author")
    .populate("genre");
    const pageTitle = "書籍詳細・編集";

  res.render("admins/admin-novel-details", { pageTitle , novelDetails, csrfToken: req.csrfToken() });  
  

  } catch (err) {
    req.flash("error", "表紙画像の変更に失敗しました");
    console.error(err);
    res.redirect("/novel/management/all");
  }
});

// 小説情報変更
module.exports.novelInfoChange = catchAsync(async (req, res) => {
  const novelId = req.body.novelId;
  req.body.novel.is_new = req.body.novel.is_new === "on";
  req.body.novel.is_recommend = req.body.novel.is_recommend === "on";
  await Novel.findByIdAndUpdate(novelId, { ...req.body.novel });
  req.flash("success", "小説の情報を更新しました");

  const id = req.params.id;
  const novelDetails = await Novel.findById(novelId)
    .populate("author")
    .populate("genre");
    const pageTitle = "書籍詳細・編集";

  res.render("admins/admin-novel-details", { pageTitle , novelDetails, csrfToken: req.csrfToken() });  
  
});