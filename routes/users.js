const router = require("express").Router();
const authMiddleware = require("../middlewares/auth");
const { validateProfileBody } = require("../middlewares/validation");
const { updateUser, getCurrentUser } = require("../controllers/users");

router.use(authMiddleware);

router.patch("/me", validateProfileBody, (req, res, next) =>
  updateUser(req, res).catch(next)
);
router.get("/me", (req, res, next) => getCurrentUser(req, res).catch(next));

module.exports = router;
