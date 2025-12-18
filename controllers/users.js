const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

const User = require("../models/user");

const {
  BAD_REQUEST_STATUS_CODE,
  NOT_FOUND_STATUS_CODE,
  SERVER_STATUS_CODE,
  CREATED_STATUS_CODE,
  CONFLICT_STATUS_CODE,
  DATABASE_ERROR_CODE,
  UNAUTHORIZED_STATUS_CODE,
} = require("../utils/errors");

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findUserByCredentials(email, password);

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });
    return res.send({ token });
  } catch (err) {
    console.error(err);
    if (err && err.message === "Invalid email or password") {
      return res
        .status(UNAUTHORIZED_STATUS_CODE)
        .send({ message: "Invalid email or password" });
    }
    return res
      .status(SERVER_STATUS_CODE)
      .send({ message: "An error has occurred on the server" });
  }
};

module.exports.getCurrentUser = async (req, res) => {
  try {
    const userId = req.user && req.user._id;

    const user = await User.findById(userId).orFail(() => {
      const error = new Error("User not found");
      error.statusCode = NOT_FOUND_STATUS_CODE;
      throw error;
    });

    return res.send(user);
  } catch (err) {
    console.error(err);

    if (err.name === "CastError") {
      return res
        .status(BAD_REQUEST_STATUS_CODE)
        .send({ message: "Invalid user ID format" });
    }

    if (err.statusCode === NOT_FOUND_STATUS_CODE) {
      return res
        .status(NOT_FOUND_STATUS_CODE)
        .send({ message: "User not found" });
    }

    return res
      .status(SERVER_STATUS_CODE)
      .send({ message: "An error has occurred on the server" });
  }
};
module.exports.updateUser = async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, avatar }, // why: only allow updating name and avatar
      { new: true, runValidators: true }
    ).orFail(() => {
      const error = new Error("User not found");
      error.statusCode = NOT_FOUND_STATUS_CODE;
      throw error;
    });

    return res.send(user);
  } catch (err) {
    console.error(err);
    if (err.name === "ValidationError") {
      return res
        .status(BAD_REQUEST_STATUS_CODE)
        .send({ message: "Invalid user data" });
    }
    if (err.statusCode === NOT_FOUND_STATUS_CODE) {
      return res
        .status(NOT_FOUND_STATUS_CODE)
        .send({ message: "User not found" });
    }
    return res
      .status(SERVER_STATUS_CODE)
      .send({ message: "An error has occurred on the server" });
  }
};

module.exports.createUser = async (req, res) => {
  try {
    const { name, avatar, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      avatar,
      email,
      password: hashedPassword,
    });

    return res.status(CREATED_STATUS_CODE).send({
      _id: user._id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
    });
  } catch (err) {
    console.error(err);

    if (err.name === "ValidationError") {
      return res
        .status(BAD_REQUEST_STATUS_CODE)
        .send({ message: "Invalid user data" });
    }
    if (err.code === DATABASE_ERROR_CODE) {
      return res
        .status(CONFLICT_STATUS_CODE)
        .send({ message: "Email already in use" });
    }

    return res
      .status(SERVER_STATUS_CODE)
      .send({ message: "An error has occurred on the server" });
  }
};
