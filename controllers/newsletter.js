//Requiring the model or format of data in which we add our data into database
const NewsletterModel = require("../models/newsletter");

//This will add data into database and give error if any thing go wrong
const addUser = async (req, res) => {
  try {
    const { name, email } = req.body;

    const subscriber = new NewsletterModel({
      name,
      email,
    });
    await subscriber.save();
    res.json(subscriber);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//This will store multipkle schema into database
const addUsers = async (req, res) => {
  try {
    const subscribersData = req.body;

    if (!Array.isArray(subscribersData)) {
      return res.status(400).json({
        error: "Invalid data format. Expected an array of subscribers.",
      });
    }

    const subscribers = subscribersData.map((subscriber) => ({
      name: subscriber.name,
      email: subscriber.email,
    }));

    const insertedSubscribers = await NewsletterModel.insertMany(subscribers);
    res.json(insertedSubscribers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//This will handle both single object data and Array data(Multiple data)
const addAnyData = async (req, res) => {
  try {
    const subscribersData = req.body;

    if (!Array.isArray(subscribersData)) {
      const { name, email } = subscribersData;
      const subscriber = new NewsletterModel({
        name,
        email,
      });
      const insertedSubscriber = await subscriber.save();
      return res.json(insertedSubscriber);
    }

    const subscribers = subscribersData.map((subscriber) => ({
      name: subscriber.name,
      email: subscriber.email,
    }));

    const insertedSubscribers = await NewsletterModel.insertMany(subscribers);
    res.json(insertedSubscribers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// This will get All the data in our database
const getAllData = async (req, res) => {
  try {
    const getData = await NewsletterModel.find({});
    res.json(getData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//To get data by id we use this function

const getDataByEmail = async (req, res) => {
  try {
    const dataByEmail = await NewsletterModel.findOne({email:req.params.email});
    if (dataByEmail) {
      res.json(dataByEmail);
    } else {
      res.status(404).json({ message: "Data Not Found!" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//To update data by Id
const updateByEmail = async (req, res) => {
  try {
    const { name, email } = req.body;
    const dataByEmail = await NewsletterModel.findOneAndUpdate(
      {email: req.params.email},
      {
        name,
        email,
      },
      { new: true }
    );
    if (dataByEmail) {
      res.json(dataByEmail);
    } else {
      res.status(404).json({ message: "Data Not Found!" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//To delete data by id

const deleteByEmail = async (req, res) => {
  try {
    const dataByEmail = await NewsletterModel.findOneAndDelete(
     {email: req.params.email}
    );
    if (dataByEmail) {
      res.json({ message: "Data Deleted!" });
    } else {
      res.status(404).json({ message: "Data Not Found!" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//This will replace data with new data

const replaceData = async (req, res) => {
  try {
    const { name, email } = req.body;
    const dataByEmail = await NewsletterModel.replaceOne({email: req.params.email}, {
      name,
      email,
    });
    if (!dataByEmail) {
      res.status(404).json({ message: "Data Not Found !" });
    }
    res.json(dataByEmail);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// exproting it so we can use these in routes
module.exports = {
  addUser,
  addUsers,
  addAnyData,
  getAllData,
  getDataByEmail,
  updateByEmail,
  deleteByEmail,
  replaceData,
};
