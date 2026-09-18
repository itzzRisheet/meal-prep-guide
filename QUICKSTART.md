# Getting Started - Quick Setup Guide

## 1. MongoDB Setup

Make sure MongoDB is running:
```bash
# For local MongoDB
mongod
```

## 2. Backend Setup & Start

```bash
cd server
npm install
npm run dev
```

Server will run on `http://localhost:5000`

## 3. Frontend Setup & Start (in another terminal)

```bash
cd client
npm install
npm start
```

App will open on `http://localhost:3000`

## 4. Seed Sample Data (optional)

In server terminal:
```bash
# One-liner to seed data
node -e "const mongoose = require('mongoose'); const Dish = require('./models/Dish'); const Ingredient = require('./models/Ingredient'); const {sampleDishes, sampleIngredients} = require('./seedData'); mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/meal-prep-db').then(() => { Dish.insertMany(sampleDishes); Ingredient.insertMany(sampleIngredients); console.log('Sample data seeded!'); process.exit(); }).catch(err => { console.error('Error:', err); process.exit(1); });"
```

## 5. You're Done! 🎉

Visit `http://localhost:3000` and start using the app!

## Troubleshooting

**MongoDB connection error?**
- Make sure MongoDB is running (`mongod`)
- Check MONGODB_URI in server/.env

**Port already in use?**
- Change PORT in server/.env
- Change proxy in client/package.json

**Dependencies error?**
- Delete node_modules and package-lock.json
- Run `npm install` again
