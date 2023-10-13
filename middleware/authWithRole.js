const jwt = require("jsonwebtoken");


const authWithRole = (Role) => (req, res, next) => {
  try {
    req.headers.authorization && 
    req.headers.authorization.startsWith("Bearer");

    let token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Access Denied, token missing" });
    }
    jwt.verify(token, process.env.PRIVATE_KEY, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Invalid Token" });
      }

      if (Role.include(user.Role) ) {
      
        next();

      } else {
        return res.status(403).json({ message: "Permissions denied!" }); 
      }
      
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server Error!" });
  }
};



module.exports = authWithRole;