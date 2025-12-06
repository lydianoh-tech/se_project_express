const express = require("express");

// listen to port 3000
const { PORT = 3000 } = process.env;

const mainRouter = require("./routes");

const app = express();

const mongoose = require("mongoose");
app.use(express.json());

// Mounted here so all routes and the 404 handler inside routers apply globally
app.use(mainRouter);

// Connect to MongoDB locally because the app requires persistent data storage
mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");
app.use((req, res) => {
  res.status(404).send({ message: "Requested resource not found" });
});

app.use((req, res, next) => {
  req.user = {
    _id: "6932f9855f4d340caa01550d",
  };
  next();
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send({ message: "An error occurred on the server" });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

// Start server to allow external clients to communicate with the API
app.listen(PORT, () => {
  // if everything works fine, the console will show which port the application is listening to
  console.log(`App listening at port ${PORT}`);
});

module.exports.createClothingItem = (req, res) => {
  console.log(req.user._id); // _id will become accessible
};
