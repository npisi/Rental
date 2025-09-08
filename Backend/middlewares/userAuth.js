const jwt = require("jsonwebtoken");
const User = require("../model/userSchema");


const verifyUserAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
        return res.status(401).json({ error: "User not Logged In" });
    }
    var decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id } = decoded;

    const user = await User.findById(id);
    if (!user) {
      return res.send("User not Found");
    }
    req.user = user;  

    next();
  } catch (err) {
    res.status(500).send("Error : " + err.message);
  }
};

module.exports = {  verifyUserAuth };
