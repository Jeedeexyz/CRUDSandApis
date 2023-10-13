const User = require("../models/user");

const createData = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const todo = new User({
      name,
      email,
      password,
    });
    await todo.save();
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllData = async (req, res) => {
  try {
    const getTodos = await User.find({});
    res.json(getTodos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// getting data by id

const getById = async (req, res) => {
  try {
    const dataAgainstId = await User.findById(req.params.id);
    if (!dataAgainstId) {
      return res.status(404).json({ message: "Data Not Found" });
    }
    res.json(dataAgainstId);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Getting data by name

const getByName = async (req, res) => {
  try {
    const dataAgainstName = await User.find({ name: req.params.name });
    if (!dataAgainstName) {
      return res.status(404).json({ message: "Data Not Found" });
    }
    res.json(dataAgainstName);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Getting data by email

const getByEmail = async (req, res) => {
  try {
    const dataAgainstEmail = await User.find({ email: req.params.email });
    if (!dataAgainstEmail) {
      return res.status(404).json({ message: "Data Not Found" });
    }
    res.json(dataAgainstEmail);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Deleting data by id

const deleteById = async (req, res) => {
  try {
    const dataAgainstId = await User.findByIdAndDelete(req.params.id);
    if (!dataAgainstId) {
      return res.status(404).json({ message: "Data Not Found" });
    }
    res.json({ message: "Data Deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Updating data

const updateById = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const dataAgainstId = await User.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email,
        password,
      },
      { new: true }
    );
    if (!dataAgainstId) {
      return res.status(404).json({ message: "Data Not Found" });
    }
    res.json(dataAgainstId);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createData,
  getAllData,
  getById,
  getByName,
  getByEmail,
  deleteById,
  updateById,
};
