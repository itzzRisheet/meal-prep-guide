require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

const MONGO_URI = process.env.MONGODB_URI;
const docs = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'ingredients.json'), 'utf8'));

async function dropIfExists(db, name) {
  try {
    const collections = await db.listCollections({ name }).toArray();
    if (collections.length) {
      console.log('Dropping collection', name, 'from', db.databaseName);
      await db.dropCollection(name);
    } else {
      console.log('Collection', name, 'not found in', db.databaseName);
    }
  } catch (err) {
    console.warn('Could not drop', name, err.message || err);
  }
}

async function run() {
  if (!MONGO_URI) {
    console.error('MONGODB_URI not set');
    process.exit(1);
  }

  // 1) Connect to test DB and remove accidental collection(s)
  console.log('Connecting to default (test) DB to remove accidental imports...');
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, dbName: 'test' });
  try {
    const db = mongoose.connection.db;
    await dropIfExists(db, 'ingredients');
    await dropIfExists(db, 'Ingredients');
  } catch (err) {
    console.warn('Error while cleaning test DB:', err.message || err);
  }
  await mongoose.disconnect();

  // 2) Connect to Data DB and import into collection 'Ingredients'
  console.log('Connecting to target DB "Data" to import documents into collection "Ingredients"...');
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, dbName: 'Data' });
  try {
    const db = mongoose.connection.db;
    // clear target collection
    await db.collection('Ingredients').deleteMany({});
    console.log('Inserting', docs.length, 'documents into Data.Ingredients');
    const res = await db.collection('Ingredients').insertMany(docs);
    console.log('Inserted', res.insertedCount, 'documents into Data.Ingredients');
  } catch (err) {
    console.error('Import to Data failed:', err.message || err);
  } finally {
    await mongoose.disconnect();
  }

  console.log('Fix complete.');
}

run().catch(err => { console.error(err); process.exit(1); });
