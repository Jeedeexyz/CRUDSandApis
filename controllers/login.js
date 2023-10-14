const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const loginTest = require("../models/login");
const dotenv = require("dotenv")
const nodemailer = require("nodemailer");
const { nextTick } = require("process");
dotenv.config();

// Sign-up Api or controller function

const SignupUser = async (req, res) => {
  try {
    const { username, email, password} = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    const loginUser = new loginTest({
      username,
      email,
      password: hashPassword,
    });
    await loginUser.save();
    res.status(201).json({ message: "User created !" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login Api or controller function

const LoginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await loginTest.findOne({ email: email });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ id: user.id, role: user.role}, process.env.PRIVATE_KEY, { expiresIn: "1hr" });
      res.status(200).json({message:`Login as ${user.role}`, token });
    } else {
      res.status(401).json({ error: "Invalid credentional" });
    }
  } catch (error) {
    res.status(500).json({ message:"Error in controller" });
  }
};

//This will be only access by Super Admin to add users and update there roles

const registerUserAndUpdateRole = async (req, res) => {
  try {
    const { email, role } = req.body;
    const userExistenceCheck = await loginTest.findOne({ email });
    if (userExistenceCheck) {
      try {
        const dataAgainstEmail = await loginTest.findOneAndUpdate(
          { email },
          {
            role,
          },
          { new: true }
        );
        res.json(dataAgainstEmail);
      } catch (error) {
        res.json({
          message:
            "The email is not registered please register it with role to edit it's role again!",
        });
      }
    } else {
      try {
        const { username, email, password, role } = req.body;
        const hashPassword = await bcrypt.hash(password, 10);
        const loginUser = new loginTest({
          username,
          email,
          password: hashPassword,
          role,
        });
        await loginUser.save();
        res.status(201).json({ message: "User created !" });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//This will handle the forget request
const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body ;
   
    const userData = await loginTest.findOne({ email: email });
    if (!userData) {
      res.json({ message: "This email is not registered !" });
    }
    const Secret = process.env.PRIVATE_KEY + userData.password;

    const token = jwt.sign(
      { email: userData.email, id: userData._id },
      Secret,
      { expiresIn: "55m" }
    );

    const link = `http://localhost:${process.env.PORT}/signinSystem/resetPassword/${userData._id}/${token}`;

    let smtpConfig = {
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      service: "gmail",
      auth: {
        user: process.env.email,
        pass: process.env.password,
      },
    };

    const transporter = nodemailer.createTransport(smtpConfig);

    const mailOptions = {
      from: process.env.email,
      to: userData.email,
      subject: "Reset Password",
      text: `Here is the link to reset your password: ${link}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        res.json({ messsage:"Email is not sent !!!!!!" });
      } else {
        res.json({ message: "The email is sent !" });
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//This will handle the forget password request by otp 
const forgetPasswordWithOTP = async (req, res) => {
  try {
    const { email } = req.body ;

    const userData = await loginTest.findOne({ email: email });
   
    if (!userData) {
      res.json({ message: "This email is not registered !" });
    }
    const Secret = process.env.PRIVATE_KEY + userData.password;
    function otpGenerator (){ 
          
      let digits = '0123456789'; 
      let OTP = ''; 
      for (let i = 0; i < 4; i++ ) { 
          OTP += digits[Math.floor(Math.random() * 10)]; 
      } 
      return OTP; 
  } 

  const otp = otpGenerator();

    const token = jwt.sign(
      { email: userData.email, id: userData._id, otp: otp },
      Secret,
      { expiresIn: "55m" }
    );

    const link = `http://localhost:${process.env.PORT}/signinSystem/resetPassword/${userData._id}/${token}`;
    const output = `
    <h1>You have requasted an password rest. Follow the above link to reset password</h1>
    <button><a href="${link}">${otp}</a></button>
    <h3>This is a test</h3> `;

    let smtpConfig = {
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      service: "gmail",
      auth: {
        user: process.env.email,
        pass: process.env.password,
      },
    };

    const transporter = nodemailer.createTransport(smtpConfig);

    const mailOptions = {
      from: process.env.email,
      to: userData.email,
      subject: "Reset Password",
      html: output
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        res.json({ messsage:"Email is not sent !!!!!!" });
      } else {
        res.json({ message: "The email is sent !" });
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//This will handle the reset request
const reset = async (req, res) => {
  const { id, token } = req.params;
  const userData = await loginTest.findOne({ _id: id });
  if (!userData) {
    res.json({ message: "User not found !" });
  }
  const Secret = process.env.PRIVATE_KEY + userData.password;
  try {
    const verify = jwt.verify(token, Secret);
    res.json({ message: "The token is verified !" });
  } catch (error) {
    res.json({ message: "The token is not verified !" });
  }
};

const resetPassword = async (req, res) => {
  const { id, token } = req.params;
  const { password,confirmPassword } = req.body;
  const userData = await loginTest.findOne({ _id: id });
  if (!userData) {
    res.json({ message: "User not found !" });
  }

//   if (password !== confirmPassword) {
//     res.json({ message: "The passwords do not match !" });
//   }
  const Secret = process.env.PRIVATE_KEY + userData.password;
  try {
    // const verify = jwt.verify(token, Secret);
    const newPassword = await bcrypt.hash(password, 10);
    await loginTest.updateOne(
      { _id: id },
      {
        $set: {
          password: newPassword,
        },
      },
      { new: true }
    );
token.expiresIn = null;
    res.json({ message: "The password is updated !" });
  } catch (error) {
    res.json({ message: "The token is not verified !" });
  }
};

//This will get all data

const getAllData = async (req, res) => {
    try {
      const getData = await loginTest.find({});
      res.json(getData);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

module.exports = {
  SignupUser,
  LoginUser,
  registerUserAndUpdateRole,
  forgetPassword,
  forgetPasswordWithOTP,
  reset,
  resetPassword,
  getAllData
};
