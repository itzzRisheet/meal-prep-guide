require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

const MONGO_URI = process.env.MONGODB_URI;
if (!MONGO_URI) {
  console.error('MONGODB_URI not set in environment (.env)');
  process.exit(1);
}

async function run() {
  try {
    console.log('Connecting to', MONGO_URI);
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'Data'
    });

    const db = mongoose.connection.db;

    // Import Ingredients
    console.log('\n--- Importing Ingredients ---');
    const ingredientsFile = path.join(__dirname, '..', 'data', 'ingredients.json');
    const ingredientsDocs = JSON.parse(fs.readFileSync(ingredientsFile, 'utf8'));
    
    await db.collection('Ingredients').deleteMany({});
    console.log('Cleared existing Ingredients collection.');
    
    const ingredientsRes = await db.collection('Ingredients').insertMany(ingredientsDocs);
    console.log('Inserted', ingredientsRes.insertedCount, 'ingredients.');

    // Import Dishes
    console.log('\n--- Importing Dishes ---');
    const dishesFile = path.join(__dirname, '..', 'data', 'dishes.json');
    if (fs.existsSync(dishesFile)) {
      const dishesDocs = JSON.parse(fs.readFileSync(dishesFile, 'utf8'));
      
      await db.collection('Dishes').deleteMany({});
      console.log('Cleared existing Dishes collection.');
      
      const dishesRes = await db.collection('Dishes').insertMany(dishesDocs);
      console.log('Inserted', dishesRes.insertedCount, 'dishes.');
    } else {
      console.log('Dishes file not found at', dishesFile);
    }

    console.log('\n✓ All imports complete.');
  } catch (err) {
    console.error('Import error:', err.message || err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
