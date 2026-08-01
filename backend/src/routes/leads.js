import { Router } from 'express';
import { query } from '../db.js';

const router = Router();

// POST /api/leads — client trimite o cerere catre un business
router.post('/', async (req, res) => {
  const { business_id, sector_id, client_nume, client_telefon, mesaj } = req.body;

  if (!business_id || !client_nume || !client_telefon) {
    return res.status(400).json({ error: 'business_id, nume și telefon sunt obligatorii' });
  }

  const { rows } = await query(
    `INSERT INTO lead (business_id, sector_id, client_nume, client_telefon, mesaj)
     VALUES ($1,$2,$3,$4,$5) RETURNING id`,
    [business_id, sector_id || null, client_nume, client_telefon, mesaj || null]
  );

  await query('UPDATE business SET lead_count = lead_count + 1 WHERE id = $1', [business_id]);

  res.status(201).json({ id: rows[0].id });
});

export default router;
