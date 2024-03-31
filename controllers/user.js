const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  VALIDATION_ERROR,
  SUCCEED,
  OK,
  UNAUTHORIZED,
} = require('../utils/constants');

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(VALIDATION_ERROR);
    throw new Error('All fields are required!');
  }

  const existedUser = await User.findOne({ email });

  if (existedUser) {
    res.status(VALIDATION_ERROR);
    throw new Error('The user is already exist!');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  console.log(user);

  if (!user) {
    res.status(VALIDATION_ERROR);
    throw new Error('The data is invalid');
  }

  res.status(SUCCEED).json({
    _id: user.id,
    username: user.username,
    email: user.email,
    created_at: user.createdAt,
    updated_at: user.updatedAt,
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(VALIDATION_ERROR);
    throw new Error('All fields are required!');
  }

  const user = await User.findOne({ email });
  const comparePassword = await bcrypt.compare(password, user.password);

  if (!user || !comparePassword) {
    res.status(UNAUTHORIZED);
    throw new Error('The user is unauthorized');
  }

  const accessToken = jwt.sign(
    {
      user: {
        username: user.username,
        email: user.email,
        id: user.id,
      },
    },
    process.env.ACCESS_TOKEN_KEY,
    { expiresIn: process.env.TOKEN_TIMEOUT || '1d' }
  );

  res.status(OK).json({ accessToken });
});

const currentUser = (req, res) => {
  res.status(OK).json({ message: 'Current user' });
};

module.exports = {
  registerUser,
  loginUser,
  currentUser,
};
