const User = require("../models/User");

// GET /api/users/me
async function getMyProfile(req, res, next) {
  try {
    const user = await User.findById(req.user._id).select("-password").populate({
      path: "cart.product",
      select: "name price imageUrl countInStock"
    });

    res.json(user);
  } catch (err) {
    next(err);
  }
}

module.exports = { getMyProfile };

