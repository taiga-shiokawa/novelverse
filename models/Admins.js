const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const { Schema } = mongoose;

const adminSchema = new Schema({
  admin_code: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
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
});

adminSchema.plugin(passportLocalMongoose, { usernameField: 'admin_code' });
module.exports = mongoose.model("Admin", adminSchema);