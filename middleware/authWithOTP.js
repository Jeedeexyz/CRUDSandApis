const jwt = require("jsonwebtoken");
const loginTest = require("../models/login");

const authOTP = async (req, res, next) => {
  try {
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      const token = req.headers.authorization.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "The OTP is not correct!" });
      }
      const {id} = req.params
      const userData = await loginTest.findOne({ _id: id });
      const Secret = process.env.PRIVATE_KEY + userData.password;

      if (!userData) {
       return res.json({ message: "User not found !" });
      }

      jwt.verify(token, Secret, (err, user) => {
        if (err) {
          return res.status(403).json({ message: "JWT verification failed", error: err.message });
        }
        if (user.otp === Number(userData.otp)) {
          next();
        } else {
          return res.status(403).json({ message: "There is an issue with the OTP!" });
        }
      });
    } else {
      return res.status(401).json({ message: "Unauthorized." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = authOTP;
