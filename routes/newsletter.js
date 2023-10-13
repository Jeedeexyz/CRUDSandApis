//requiring essiential packages and controllers
const express = require("express");

const router = express.Router();

const controller = require("../controllers/newsletter");

//This will add the user data into our database

router.post("/addData", controller.addUser);

//This will add Multiple Users data into database
router.post("/addUsers", controller.addUsers);

//This will handle both multiple data and single data

router.post("/add", controller.addAnyData);

//This will get all data in our database

router.get("/getData", controller.getAllData);

//Get data by email

router.get("/getData/:email", controller.getDataByEmail);

//Update data by email
router.put("/updateData/:email", controller.updateByEmail);

//Delete Data by email

router.delete("/deleteData/:email", controller.deleteByEmail);

//This will replace the data

router.put("/replaceData/:email", controller.replaceData);

module.exports = router;
