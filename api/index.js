require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");
const app = express();
const cors = require("cors");
app.use(cors());
const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;
const EMAIL_PASS = process.env.EMAIL_PASS;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
const jwt = require("jsonwebtoken");

mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
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
      guardianEmail,
      type
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
      guardianEmail,
      type
    });
    newUser.mNumber = Number(mNumber);
    newUser.zipCode = Number(zipCode);
    newUser.idNumber = Number(idNumber);
    newUser.verificationToken = otpGenerator.generate(20);
    //save the  user to the database
    await newUser.save();
    sendVerificationEmail(newUser.email, newUser.verificationToken, 0);

    res.status(200).json({ message: "Registration successful" });
  } catch (error) {
    console.log("error registering user", error);
    res.status(500).json({ message: "error registering user" });
  }
});

let lastOtpTimestamp = 0;
let lastOtp = "";
app.post("/registerBank", async (req, res) => {
  try {
    const bankInfo = req.body;
    const newBank = new BankModel(bankInfo);
    await newBank.save();
    lastOtpTimestamp = 0;
    lastOtp = "";
    res.status(200).json({ message: "Bank Registration successful" });
  } catch (error) {
    console.log("error registering bank", error);
    res.status(500).json({ message: "error registering bank" });
  }
});

app.get("/fetchBanks", async (req, res) => {
  try {
    const ownerId = req.query._id;
    const data = await BankModel.find({ owner: ownerId });
    res.status(200).json(data);
  } catch (error) {
    console.log("error cashing in", error);
    res.status(500).json({ message: "error cashing in" });
  }
});
app.post("/cashIn", async (req, res) => {
  try {
    const transInfo = req.body;
    const user = await User.findOne({ _id: transInfo.owner });
    const updateBank = await BankModel.findOne({
      owner: user._id,
      bankName: transInfo.bank,
      accountNumber: transInfo.accNumber,
    });
    updateBank.balance -= parseFloat(transInfo.transAmount);
    user.balance += parseFloat(transInfo.transAmount);
    const newTransaction = new TransactionModel({
      sender: updateBank._id,
      senderName: updateBank.bankName,
      receiver: user._id,
      receiverName: user.name,
      amount: transInfo.transAmount,
      description: "Cash In",
    });
    sendReceiptEmail(user, newTransaction);
    await updateBank.save();
    await user.save();
    await newTransaction.save();
    lastOtpTimestamp = 0;
    lastOtp = "";
    res.status(200).json({ message: "Cash in success" });
  } catch (error) {
    console.log("error cashing in", error);
    res.status(500).json({ message: "error cashing in" });
  }
});
app.post("/cashOut", async (req, res) => {
  try {
    const transInfo = req.body;
    const user = await User.findOne({ _id: transInfo.owner });
    const updateBank = await BankModel.findOne({
      owner: user._id,
      bankName: transInfo.bank,
      accountNumber: transInfo.accNumber,
    });
    updateBank.balance += parseFloat(transInfo.transAmount);
    user.balance -= parseFloat(transInfo.transAmount);
    const newTransaction = new TransactionModel({
      sender: user._id,
      senderName: user.name,
      receiver: updateBank._id,
      receiverName: updateBank.bankName,
      amount: transInfo.transAmount,
      description: "Cash Out",
    });
    sendReceiptEmail(user, newTransaction);
    await updateBank.save();
    await user.save();
    await newTransaction.save();
    lastOtpTimestamp = 0;
    lastOtp = "";
    res.status(200).json({ message: "Cash in success" });
  } catch (error) {
    console.log("error cashing in", error);
    res.status(500).json({ message: "error cashing in" });
  }
});
app.post("/sendMoney", async (req, res) => {
  try {
    const transInfo = req.body;
    const user = await User.findOne({ _id: transInfo.senderId });
    const receiver = await User.findOne({email: transInfo.receiverEmail});
    receiver.balance += parseFloat(transInfo.transAmount);
    user.balance -= parseFloat(transInfo.transAmount);
    const newTransaction = new TransactionModel({
      sender: user._id,
      senderName: user.name,
      receiver: receiver._id,
      receiverName: receiver.name,
      amount: transInfo.transAmount,
      description: "Send Money",
    });
    sendReceiptEmail(user, newTransaction);
    await receiver.save();
    await user.save();
    await newTransaction.save();
    lastOtpTimestamp = 0;
    lastOtp = "";
    res.status(200).json({ message: "Send Money Success" });
  } catch (error) {
    console.log("error cashing in", error);
    res.status(500).json({ message: "error cashing in" });
  }
});
app.get("/fetchTransactions", async (req, res) => {
  try {
    const ownerId = req.query._id;
    const data = await TransactionModel.find({
      $or: [{ sender: ownerId }, { receiver: ownerId }],
    }).sort({ date: -1 });
    res.status(200).json(data);
  } catch (error) {
    console.log("error fetching transaction data", error);
    res.status(500).json({ message: "error fetching transaction data" });
  }
});
app.post("/sendOtp", (req, res) => {
  const email = req.body.email;
  const currentTime = Date.now();
  const timeDifference = currentTime - lastOtpTimestamp;
  const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds
  if (timeDifference < fiveMinutes) {
    return res.status(200).json({ success: true, otp: lastOtp });
  }
  const otp = otpGenerator.generate(6, { specialChars: false });
  lastOtpTimestamp = currentTime;
  lastOtp = otp;
  sendVerificationEmail(email, otp, 1);
  res.status(200).json({ success: true, otp });
});
const sendVerificationEmail = async (email, verificationToken, method) => {
  //create a nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "southmateofficial@gmail.com",
      pass: EMAIL_PASS,
    },
  });

  //compose the email message
  const mailOptions = [
    {
      from: "SouthMate.ph",
      to: email,
      subject: "Email Verification",
      text: `Please click the following link to verify your email http://localhost:3000/verify/${verificationToken}`,
    },
    {
      from: "SouthMate.ph",
      to: email,
      subject: "OTP Verification",
      text: `This is your OTP: ${verificationToken}, this OTP lasts for 5 minutes.`,
    },
  ];

  try {
    await transporter.sendMail(mailOptions[method]);
  } catch (error) {
    console.log("error sending email", error);
  }
};

const sendReceiptEmail = async(details, transactionDetails) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "southmateofficial@gmail.com",
      pass: EMAIL_PASS,
    },
  });
  const mailOptions = {
    from: "SouthMate.ph",
    to: details.type !== 'Student' ? details.email : [details.email, details.guardianEmail],
    subject: "Transaction Receipt",
    text: `This is your transaction receipt for the following transaction\nid:${transactionDetails._id},\nTransaction: ${transactionDetails.description} \nFrom: ${transactionDetails.senderName} \nTo: ${transactionDetails.receiverName}\nAmount: ₱${transactionDetails.amount}`,
  }
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log("error sending email", error);
  }
}
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
