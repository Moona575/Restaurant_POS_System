const Category = require("../models/categoryModel");
const createHttpError = require("http-errors");
const mongoose = require("mongoose");

// Add Category
const addCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name) return next(createHttpError(400, "Category name is required"));

    const existing = await Category.findOne({ name });
    if (existing) return next(createHttpError(400, "Category already exists"));

    const category = new Category({ name, description });
    await category.save();

    res.status(201).json({ success: true, message: "Category added!", data: category });
  } catch (err) {
    next(err);
  }
};

// Get all Categories
const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ success: true, data: categories });
  } catch (err) {
    next(err);
  }
};

// Delete Category
const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)) return next(createHttpError(404, "Invalid id"));

    const category = await Category.findByIdAndDelete(id);
    if (!category) return next(createHttpError(404, "Category not found"));

    res.status(200).json({ success: true, message: "Category deleted!" });
  } catch (err) {
    next(err);
  }
};
// Update Category
const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params; // category id from URL
    const { name, description } = req.body;

    // Validate id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createHttpError(404, "Invalid category ID"));
    }

    // Check if category exists
    const category = await Category.findById(id);
    if (!category) {
      return next(createHttpError(404, "Category not found"));
    }

    // Optional: prevent duplicate names
    if (name && name !== category.name) {
      const existing = await Category.findOne({ name });
      if (existing) {
        return next(createHttpError(400, "Category name already exists"));
      }
    }

    // Update fields
    if (name) category.name = name;
    if (description !== undefined) category.description = description;

    await category.save();

    res.status(200).json({ success: true, message: "Category updated!", data: category });
  } catch (err) {
    next(err);
  }
};


module.exports = { addCategory, getCategories, deleteCategory, updateCategory };
