const express = require("express");

const router = express.Router();

const controller = require("../controllers/login");
const  authenticateWithToken  = require("../middleware/authWithToken");
const authenticateWithRole = require("../middleware/authWithRole")
const authWithRoleAtSingin = require("../middleware/authWithRoleAtSingin")

//Create user
router.post("/signup", controller.SignupUser);

//Signin the user
router.post("/signin",authWithRoleAtSingin(["Admin","Manager","Leader"]), controller.LoginUser)

//Forget route
router.post("/forget",controller.forgetPassword)

router.post("/OTPrequest",controller.forgetPasswordWithOTP)

//Reset route
router.get("/resetPassword/:id/:token",controller.reset)

router.post("/resetPassword/:id/:token",controller.resetPassword)


router.get("/users" , controller.getAllData)

module.exports = router;
