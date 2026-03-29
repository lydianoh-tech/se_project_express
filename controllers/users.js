const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

const User = require("../models/user");

const {
  BadRequestError,
  NotFoundError,
  ConflictError,
  UnauthorizedError,
} = require("../errors");
const { CREATED_STATUS_CODE, DATABASE_ERROR_CODE } = require("../utils/errors");

module.exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Email and password are required");
  }

  try {
    const user = await User.findUserByCredentials(email, password);

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.send({ token });
  } catch (err) {
    if (err.message === "Invalid email or password") {
      throw new UnauthorizedError("Invalid email or password");
    }
    throw err;
  }
};

module.exports.getCurrentUser = async (req, res) => {
  const userId = req.user && req.user._id;

  if (!userId) {
    throw new UnauthorizedError("User not authenticated");
  }

  const user = await User.findById(userId).orFail(() => {
    throw new NotFoundError("User not found");
  });

  res.send(user);
};

module.exports.updateUser = async (req, res) => {
  const { name, avatar } = req.body;

  if (!name || !avatar) {
    throw new BadRequestError("Name and avatar are required");
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, avatar }, // why: only allow updating name and avatar
      { new: true, runValidators: true }
    ).orFail(() => {
      throw new NotFoundError("User not found");
    });

    res.send(user);
  } catch (err) {
    if (err.name === "ValidationError") {
      throw new BadRequestError("Invalid user data");
    }
    throw err;
  }
};

module.exports.createUser = async (req, res) => {
  const { name, username, avatar, email, password } = req.body;
  const normalizedName = name || username;

  if (!normalizedName || !avatar || !email || !password) {
    throw new BadRequestError(
      "Name or username, avatar, email, and password are required"
    );
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: normalizedName,
      avatar,
      email,
      password: hashedPassword,
    });

    res.status(CREATED_STATUS_CODE).send({
      _id: user._id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      throw new BadRequestError("Invalid user data");
    }
    if (err.code === DATABASE_ERROR_CODE) {
      throw new ConflictError("Email already in use");
    }
    throw err;
  }
};
