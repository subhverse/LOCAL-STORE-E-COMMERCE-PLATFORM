const User = require("../models/User");
const Product = require("../models/Product");

function calculateCartTotal(cartItems) {
  let total = 0;
  for (const item of cartItems) {
    total += item.product.price * item.quantity;
  }
  return Number(total.toFixed(2));
}

// GET /api/cart (protected)
async function getCart(req, res, next) {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "cart.product",
      select: "name price imageUrl countInStock category"
    });

    const total = calculateCartTotal(user.cart);
    res.json({ items: user.cart, total });
  } catch (err) {
    next(err);
  }
}

// POST /api/cart (protected)
// body: { productId, quantity }
async function addToCart(req, res, next) {
  try {
    const { productId, quantity } = req.body;
    const qty = Number(quantity || 1);

    if (!productId) {
      res.status(400);
      throw new Error("productId is required");
    }
    if (!qty || qty < 1) {
      res.status(400);
      throw new Error("quantity must be at least 1");
    }

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }
    if (product.countInStock < qty) {
      res.status(400);
      throw new Error("Not enough stock");
    }

    const user = await User.findById(req.user._id);

    const existing = user.cart.find((i) => i.product.toString() === productId);
    if (existing) {
      existing.quantity = Math.min(existing.quantity + qty, product.countInStock);
    } else {
      user.cart.push({ product: productId, quantity: qty });
    }

    await user.save();

    const populatedUser = await User.findById(req.user._id).populate({
      path: "cart.product",
      select: "name price imageUrl countInStock category"
    });

    const total = calculateCartTotal(populatedUser.cart);
    res.status(201).json({ items: populatedUser.cart, total });
  } catch (err) {
    next(err);
  }
}

// PUT /api/cart/:productId (protected)
// body: { quantity }
async function updateCartItem(req, res, next) {
  try {
    const { quantity } = req.body;
    const productId = req.params.productId;
    const qty = Number(quantity);

    if (!qty || qty < 1) {
      res.status(400);
      throw new Error("quantity must be at least 1");
    }

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }
    if (product.countInStock < qty) {
      res.status(400);
      throw new Error("Not enough stock");
    }

    const user = await User.findById(req.user._id);
    const item = user.cart.find((i) => i.product.toString() === productId);

    if (!item) {
      res.status(404);
      throw new Error("Item not found in cart");
    }

    item.quantity = qty;
    await user.save();

    const populatedUser = await User.findById(req.user._id).populate({
      path: "cart.product",
      select: "name price imageUrl countInStock category"
    });

    const total = calculateCartTotal(populatedUser.cart);
    res.json({ items: populatedUser.cart, total });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/cart/:productId (protected)
async function removeFromCart(req, res, next) {
  try {
    const productId = req.params.productId;

    const user = await User.findById(req.user._id);
    user.cart = user.cart.filter((i) => i.product.toString() !== productId);
    await user.save();

    const populatedUser = await User.findById(req.user._id).populate({
      path: "cart.product",
      select: "name price imageUrl countInStock category"
    });

    const total = calculateCartTotal(populatedUser.cart);
    res.json({ items: populatedUser.cart, total });
  } catch (err) {
    next(err);
  }
}

module.exports = { getCart, addToCart, updateCartItem, removeFromCart };

