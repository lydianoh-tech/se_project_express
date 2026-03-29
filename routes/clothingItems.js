const router = require("express").Router();

const authMiddleware = require("../middlewares/auth");
const {
  validateCardBody,
  validateItemId,
} = require("../middlewares/validation");

const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

// Public route: list items
router.get("/", (req, res, next) => getItems(req, res).catch(next));

// Protect the rest of item routes
router.use(authMiddleware);

router.post("/", validateCardBody, (req, res, next) =>
  createItem(req, res).catch(next)
);
router.delete("/:itemId", validateItemId, (req, res, next) =>
  deleteItem(req, res).catch(next)
);
router.put("/:itemId/likes", validateItemId, (req, res, next) =>
  likeItem(req, res).catch(next)
);
router.delete("/:itemId/likes", validateItemId, (req, res, next) =>
  dislikeItem(req, res).catch(next)
);

module.exports = router;
