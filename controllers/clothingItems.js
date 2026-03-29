const ClothingItem = require("../models/clothingItem");
const { BadRequestError, NotFoundError, ForbiddenError } = require("../errors");
const { CREATED_STATUS_CODE } = require("../utils/errors");

const getItems = async (req, res) => {
  const items = await ClothingItem.find({});
  res.send(items);
};

const createItem = async (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id; // why: ensures ownership before real auth exists

  if (!name || !weather || !imageUrl) {
    throw new BadRequestError("Name, weather, and imageUrl are required");
  }

  try {
    const item = await ClothingItem.create({ name, weather, imageUrl, owner });
    res.status(CREATED_STATUS_CODE).send(item);
  } catch (err) {
    if (err.name === "ValidationError") {
      throw new BadRequestError("Invalid item data");
    }
    throw err;
  }
};

const deleteItem = async (req, res) => {
  const { itemId } = req.params;

  if (!itemId) {
    throw new BadRequestError("Item ID is required");
  }

  try {
    const item = await ClothingItem.findById(itemId).orFail(() => {
      throw new NotFoundError("Item not found");
    });

    // Only the owner can delete the item
    if (item.owner.toString() !== req.user._id.toString()) {
      throw new ForbiddenError("You are not authorized to delete this item");
    }

    await item.deleteOne();
    res.send({ message: "Item deleted successfully" });
  } catch (err) {
    if (err.name === "CastError") {
      throw new BadRequestError("Invalid item ID format");
    }
    throw err;
  }
};

const likeItem = async (req, res) => {
  const { itemId } = req.params;

  if (!itemId) {
    throw new BadRequestError("Item ID is required");
  }

  try {
    const item = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: req.user._id } }, // why: prevents duplicate likes
      { new: true }
    ).orFail(() => {
      throw new NotFoundError("Item not found");
    });

    res.send(item);
  } catch (err) {
    if (err.name === "CastError") {
      throw new BadRequestError("Invalid item ID format");
    }
    throw err;
  }
};

const dislikeItem = async (req, res) => {
  const { itemId } = req.params;

  if (!itemId) {
    throw new BadRequestError("Item ID is required");
  }

  try {
    const item = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $pull: { likes: req.user._id } }, // why: removes like cleanly without duplicates
      { new: true }
    ).orFail(() => {
      throw new NotFoundError("Item not found");
    });

    res.send(item);
  } catch (err) {
    if (err.name === "CastError") {
      throw new BadRequestError("Invalid item ID format");
    }
    throw err;
  }
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
