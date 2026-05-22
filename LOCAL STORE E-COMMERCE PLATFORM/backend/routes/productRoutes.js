const express = require("express");
const {
  getProducts,
  getCategories,
  getProductById,
  addReview
} = require("../controllers/productController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getProducts);
router.get("/categories", getCategories);
router.get("/:id", getProductById);
router.post("/:id/reviews", protect, addReview); // optional feature

module.exports = router;

