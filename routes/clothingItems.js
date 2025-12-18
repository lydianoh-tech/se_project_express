const router = require("express").Router();

const authMiddleware = require("../middlewares/auth");

const {
  updateUser,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

// Public route: list items

// Protect the rest of item routes
router.use(authMiddleware);
router.patch("/", updateUser);
router.post("/", createItem);
router.delete("/:itemId", deleteItem);
router.put("/:itemId/likes", likeItem);
router.delete("/:itemId/likes", dislikeItem);

module.exports = router;
