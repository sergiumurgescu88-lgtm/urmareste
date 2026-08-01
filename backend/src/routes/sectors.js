import { Router } from 'express';
import { query } from '../db.js';

const router = Router();

// GET /api/sectors
router.get('/', async (_req, res) => {
  const { rows } = await query('SELECT * FROM sector ORDER BY id');
  res.json(rows);
});

export default router;
