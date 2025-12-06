const User = require("../models/user");

const {
  BAD_REQUEST_ERROR,
  NOT_FOUND_ERROR,
  SERVER_ERROR,
} = require("../utils/errors");

module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (err) {
    console.error(err); // essential for debugging
    return res
      .status(SERVER_ERROR)
      .send({ message: "An error has occurred on the server" });
  }
};

module.exports.getUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).orFail(() => {
      const error = new Error("User not found");
      error.statusCode = NOT_FOUND_ERROR;
      throw error; // why: ensures catch block handles missing users
    });

    return res.send(user);
  } catch (err) {
    console.error(err);

    if (err.name === "CastError") {
      return res
        .status(BAD_REQUEST_ERROR)
        .send({ message: "Invalid user ID format" });
    }

    if (err.statusCode === NOT_FOUND_ERROR) {
      return res.status(NOT_FOUND_ERROR).send({ message: "User not found" });
    }

    return res
      .status(SERVER_ERROR)
      .send({ message: "An error has occurred on the server" });
  }
};

module.exports.createUser = async (req, res) => {
  try {
    const { name, avatar } = req.body;

    const user = await User.create({ name, avatar });
    return res.status(201).send(user);
  } catch (err) {
    console.error(err);

    if (err.name === "ValidationError") {
      return res
        .status(BAD_REQUEST_ERROR)
        .send({ message: "Invalid user data" });
    }

    return res
      .status(SERVER_ERROR)
      .send({ message: "An error has occurred on the server" });
  }
};
