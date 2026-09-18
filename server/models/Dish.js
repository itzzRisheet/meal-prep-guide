const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['breakfast', 'meal', 'snacks'],
    required: true,
  },
  description: String,
  ingredients: [
    {
      name: String,
      quantity: String,
    }
  ],
  recipe: String,
  youtubeLink: String,
  prepTime: Number, // in minutes
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  isCustom: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { collection: 'Dishes' });

module.exports = mongoose.model('Dish', dishSchema);
