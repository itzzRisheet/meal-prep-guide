const Dish = require('../models/Dish');
const Ingredient = require('../models/Ingredient');

// Get all dishes
exports.getAllDishes = async (req, res) => {
  try {
    const dishes = await Dish.find().lean();
    res.json(dishes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get dishes by category
exports.getDishesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const dishes = await Dish.find({ category }).lean();
    res.json(dishes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single dish
exports.getDishById = async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id).lean();
    if (!dish) return res.status(404).json({ message: 'Dish not found' });
    res.json(dish);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create dish
exports.createDish = async (req, res) => {
  const { name, category, description, ingredients, recipe, youtubeLink, prepTime, difficulty } = req.body;

  const dish = new Dish({
    name,
    category,
    description,
    ingredients,
    recipe,
    youtubeLink,
    prepTime,
    difficulty,
    isCustom: true
  });

  try {
    const newDish = await dish.save();
    res.status(201).json(newDish);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update dish
exports.updateDish = async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id);
    if (!dish) return res.status(404).json({ message: 'Dish not found' });

    Object.assign(dish, req.body);
    const updatedDish = await dish.save();
    res.json(updatedDish);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete dish
exports.deleteDish = async (req, res) => {
  try {
    const dish = await Dish.findByIdAndDelete(req.params.id);
    if (!dish) return res.status(404).json({ message: 'Dish not found' });
    res.json({ message: 'Dish deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search dishes by ingredients
exports.searchByIngredients = async (req, res) => {
  try {
    const { ingredients } = req.body; // Array of ingredient names

    const dishes = await Dish.find({
      'ingredients.name': { $in: ingredients }
    });

    // Sort by number of matching ingredients (descending)
    const sorted = dishes.map(dish => {
      const matches = dish.ingredients.filter(ing =>
        ingredients.includes(ing.name)
      ).length;
      return { ...dish._doc, matchCount: matches };
    }).sort((a, b) => b.matchCount - a.matchCount);

    res.json(sorted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
