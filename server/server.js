const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'Data'
})
  .then(() => console.log('MongoDB connected to Data database'))
  .catch(err => console.log('MongoDB connection error:', err));

// Routes
app.use('/api/dishes', require('./routes/dishRoutes'));
app.use('/api/ingredients', require('./routes/ingredientRoutes'));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Meal Prep API Server' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
