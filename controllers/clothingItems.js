const ClothingItem = require("../models/clothingItem");
const {
  BAD_REQUEST_ERROR,
  NOT_FOUND_ERROR,
  SERVER_ERROR,
} = require("../utils/errors");

module.exports.getItems = async (req, res) => {
  try {
    const items = await ClothingItem.find({});
    return res.send(items);
  } catch (err) {
    console.error(err);
    return res
      .status(SERVER_ERROR)
      .send({ message: "An error has occurred on the server" });
  }
};

module.exports.createItem = async (req, res) => {
  try {
    const { name, weather, imageUrl } = req.body;
    const owner = req.user._id; // why: ensures ownership before real auth exists

    const item = await ClothingItem.create({ name, weather, imageUrl, owner });
    return res.status(201).send(item);
  } catch (err) {
    console.error(err);

    if (err.name === "ValidationError") {
      return res
        .status(BAD_REQUEST_ERROR)
        .send({ message: "Invalid item data" });
    }

    return res
      .status(SERVER_ERROR)
      .send({ message: "An error has occurred on the server" });
  }
};

module.exports.deleteItem = async (req, res) => {
  try {
    await ClothingItem.findByIdAndDelete(req.params.itemId).orFail(() => {
      const error = new Error("Item not found");
      error.statusCode = NOT_FOUND_ERROR;
      throw error;
    });

    return res.send({ message: "Item deleted successfully" });
  } catch (err) {
    console.error(err);

    if (err.name === "CastError") {
      return res
        .status(BAD_REQUEST_ERROR)
        .send({ message: "Invalid item ID format" });
    }

    if (err.statusCode === NOT_FOUND_ERROR) {
      return res.status(NOT_FOUND_ERROR).send({ message: "Item not found" });
    }

    return res
      .status(SERVER_ERROR)
      .send({ message: "An error has occurred on the server" });
  }
};

module.exports.likeItem = async (req, res) => {
  try {
    const item = await ClothingItem.findByIdAndUpdate(
      req.params.itemId,
      { $addToSet: { likes: req.user._id } }, // why: prevents duplicate likes
      { new: true }
    ).orFail(() => {
      const error = new Error("Item not found");
      error.statusCode = NOT_FOUND_ERROR;
      throw error;
    });

    return res.send(item);
  } catch (err) {
    console.error(err);

    if (err.name === "CastError") {
      return res
        .status(BAD_REQUEST_ERROR)
        .send({ message: "Invalid item ID format" });
    }

    if (err.statusCode === NOT_FOUND_ERROR) {
      return res.status(NOT_FOUND_ERROR).send({ message: "Item not found" });
    }

    return res
      .status(SERVER_ERROR)
      .send({ message: "An error has occurred on the server" });
  }
};

module.exports.dislikeItem = async (req, res) => {
  try {
    const item = await ClothingItem.findByIdAndUpdate(
      req.params.itemId,
      { $pull: { likes: req.user._id } }, // why: removes like cleanly without duplicates
      { new: true }
    ).orFail(() => {
      const error = new Error("Item not found");
      error.statusCode = NOT_FOUND_ERROR;
      throw error;
    });

    return res.send(item);
  } catch (err) {
    console.error(err);

    if (err.name === "CastError") {
      return res
        .status(BAD_REQUEST_ERROR)
        .send({ message: "Invalid item ID format" });
    }

    if (err.statusCode === NOT_FOUND_ERROR) {
      return res.status(NOT_FOUND_ERROR).send({ message: "Item not found" });
    }

    return res
      .status(SERVER_ERROR)
      .send({ message: "An error has occurred on the server" });
  }
};
