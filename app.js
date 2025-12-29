const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { SERVER_STATUS_CODE } = require("./utils/errors");
const mainRouter = require("./routes");

const app = express();

// listen to port 3001
const { PORT = 3001 } = process.env;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB locally because the app requires persistent data storage
mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

// Mounted here so all routes and the 404 handler inside routers apply globally
app.use(mainRouter);

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res
    .status(SERVER_STATUS_CODE)
    .send({ message: "An error occurred on the server" });
});

// Start server to allow external clients to communicate with the API
app.listen(PORT, () => {
  // if everything works fine, the console will show which port the application is listening to
  console.log(`App listening at port ${PORT}`);
});
