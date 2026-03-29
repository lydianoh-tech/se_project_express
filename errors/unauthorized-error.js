const CustomError = require("./custom-error");

class UnauthorizedError extends CustomError {
  constructor(message = "Unauthorized") {
    super(401, message);
  }
}

module.exports = UnauthorizedError;
