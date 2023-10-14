const express = require("express");

const router = express.Router();

const controller = require("../controllers/login");
const  authenticateWithToken  = require("../middleware/authWithToken");
const authenticateWithRole = require("../middleware/authWithRole")
const authWithRoleAtSingin = require("../middleware/authWithRoleAtSingin")
const authForSuperAdminAcess = require("../middleware/authWithRoleAndAccess")

//Create user
router.post("/signup", controller.SignupUser);

//Signin the user
router.post("/signin",authWithRoleAtSingin(["Admin","Manager","Customer","Leader","SuperAdmin"]),controller.LoginUser)
// Super Admin route to create user and update the roles of users

router.post("/fullAccess",authForSuperAdminAcess,controller.registerUserAndUpdateRole)

//Forget route
router.post("/forget",controller.forgetPassword)

router.post("/OTPrequest",controller.forgetPasswordWithOTP)

//Reset route
router.get("/resetPassword/:id/:token",controller.reset)

router.post("/resetPassword/:id/:token",controller.resetPassword)


router.get("/users" , controller.getAllData)

module.exports = router;
