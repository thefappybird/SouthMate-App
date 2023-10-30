
const express = require("express");
const crypto = require("crypto");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const nodemailer = require("nodemailer");
const userRoute = require("../../SouthMate-Website/models/userModel");
const transactionRoute = require("../../SouthMate-Website/models/transactionModel");
const bankRoute = require("../../SouthMate-Website/models/bankModel");
const session = require("express-session");
const app = express();
const port = 3000;
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/SouthMate").then(console.log("mongoose has been connected")) 

const schema = new Schema({
    name: String
  }, {
    capped: { size: 1024 },
    bufferCommands: false,
    autoCreate: false // disable `autoCreate` since `bufferCommands` is false
  });
  
  const Model = mongoose.model('Test', schema);
  // Explicitly create the collection before using it
  // so the collection is capped.
  await Model.createCollection();

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
// const jwt = require("jsonwebtoken");
// const { error, log } = require("console");
// const { userInfo } = require("os");

// const generateSecretKey = () => {
//   const secretKey = crypto.randomBytes(32).toString("hex");
//   return secretKey;
// };

// const secretKey = generateSecretKey();

// app.post("/register", async (req, res) => {
//   try {
//     console.log(req.body);
//     const newUser = await userRoute.create(req.body);
//     console.log(newUser);
//     await newUser.save();
//     res.status(200).json({ message: "Register Successful" });
//   } catch (error) {
//     console.log("Error registering user", error);
//     res.status(500).json({ message: "error registering user" });
//   }
// });
// const sendVerificationEmail = async (email, verificationToken) => {
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: "alex.banaag1@gmail.com",
//       pass: "ghfb brsl nyaj wdos",
//     },
//   });
//   const mailOptions = {
//     from: "SouthMate.edu.ph",
//     to: email,
//     subject: "Email Verification",
//     text: `please click the following link to verify your email http:/localhost:3000/verify/${verificationToken}`,
//   };
//   try {
//     await transporter.sendMail(mailOptions);
//   } catch (error) {
//     console.log("error sending email", error);
//   }
// };

// app.get("/verify/:token", async (req, res) => {
//   try {
//     const token = req.params.token;

//     const user = await User.findOne({ verificationToken: token });
//     if (!user) {
//       return res.status(404).json({ message: "Invalid token" });
//     }
//     user.verified = true;
//     user.verificationToken = undefined;
//     await user.save();

//     res.status(200).json({ message: "Email verified successfully" });
//   } catch (error) {
//     console.log("error getting token", error);
//     res.status(500).json({ message: "Email verification failed" });
//   }
// });

// app.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email: email });
//     if (!user) {
//       return res.status(404).json({ message: "Invalid user" });
//     }
//     if (user.password != password) {
//       return res.status(404).json({ message: "Invalid password" });
//     }

//     const token = jwt.sign({ userId: user._id }, secretKey);
//     res.status(200).json({ token });
//   } catch (error) {
//     res.status(500).json({ message: "Login failed" });
//   }
// });

