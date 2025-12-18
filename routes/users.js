const router = require("express").Router();
const {
  updateUser,
  getCurrentUser,
  createUser,
} = require("../controllers/users");

router.patch("/me", updateUser);
router.get("/me", getCurrentUser);
router.post("/", createUser);

module.exports = router;
