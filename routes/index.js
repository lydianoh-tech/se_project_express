const router = require("express").Router();
const usersRouter = require("./users");
const itemsRouter = require("./clothingItems");
const { BAD_REQUEST_ERROR } = require("../utils/errors");

router.use("/users", usersRouter);
router.use("/items", itemsRouter);

// Non-existent resource handler
router.use((req, res) => {
  res
    .status(BAD_REQUEST_ERROR)
    .send({ message: "Requested resource not found" });
});

module.exports = router;
