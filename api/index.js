require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const app = express();
const port = 3000;
const cors = require("cors");
app.use(cors());
const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;
const EMAIL_PASS = process.env.EMAIL_PASS;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const jwt = require("jsonwebtoken");

mongoose
  .connect(
    MONGO_URL,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error Connecting to MongoDB");
  });

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});

const User = require("./models/userModel");
const TransactionModel = require("./models/transactionModel");
const BankModel = require("./models/bankModel");

app.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      mNumber,
      gender,
      birthDate,
      placeOfBirth,
      citizenship,
      houseAddress,
      province,
      cityMuni,
      zipCode,
      idNumber,
    } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }
    //create a new user
    const newUser = new User({
      name,
      email,
      password,
      gender,
      birthDate,
      placeOfBirth,
      citizenship,
      houseAddress,
      province,
      cityMuni,
    });
    newUser.mNumber = Number(mNumber);
    newUser.zipCode = Number(zipCode);
    newUser.idNumber = Number(idNumber);
    newUser.verificationToken = crypto.randomBytes(20).toString("hex");
    //save the  user to the database
    await newUser.save();
    sendVerificationEmail(newUser.email, newUser.verificationToken);

    res.status(200).json({ message: "Registration successful" });
  } catch (error) {
    console.log("error registering user", error);
    res.status(500).json({ message: "error registering user" });
  }
});
app.post('/registerBank', async (req,res) => {
  try {
    const bankInfo = req.body;
    const newBank = new BankModel(bankInfo);
    await newBank.save()
  res.status(200).json({ message: "Bank Registration successful" });
  } catch (error) {
    console.log("error registering bank", error);
    res.status(500).json({ message: "error registering bank" });
  }
});

const sendVerificationEmail = async (email, verificationToken) => {
  //create a nodemailer transporter

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "alex.banaag1@gmail.com",
      pass: EMAIL_PASS,
    },
  });

  //compose the email message
  const mailOptions = {
    from: "SouthMate.ph",
    to: email,
    subject: "Email Verification",
    text: `Please click the following link to verify your email http://localhost:3000/verify/${verificationToken}`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log("error sending email", error);
  }
};

app.get("/verify/:token", async (req, res) => {
  try {
    const token = req.params.token;

    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(404).json({ message: "Invalid token" });
    }

    user.verified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.log("error getting token", error);
    res.status(500).json({ message: "Email verification failed" });
  }
});

const generateSecretKey = () => {
  const secretKey = crypto.randomBytes(32).toString("hex");
  return secretKey;
};

const secretKey = generateSecretKey();

app.post("/login", async (req, res) => {
  try {
    const { idNumber, password } = req.body;
    const user = await User.findOne({ idNumber: Number(idNumber) });
    if (!user) {
      return res.status(404).json({ message: "Invalid ID Number" });
    }

    if (user.password !== password) {
      return res.status(404).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ userId: user._id }, secretKey);

    res.status(200).json({ token, userId: user._id });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
});

app.get("/user/:id", (req, res) => {
  const userId = req.params.id;
  // Query the database to get user data by ID
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    })
    .catch((error) => {
      res.status(500).json({ message: "Error fetching user data", error });
    });
});


// app.get('/transactions', async (req, res) => {
//   try {
//     // Get the logged-in user ID from the authentication token or session
//     const userId = req.params.id;
//     console.log('test');// Adjust this based on your authentication setup
//     // Fetch transactions involving the logged-in user
//     const transactions = await TransactionModel.find({
//       $or: [{ sender: userId }, { receiver: userId }],
//     }).populate('sender receiver');

//     res.json(transactions);
//   } catch (error) {
//     console.error('Error fetching transactions', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });
