const mongoose = require("mongoose");
const { StringDecoder } = require("string_decoder");
const { isEmail, isIn } = require("validator");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: {
      validator: isEmail,
      message: "Invalid email address",
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8, // Minimum password length
  },
  role: {
    type : String,
    enum: ["Admin","Manager","Customer","Leader","Super Admin"],
    required : true
  }
});

module.exports = mongoose.model("loginTest", userSchema);
