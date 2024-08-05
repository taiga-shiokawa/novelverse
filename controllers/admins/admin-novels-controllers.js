const Genre = require('../../models/Genres');
const Novel = require('../../models/Novels');
const ObjectId = require('mongodb').ObjectId;


// // ジャンル追加画面へ遷移
// module.exports.renderAddGenres= async ( req , res ) => {
//   const genreList = await Genre.find({});
//   const count = await Novel.estimatedDocumentCount();
//   res.render("admins/genre-add" , {  genreList , count , csrfToken: req.csrfToken()});
// }

// // ジャンル削除画面へ遷移
// module.exports.renderGenreDeletion = async ( req , res ) => {
//   const genreList = await Genre.find({});
//   const count = await Novel.estimatedDocumentCount();
//   res.render("admins/genre-delete" , {  genreList , count , csrfToken: req.csrfToken()});
// }







// //ジャンル追加画面に遷移 / 実装
// router.route('/genre_add')
//     .get(  adminIsLoggedIn , AdminNovles.renderAddGenres )   
//     .post(  adminIsLoggedIn , AdminNovles.addGenres )   

// //ジャンル削除画面に遷移 / 実装
// router.route('/genre_delete')
//     .get( adminIsLoggedIn , AdminNovles.renderGenreDeletion )
//     .post(  adminIsLoggedIn , AdminNovles.deleteGenres )     

// // 著者画面へ遷移
// module.exports.renderAdminAuthors = async ( req , res ) => {
//   const authors = await Author.find({});
//   const count = await Novel.estimatedDocumentCount();
//   res.render("admins/admin-authors" , {  authors , count });
// }

// // 著者削除
// module.exports.authorsDeletion = async (req , res) => {
//   const delete_author_id = await Author.findById(req.params.id)
//   const authorId = new ObjectId(delete_author_id);
//   let count = 0;
//   //count = await Novel.estimatedDocumentCount(delete_author_id);
//   //count =  Novel.find({ author: `ObjectId("${delete_author_id}")` }).count()
//   count = await Novel.find({ author: authorId }).countDocuments();
//   if( count != 0 ){
//     req.flash('error' , `この著者の小説が存在するため、削除できません`);
//   } else {
//     const deleteAuthor = await Author.findByIdAndDelete(delete_author_id);
//     req.flash('success' , `${ deleteAuthor.author_name }さんを削除しました`);
//   }

//   res.redirect("/admin-author/author-index");

// }