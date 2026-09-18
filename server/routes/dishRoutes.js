const express = require('express');
const router = express.Router();
const dishController = require('../controllers/dishController');

// Get all dishes
router.get('/', dishController.getAllDishes);

// Get dishes by category
router.get('/category/:category', dishController.getDishesByCategory);

// Get single dish
router.get('/:id', dishController.getDishById);

// Search by ingredients
router.post('/search/ingredients', dishController.searchByIngredients);

// Create dish
router.post('/', dishController.createDish);

// Update dish
router.put('/:id', dishController.updateDish);

// Delete dish
router.delete('/:id', dishController.deleteDish);

module.exports = router;
