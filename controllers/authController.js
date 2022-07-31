import User from "../models/User.js";
import Token from "../models/Token.js";
import {
  createTokenUser,
  attachCookiesToResponse,
  sendVerificationEmail,
} from "../utils/index.js";
import cryptoJS from "crypto-js";

const register = async (req, res) => {
  const { name, email, password } = req.body;

  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    throw new Error("Email already exists");
  }

  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? "admin" : "user";

  const verificationToken = cryptoJS.SHA256();

  const user = await User.create({
    name,
    email,
    password,
    role,
    verificationToken,
  });
  const origin = "http://localhost:3000";
  await sendVerificationEmail({
    name: user.name,
    email: user.email,
    verificationToken: user.verificationToken,
    origin,
  });
  res.status(200).json({
    msg: "Success! Please check your email to verify account",
  });
};

const verifyEmail = async (req, res) => {
  const { verificationToken, email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Verification failed");
  }
  if (user.verificationToken !== verificationToken) {
    throw new Error("Verification failed");
  }

  user.isVerified = true;
  user.verified = Date.now();
  user.verificationToken = "";
  await user.save();
  res.status(200).json({ msg: "Email verified" });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new Error("please enter a valid email or password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("no user");
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new Error("Invalid password");
  }
  if (!user.isVerified) {
    throw new Error("Please verify your email");
  }

  const tokenUser = createTokenUser(user);
  // create refresh token
  let refreshToken = "";

  // check for existing token
  refreshToken = cryptoJS.SHA256();
  const userAgent = req.headers["user-agent"];
  const ip = req.ip;
  const userToken = { refreshToken, ip, userAgent, user: user._id };

  await Token.create(userToken);
  attachCookiesToResponse({ res, user: tokenUser, refreshToken });
  res.status(200).json({ user: tokenUser });
};
const logout = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now() + 1000),
  });
  res.status(200).json({ msg: "user logged out" });
};

export { register, login, logout, verifyEmail };
