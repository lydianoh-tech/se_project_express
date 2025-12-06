// models/clothingItem.js
const mongoose = require("mongoose");
const validator = require("validator");
const clothingItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },
    weather: {
      type: String,
      required: true,
      enum: ["hot", "warm", "cold"], // ensures weather matches your React app
    },
    imageUrl: {
      type: String,
      required: true,
      validator(value) {
        return validator.isURL(value); // ensures valid URL
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // links the item to its author
    },
    likes: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now, // auto-generator
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model("ClothingItem", clothingItemSchema);
