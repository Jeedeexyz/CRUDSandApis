const Quantity = require("../models/quantity");

const createQuantity = async (req, res, next) => {
  try {
    const { productId, userId, value } = req.body;
    const quantity = new Quantity({
      userId,
      productId,
      value,
    });

    await quantity.save();
    res.status(201).json({ message: "Quantity created sucessfully!" });
  } catch (error) {
    next(error);
  }
};

const getQuantityByProductId = async (req, res, next) => {
  try {
    const { productId, userId } = req.params;
   
    const quantities = await Quantity.find({
      productId: productId,
      userId: userId,
    })
      .populate("productId userId");

    res.status(200).json(quantities);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getQuantityByProductId,
  createQuantity,
};
