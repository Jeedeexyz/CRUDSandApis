const mongoose = require("mongoose");

const newsletter = new mongoose.Schema({
  name: {
    type: String,
    required: "Name is required! Please Enter your name.",
    min: 3,
    max: 12,
  },
  email: {
    type: String,
    required: "Email is required please enter your email",
    unique: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      (props) => `${props.value} is not a valid email address!`,
    ],
  },
});

const NewsletterModel = mongoose.model("Subscriber", newsletter);

module.exports = NewsletterModel;
