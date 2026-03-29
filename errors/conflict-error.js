const CustomError = require("./custom-error");

class ConflictError extends CustomError {
  constructor(message = "Conflict") {
    super(409, message);
  }
}

module.exports = ConflictError;
