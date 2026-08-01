import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import 'dotenv/config';

import categoriesRouter from './routes/categories.js';
import sectorsRouter from './routes/sectors.js';
import businessRouter from './routes/business.js';
import leadsRouter from './routes/leads.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/categories', categoriesRouter);
app.use('/api/sectors', sectorsRouter);
app.use('/api/business', businessRouter);
app.use('/api/leads', leadsRouter);

// productie: serveste build-ul React (Vite) generat in ../frontend/dist
const distPath = path.join(__dirname, '../../frontend/dist');
app.use(express.static(distPath));
app.get(/^(?!\/api).*/, (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`urmareste-backend rulează pe portul ${PORT}`));
