const Dish = require("../../models/Dishmodel");
const Category = require("../../models/Categorymodel");
const createHttpError = require("http-errors");
const mongoose = require("mongoose");
 
// Add Dish
const addDish = async (req, res, next) => {
  try {
    const { name, category, price, description, isAvailable } = req.body;
    
    // Validate required fields
    if (!name) return next(createHttpError(400, "Dish name is required"));
    if (!category) return next(createHttpError(400, "Category is required"));
    if (!price || price <= 0) return next(createHttpError(400, "Valid price is required"));
    
    // Validate category exists
    if (!mongoose.Types.ObjectId.isValid(category)) {
      return next(createHttpError(400, "Invalid category ID"));
    }
    
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return next(createHttpError(404, "Category not found"));
    }
    
    // Check if dish with same name already exists
    const existingDish = await Dish.findOne({ name });
    if (existingDish) {
      return next(createHttpError(400, "Dish with this name already exists"));
    }
    
    const dish = new Dish({
      name,
      category,
      price,
      description: description || "",
      isAvailable: isAvailable !== undefined ? isAvailable : true
    });
    
    await dish.save();
    
    // Populate category for response
    await dish.populate('category', 'name');
    
    res.status(201).json({
      success: true,
      message: "Dish added successfully!",
      data: dish
    });
  } catch (err) {
    next(err);
  }
};

// Get all Dishes
const getDishes = async (req, res, next) => {
  try {
    const dishes = await Dish.find().populate('category', 'name description');
    res.status(200).json({
      success: true,
      data: dishes
    });
  } catch (err) {
    next(err);
  }
};

// Get single Dish
const getDish = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createHttpError(400, "Invalid dish ID"));
    }
    
    const dish = await Dish.findById(id).populate('category', 'name description');
    if (!dish) {
      return next(createHttpError(404, "Dish not found"));
    }
    
    res.status(200).json({
      success: true,
      data: dish
    });
  } catch (err) {
    next(err);
  }
};

// Update Dish
const updateDish = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, category, price, description, isAvailable } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createHttpError(400, "Invalid dish ID"));
    }
    
    // Validate category if provided
    if (category && !mongoose.Types.ObjectId.isValid(category)) {
      return next(createHttpError(400, "Invalid category ID"));
    }
    
    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return next(createHttpError(404, "Category not found"));
      }
    }
    
    const updateData = {};
    if (name) updateData.name = name;
    if (category) updateData.category = category;
    if (price !== undefined) updateData.price = price;
    if (description !== undefined) updateData.description = description;
    if (isAvailable !== undefined) updateData.isAvailable = isAvailable;
    
    const dish = await Dish.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('category', 'name description');
    
    if (!dish) {
      return next(createHttpError(404, "Dish not found"));
    }
    
    res.status(200).json({
      success: true,
      message: "Dish updated successfully!",
      data: dish
    });
  } catch (err) {
    next(err);
  }
};

// Delete Dish
const deleteDish = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createHttpError(400, "Invalid dish ID"));
    }
    
    const dish = await Dish.findByIdAndDelete(id);
    if (!dish) {
      return next(createHttpError(404, "Dish not found"));
    }
    
    res.status(200).json({
      success: true,
      message: "Dish deleted successfully!"
    });
  } catch (err) {
    next(err);
  }
};

// Get dishes by category
const getDishesByCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return next(createHttpError(400, "Invalid category ID"));
    }
    
    const dishes = await Dish.find({ category: categoryId })
      .populate('category', 'name description');
    
    res.status(200).json({
      success: true,
      data: dishes
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  addDish,
  getDishes,
  getDish,
  updateDish,
  deleteDish,
  getDishesByCategory
};