const mongoose = require("mongoose");
const { Schema } = mongoose;

const authorSchema = new Schema({
  author_name: {
    type: String,
    required: true,
  },
  furigana: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Author", authorSchema);
