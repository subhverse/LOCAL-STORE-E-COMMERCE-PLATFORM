// LOCAL STORE E-COMMERCE PLATFORM - Backend Server
// Beginner-friendly Express + MongoDB + JWT project

require("dotenv").config();

const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");

const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// Routes
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// Connect DB
connectDB();

// Middlewares
app.use(helmet());
app.use(cors()); // For beginners: allow frontend to call backend from another port
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "LOCAL STORE E-COMMERCE PLATFORM" });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);

// OPTIONAL: Serve the frontend from backend (works great for beginners)
// If you open http://localhost:5000 you will see the frontend.
const frontendPath = path.join(__dirname, "..", "frontend");
app.use(express.static(frontendPath));
app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// Error handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

