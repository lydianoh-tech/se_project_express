require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { errors } = require("celebrate");

const mainRouter = require("./routes");
const errorHandler = require("./middlewares/error-handler");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const app = express();

// listen to port 3001
const { PORT = 3001, HOST = "0.0.0.0" } = process.env;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB locally because the app requires persistent data storage
mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

// Mounted here so all routes and the 404 handler inside routers apply globally
app.use(requestLogger);
app.use(mainRouter);
app.use(errorLogger);

// celebrate error handler (for celebrate/joi validation errors)
app.use(errors());

// Centralized error handler (must be last)
app.use(errorHandler);

// Start server to allow external clients to communicate with the API
app.listen(PORT, HOST, () => {
  process.stdout.write(`App listening at port ${PORT}\n`);
});
