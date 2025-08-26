const express = require("express");
const { addCategory, getCategories, deleteCategory,updateCategory } = require("../controllers/categoryController");
const router = express.Router();
const { isVerifiedUser } = require("../middlewares/tokenVerification");

// Add a new category
router.route("/").post(isVerifiedUser, addCategory);

// Get all categories
router.route("/").get(isVerifiedUser, getCategories);

// Delete a category by ID
router.route("/:id").delete(isVerifiedUser, deleteCategory);
// Update a category by ID
router.route("/:id").put(isVerifiedUser, updateCategory);
module.exports = router;
