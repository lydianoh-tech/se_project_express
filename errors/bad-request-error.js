const CustomError = require("./custom-error");

class BadRequestError extends CustomError {
  constructor(message = "Bad Request") {
    super(400, message);
  }
}

module.exports = BadRequestError;
