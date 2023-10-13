const jwt = require("jsonwebtoken");

const authenticateWithToken = (req, res, next) => {
  try {
    req.headers.authorization && 
    req.headers.authorization.startsWith("Bearer");

    let token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Access Denied , token mssing" });
    }
    jwt.verify(token, process.env.PRIVATE_KEY, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Invalid Token" });
      }
      req.user = user;
      next();
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server Error !" });
  }
};

module.exports = authenticateWithToken;
