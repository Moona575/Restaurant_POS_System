const express = require("express");
const { 
  addDish, 
  getDishes, 
  getDish, 
  updateDish, 
  deleteDish, 
  getDishesByCategory 
} = require("../controllers/dishController");
const router = express.Router();
const { isVerifiedUser } = require("../middlewares/tokenVerification");

// Add a new dish
router.route("/").post(isVerifiedUser, addDish);

// Get all dishes
router.route("/").get(isVerifiedUser, getDishes);

// Get single dish by ID
router.route("/:id").get(isVerifiedUser, getDish);

// Update a dish by ID
router.route("/:id").put(isVerifiedUser, updateDish);

// Delete a dish by ID
router.route("/:id").delete(isVerifiedUser, deleteDish);

// Get dishes by category
router.route("/category/:categoryId").get(isVerifiedUser, getDishesByCategory);

module.exports = router;