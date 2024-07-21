const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    requred: true,
    unique: true,
  },
  self_introdaction: {
    type: String,
  },
  birthday: {
    type: Date,
  },
  image: [
    {
      url: String,
      filename: String,
    },
  ],
  role: {
    type: String,
    default: "user",
  },
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);
