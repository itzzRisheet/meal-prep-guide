const Ingredient = require('../models/Ingredient');

// Get all ingredients
exports.getAllIngredients = async (req, res) => {
  try {
    const ingredients = await Ingredient.find().sort({ category: 1, name: 1 }).lean();
    res.json(ingredients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get ingredients by category
exports.getIngredientsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const ingredients = await Ingredient.find({ category }).lean();
    res.json(ingredients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create ingredient
exports.createIngredient = async (req, res) => {
  try {
    const {
      name,
      category,
      nutrients,
      vitamins_minerals
    } = req.body;

    if (!name || !category) {
      return res.status(400).json({
        message: 'Name and category are required'
      });
    }

    const ingredient = new Ingredient({
      name: name.trim(),
      category,
      nutrients: nutrients || {},
      vitamins_minerals: vitamins_minerals || [],
      isCustom: true
    });

    const newIngredient = await ingredient.save();

    res.status(201).json(newIngredient);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'Ingredient already exists'
      });
    }

    res.status(400).json({
      message: error.message
    });
  }
};
// Update ingredient
exports.updateIngredient = async (req, res) => {
  try {
    const ingredient = await Ingredient.findById(req.params.id);
    if (!ingredient) return res.status(404).json({ message: 'Ingredient not found' });

    Object.assign(ingredient, req.body);
    const updatedIngredient = await ingredient.save();
    res.json(updatedIngredient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete ingredient
exports.deleteIngredient = async (req, res) => {
  try {
    const ingredient = await Ingredient.findByIdAndDelete(req.params.id);
    if (!ingredient) return res.status(404).json({ message: 'Ingredient not found' });
    res.json({ message: 'Ingredient deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
