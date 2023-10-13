const express = require("express");
const router = express.Router();

const productController = require("../controllers/product")


router.post("/product",productController);



module.exports = router