const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
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

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });
module.exports = mongoose.model("User", userSchema);