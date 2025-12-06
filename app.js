const express = require("express");

// listen to port 3001
const { PORT = 3001 } = process.env;

const mainRouter = require("./routes");

const app = express();

const mongoose = require("mongoose");
app.use(express.json());

// Connect to MongoDB locally because the app requires persistent data storage
mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

app.use((req, res, next) => {
  req.user = {
    _id: "6932f9855f4d340caa01550d",
  };
  next();
});

// Mounted here so all routes and the 404 handler inside routers apply globally
app.use(mainRouter);

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send({ message: "An error occurred on the server" });
});

// Start server to allow external clients to communicate with the API
app.listen(PORT, () => {
  // if everything works fine, the console will show which port the application is listening to
  console.log(`App listening at port ${PORT}`);
});
