// Seed script: adds sample products to MongoDB
// Run: npm run seed

require("dotenv").config();
const mongoose = require("mongoose");

const Product = require("../models/Product");
const sampleProducts = require("./sampleProducts");

async function runSeed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    await Product.deleteMany({});
    await Product.insertMany(sampleProducts);

    console.log("✅ Sample products inserted!");
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err.message);
    process.exit(1);
  }
}

runSeed();

