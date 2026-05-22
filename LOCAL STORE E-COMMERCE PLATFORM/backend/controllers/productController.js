const Product = require("../models/Product");

// GET /api/products
// Supports: search, category, sort
// Example:
// /api/products?search=phone&category=Electronics&sort=price_asc
async function getProducts(req, res, next) {
  try {
    const { search, category, sort } = req.query;

    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    if (category && category !== "All") {
      filter.category = category;
    }

    let query = Product.find(filter);

    // Sorting
    // sort values: price_asc, price_desc, name_asc, name_desc
    if (sort === "price_asc") query = query.sort({ price: 1 });
    if (sort === "price_desc") query = query.sort({ price: -1 });
    if (sort === "name_asc") query = query.sort({ name: 1 });
    if (sort === "name_desc") query = query.sort({ name: -1 });

    const products = await query;
    res.json(products);
  } catch (err) {
    next(err);
  }
}

// GET /api/products/categories
async function getCategories(req, res, next) {
  try {
    const categories = await Product.distinct("category");
    res.json(categories);
  } catch (err) {
    next(err);
  }
}

// GET /api/products/:id
async function getProductById(req, res, next) {
  try {
    const product = await Product.findById(req.params.id).populate("reviews.user", "name");
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
}

// OPTIONAL: POST /api/products/:id/reviews (protected)
async function addReview(req, res, next) {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    if (!rating || !comment) {
      res.status(400);
      throw new Error("Please provide rating and comment");
    }

    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      res.status(400);
      throw new Error("You already reviewed this product");
    }

    product.reviews.push({
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment
    });

    await product.save();
    res.status(201).json({ message: "Review added" });
  } catch (err) {
    next(err);
  }
}

module.exports = { getProducts, getCategories, getProductById, addReview };

