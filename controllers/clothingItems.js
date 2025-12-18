const ClothingItem = require("../models/clothingItem");
const {
  BAD_REQUEST_STATUS_CODE,
  NOT_FOUND_STATUS_CODE,
  SERVER_STATUS_CODE,
  FORBIDDEN_STATUS_CODE,
  CREATED_STATUS_CODE,
} = require("../utils/errors");

const getItems = async (req, res) => {
  try {
    const items = await ClothingItem.find({});
    return res.send(items);
  } catch (err) {
    console.error(err);
    return res
      .status(SERVER_STATUS_CODE)
      .send({ message: "An error has occurred on the server" });
  }
};

const createItem = async (req, res) => {
  try {
    const { name, weather, imageUrl } = req.body;
    const owner = req.user._id; // why: ensures ownership before real auth exists

    const item = await ClothingItem.create({ name, weather, imageUrl, owner });
    return res.status(CREATED_STATUS_CODE).send(item);
  } catch (err) {
    console.error(err);

    if (err.name === "ValidationError") {
      return res
        .status(BAD_REQUEST_STATUS_CODE)
        .send({ message: "Invalid item data" });
    }

    return res
      .status(SERVER_STATUS_CODE)
      .send({ message: "An error has occurred on the server" });
  }
};

const deleteItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    const item = await ClothingItem.findById(itemId).orFail(() => {
      const error = new Error("Item not found");
      error.statusCode = NOT_FOUND_STATUS_CODE;
      throw error;
    });

    // Only the owner can delete the item
    if (item.owner.toString() !== req.user._id) {
      return res
        .status(FORBIDDEN_STATUS_CODE)
        .send({ message: "You are not authorized to delete this item" });
    }

    await item.deleteOne();

    return res.send({ message: "Item deleted successfully" });
  } catch (err) {
    console.error(err);

    if (err.name === "CastError") {
      return res
        .status(BAD_REQUEST_STATUS_CODE)
        .send({ message: "Invalid item ID format" });
    }

    if (err.statusCode === NOT_FOUND_STATUS_CODE) {
      return res
        .status(NOT_FOUND_STATUS_CODE)
        .send({ message: "Item not found" });
    }

    return res
      .status(SERVER_STATUS_CODE)
      .send({ message: "An error has occurred on the server" });
  }
};

const likeItem = async (req, res) => {
  try {
    const item = await ClothingItem.findByIdAndUpdate(
      req.params.itemId,
      { $addToSet: { likes: req.user._id } }, // why: prevents duplicate likes
      { new: true }
    ).orFail(() => {
      const error = new Error("Item not found");
      error.statusCode = NOT_FOUND_STATUS_CODE;
      throw error;
    });

    return res.send(item);
  } catch (err) {
    console.error(err);

    if (err.name === "CastError") {
      return res
        .status(BAD_REQUEST_STATUS_CODE)
        .send({ message: "Invalid item ID format" });
    }

    if (err.statusCode === NOT_FOUND_STATUS_CODE) {
      return res
        .status(NOT_FOUND_STATUS_CODE)
        .send({ message: "Item not found" });
    }

    return res
      .status(SERVER_STATUS_CODE)
      .send({ message: "An error has occurred on the server" });
  }
};

const dislikeItem = async (req, res) => {
  try {
    const item = await ClothingItem.findByIdAndUpdate(
      req.params.itemId,
      { $pull: { likes: req.user._id } }, // why: removes like cleanly without duplicates
      { new: true }
    ).orFail(() => {
      const error = new Error("Item not found");
      error.statusCode = NOT_FOUND_STATUS_CODE;
      throw error;
    });

    return res.send(item);
  } catch (err) {
    console.error(err);

    if (err.name === "CastError") {
      return res
        .status(BAD_REQUEST_STATUS_CODE)
        .send({ message: "Invalid item ID format" });
    }

    if (err.statusCode === NOT_FOUND_STATUS_CODE) {
      return res
        .status(NOT_FOUND_STATUS_CODE)
        .send({ message: "Item not found" });
    }

    return res
      .status(SERVER_STATUS_CODE)
      .send({ message: "An error has occurred on the server" });
  }
};
module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
