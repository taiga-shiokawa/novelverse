const mongoose = require("mongoose");
const { Schema } = mongoose;

const genreShema = new Schema({
  genre_name: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Genre", genreShema);
