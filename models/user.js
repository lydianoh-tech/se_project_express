const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },
    avatar: {
      type: String,
      required: true,
      validate: {
        validator(value) {
          return validator.isURL(value); // ensures valid URL
        },
        message: "You must enter a valid URL",
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator(value) {
          return validator.isEmail(value); // ensures valid email format
        },
        message: "You must enter a valid email",
      },
    },
    password: {
      type: String,
      required: true,
      select: false, // prevents password from being returned in queries
    },
  },
  { versionKey: false }
);
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("Invalid email or password"));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error("Invalid email or password"));
        }
        return user;
      });
    });
};

module.exports = mongoose.model("User", userSchema);
