const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();
const JWT_SECRET = "your_secret_key"; 

router.post("/signup", async (req, res) => {
  const { username, firstname, lastname, password } = req.body;

  const existingUser = await User.findOne({ username });
  if (existingUser) return res.status(400).json({ msg: "Username already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, firstname, lastname, password: hashedPassword });
  await newUser.save();

  res.status(201).json({ msg: "User created successfully" });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ msg: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
  res.json({ token, username });
});

module.exports = router;