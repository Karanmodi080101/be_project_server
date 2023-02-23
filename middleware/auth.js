const jwt = require("jsonwebtoken");
const config = require("config");
const Users = require("../models/Users");

exports.verifyUser = async (req, res, next) => {
  //get token from header
  const token = req?.headers?.authorization?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({
      msg: "Auth denied",
    });
  }

  //verify token
  try {
    const decoded = jwt.verify(token, config.get("jwtToken"));
    const user = await Users.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });
    if (!user) {
      return res.status(401).json({
        msg: "Auth denied",
      });
    }
    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    res.status(401).json({
      msg: "Token is not valid",
    });
  }
};

exports.verifyAdmin = (req, res, next) => {
  if (req.user.isAdmin) {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    next();
  } else {
    err = new Error("You are not authorized to perform this operation!");
    err.statusCode = 403;
    next(err);
  }
};
