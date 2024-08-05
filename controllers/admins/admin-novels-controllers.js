const Genre = require('../../models/Genres');
const Novel = require('../../models/Novels');
const ObjectId = require('mongodb').ObjectId;


// ジャンル追加画面へ遷移
module.exports.renderAddGenres= async ( req , res ) => {
  const genreList = await Genre.find({});
  const count = await Novel.estimatedDocumentCount(); 
  const message = "";
  res.render("admins/genre-add" , {  genreList , count , message , csrfToken: req.csrfToken()});
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
  
  res.render("admins/genre-add" , {  genreList , count , message , csrfToken: req.csrfToken()});
}


// ジャンル削除画面へ遷移
module.exports.renderGenreDeletion = async ( req , res ) => {
  const genreList = await Genre.find({});
  const count = await Novel.estimatedDocumentCount();
  const message = "";
  res.render("admins/genre-delete" , {  genreList , count , message , csrfToken: req.csrfToken()});
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
  
  const genreList = await Genre.find({});
  const count = await Novel.estimatedDocumentCount();
  res.render("admins/genre-delete" , {  genreList , count , message , csrfToken: req.csrfToken()});
}
