const Author = require("../models/Authors");

const getAuthorName = async () => {
  try {
    const authors = await Author.find({});
    console.log("作家名取得成功!");
    return authors;
  } catch (err) {
    console.log("作家名の取得に失敗しました。", err);
    return [];
  }
}

module.exports = getAuthorName;