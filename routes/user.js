const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

const generateToken = (_id) => {//login pachi generate huncha
  const token = jwt.sign({ _id }, "asdlajsdlkjsalkdj", { expiresIn: "3d" });
  return token;
};

router.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username){
      return res.status(400).json({msg:"Username is required"});
    }

    const existingUser = await User.findOne({ username });

    
    if (existingUser) {
      res.status(400).send({ msg: `User with username ${username} already exists` });
    } else {
      console.log("Generating salt");
      const salt = await bcrypt.genSalt(10);
      console.log("hashing password" + password);
      const hashedPassword = await bcrypt.hash(password, salt);
      console.log(hashedPassword);

      const user = new User({ username, password: hashedPassword });
      await user.save();
      res.send({ msg: "User registered", user });
    }
  } catch (e) {
    res.status(500).send({ message: "Cannot Create User", error: e.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const token = generateToken(user._id);
        res.send({ msg: "Login Successful", token });
      } else {
        res.status(400).send({ msg: "Incorrect password" });
      }
    } else {
      res.status(400).send({ msg: "Incorrect username" });
    }
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});


// Route to get all users
router.get("/", async(req, res)=>{
  try {
    const users = await User.find();

    res.status(200).json({users})
  } catch (error) {
    res.status(500).json({error: error.message})
  }
})

module.exports = router;
