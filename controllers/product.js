const Product = require("../models/product");

const addProduct = async (req, res) => {
  try {
    const { name } = req.body;
    const product = new Product({
      name,
    });

    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = addProduct;
