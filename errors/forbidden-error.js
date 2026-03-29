const CustomError = require("./custom-error");

class ForbiddenError extends CustomError {
  constructor(message = "Forbidden") {
    super(403, message);
  }
}

module.exports = ForbiddenError;
