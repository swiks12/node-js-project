const jwt = require("jsonwebtoken");
const User = require("../models/User");

const checkAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization)
    return res.status(401).send({ error: "Auth token require" });
  const token = authorization.split(" ")[1];
  try {
    const _id = jwt.verify(token, "asdlajsdlkjsalkdj");
    const user = await User.findById(_id);
    req.user = user;
    next();
  } catch (e) {
    console.log(e.message);
    res.status(401).send({ error: e.message });
  }
};

module.exports = checkAuth;
