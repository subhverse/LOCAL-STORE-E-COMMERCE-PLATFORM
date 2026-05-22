const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { placeOrder, getMyOrders, getOrderById } = require("../controllers/orderController");

const router = express.Router();

router.post("/", protect, placeOrder);
router.get("/my", protect, getMyOrders);
router.get("/:id", protect, getOrderById);

module.exports = router;

