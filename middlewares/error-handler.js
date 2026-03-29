const { SERVER_STATUS_CODE } = require("../utils/errors");

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || SERVER_STATUS_CODE;
  const message = err.message || "An error has occurred on the server";

  res.status(statusCode).send({ message });
};

module.exports = errorHandler;
