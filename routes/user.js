const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");

// creating routes user controllers

//this will create user
router.post("/createData", userController.createData);
//this will get all the data
router.get("/getAllData", userController.getAllData);
//This will get the data by Id
router.get("/getById/:id", userController.getById);
//This will get data by name
router.get("/getByName/:name", userController.getByName);
//This will get data by email
router.get("/getByEmail/:email", userController.getByEmail);
//This will delete data by Id
router.delete("/deleteById/:id", userController.deleteById);
//This will update data by Id
router.put("/updateById/:id", userController.updateById);
//exporting all the routes
module.exports = router;
