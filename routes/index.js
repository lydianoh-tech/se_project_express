const router = require("express").Router();
const usersRouter = require("./users");
const { login, createUser } = require("../controllers/users");

const itemsRouter = require("./clothingItems");
const { NOT_FOUND_STATUS_CODE } = require("../utils/errors");

router.post("/signin", login);
router.post("/signup", createUser);

router.use("/users", usersRouter);
router.use("/items", itemsRouter);

// Non-existent resource handler
router.use((req, res) => {
  res
    .status(NOT_FOUND_STATUS_CODE)
    .send({ message: "Requested resource not found" });
});

module.exports = router;
