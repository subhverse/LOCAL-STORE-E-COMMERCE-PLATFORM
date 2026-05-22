const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

function calculateTotal(items) {
  let total = 0;
  for (const item of items) {
    total += item.price * item.quantity;
  }
  return Number(total.toFixed(2));
}

// POST /api/orders (protected)
// Place an order using items from user's cart
async function placeOrder(req, res, next) {
  try {
    const { fullName, phone, address, city, pincode } = req.body;

    if (!fullName || !phone || !address || !city || !pincode) {
      res.status(400);
      throw new Error("Please fill all customer details");
    }

    const user = await User.findById(req.user._id).populate({
      path: "cart.product",
      select: "name price imageUrl countInStock"
    });

    if (!user.cart || user.cart.length === 0) {
      res.status(400);
      throw new Error("Your cart is empty");
    }

    // Build order items (snapshot)
    const items = user.cart.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      imageUrl: item.product.imageUrl
    }));

    // Check stock + reduce stock
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        res.status(404);
        throw new Error("Product not found while placing order");
      }
      if (product.countInStock < item.quantity) {
        res.status(400);
        throw new Error(`Not enough stock for ${product.name}`);
      }
      product.countInStock = product.countInStock - item.quantity;
      await product.save();
    }

    const totalPrice = calculateTotal(items);

    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress: { fullName, phone, address, city, pincode },
      totalPrice
    });

    // Clear cart
    user.cart = [];
    await user.save();

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
}

// GET /api/orders/my (protected)
async function getMyOrders(req, res, next) {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
}

// GET /api/orders/:id (protected) - order tracking
async function getOrderById(req, res, next) {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }
    if (order.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not allowed");
    }
    res.json(order);
  } catch (err) {
    next(err);
  }
}

module.exports = { placeOrder, getMyOrders, getOrderById };

