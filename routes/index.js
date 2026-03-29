const router = require("express").Router();
const usersRouter = require("./users");
const { login, createUser } = require("../controllers/users");
const { NotFoundError } = require("../errors");
const {
  validateLoginBody,
  validateUserBody,
} = require("../middlewares/validation");

const itemsRouter = require("./clothingItems");

router.post("/signin", validateLoginBody, (req, res, next) =>
  login(req, res).catch(next)
);
router.post("/signup", validateUserBody, (req, res, next) =>
  createUser(req, res).catch(next)
);

router.use("/users", usersRouter);
router.use("/items", itemsRouter);

// Non-existent resource handler
router.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

module.exports = router;
