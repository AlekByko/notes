const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;
const mongoUrl = process.env.MONGO_URL || 'mongodb://mongo:27017/notes';

let db;

async function start() {
  const client = new MongoClient(mongoUrl);
  await client.connect();
  db = client.db(); // default db from connection string
  console.log('Connected to MongoDB');

  // Example API endpoint under /api
  app.get('/api/hello', async (req, res) => {
    res.json({ hello: 'world' });
  });

  // healthcheck for compose
  app.get('/healthz', (req, res) => res.send('ok'));

  app.listen(port, () => console.log(`Backend listening on ${port}`));
}

start().catch(err => {
  console.error('Failed to start backend:', err);
  process.exit(1);
});
