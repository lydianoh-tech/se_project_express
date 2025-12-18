const router = require("express").Router();
const authMiddleware = require("../middlewares/auth");
const { updateUser, getCurrentUser } = require("../controllers/users");

router.use(authMiddleware);

router.patch("/me", updateUser);
router.get("/me", getCurrentUser);

module.exports = router;
