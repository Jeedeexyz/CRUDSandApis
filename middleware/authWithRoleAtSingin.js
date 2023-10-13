const loginTest = require("../models/login");

const authWithRoleAtSingin =  (role) => async (req, res, next) => {
  try {
    const { email, pasword } = req.body;
    userData = await loginTest.findOne({ email: email });


    if (role.includes(userData.role)) {
      next();
    } else {
      res.status(403).json({
        message: `${userData.role} is not allowed to login from here!`,
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = authWithRoleAtSingin;
