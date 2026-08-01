import { Router } from 'express';
import { query } from '../db.js';

const router = Router();

// GET /api/categories
router.get('/', async (_req, res) => {
  const { rows } = await query('SELECT * FROM category ORDER BY nume');
  res.json(rows);
});

// GET /api/categories/:slug
router.get('/:slug', async (req, res) => {
  const { rows } = await query('SELECT * FROM category WHERE slug = $1', [req.params.slug]);
  if (!rows.length) return res.status(404).json({ error: 'Categorie inexistentă' });
  res.json(rows[0]);
});

export default router;
