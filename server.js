const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const mongoose = require("./config/connection");
const userApis = require("./routes/user");
const newsletterApis = require("./routes/newsletter");
const loginApis = require("./routes/login");
const productApi = require("./routes/product")
const quantityApi = require("./routes/quantity")

dotenv.config();

let port = process.env.PORT || 8000;

app.use(bodyParser.json());

app.use(express.static("public"));

app.use("/user", userApis);

app.use("/newsletter", newsletterApis);

app.use("/signinSystem", loginApis);

app.use("/", productApi)

app.use("/", quantityApi)

app.listen(port, "localhost", (req, res) => {
  console.log(`The server is up! at https://localhost:${port}`);
});
