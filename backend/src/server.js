import express from 'express';
import { connectToMongo } from './config/mongo.js';

const app = express();
app.use(express.json());

app.get('/', async (req, res) => {
  try {
    const db = await connectToMongo();
    const info = await db.admin().serverStatus();
    res.json({ ok: true, version: info.version });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

async function start() {
  try {
    const db = await connectToMongo();
    app.locals.db = db;
    const PORT = process.env.PORT ?? 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Server rodando em http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Falha ao iniciar a aplicação:', err);
    process.exit(1);
  }
}

start();

