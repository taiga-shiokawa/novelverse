const Genre = require("../models/Genres");

const getGenreName = async () => {
  try {
    const genres = await Genre.find({});
    console.log("ジャンル名取得成功!");
    return genres;
  } catch (err) {
    console.log("ジャンル名の取得に失敗しました。", err);
    return [];
  }
}

module.exports = getGenreName;