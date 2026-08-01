import { Router } from 'express';
import { query } from '../db.js';

const router = Router();

// GET /api/business?category=instalatori&sector=sector-3&verified=true
router.get('/', async (req, res) => {
  const { category, sector, verified } = req.query;

  const conditions = ['b.activ = TRUE'];
  const params = [];

  if (category) {
    params.push(category);
    conditions.push(`b.id IN (
      SELECT bcm.business_id FROM business_category_map bcm
      JOIN category c ON c.id = bcm.category_id
      WHERE c.slug = $${params.length}
    )`);
  }

  if (sector) {
    params.push(sector);
    conditions.push(`b.id IN (
      SELECT bsm.business_id FROM business_sector_map bsm
      JOIN sector s ON s.id = bsm.sector_id
      WHERE s.slug = $${params.length}
    )`);
  }

  if (verified === 'true') {
    conditions.push('b.is_verified = TRUE');
  }

  const sql = `
    SELECT b.id, b.nume, b.descriere, b.plan, b.is_verified, b.rating_mediu, b.telefon
    FROM business b
    WHERE ${conditions.join(' AND ')}
    ORDER BY
      CASE b.plan WHEN 'elite' THEN 0 WHEN 'premium' THEN 1 ELSE 2 END,
      b.is_verified DESC,
      b.rating_mediu DESC NULLS LAST
    LIMIT 100
  `;

  const { rows } = await query(sql, params);
  res.json(rows);
});

// GET /api/business/:id — profil complet
router.get('/:id', async (req, res) => {
  const { rows } = await query('SELECT * FROM business WHERE id = $1 AND activ = TRUE', [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: 'Profil inexistent' });

  const business = rows[0];
  delete business.autorizatie_scan_url; // niciodata public

  const photos = await query('SELECT url, ordine FROM business_photo WHERE business_id = $1 ORDER BY ordine', [req.params.id]);
  const categories = await query(
    `SELECT c.slug, c.nume FROM category c
     JOIN business_category_map bcm ON bcm.category_id = c.id
     WHERE bcm.business_id = $1`,
    [req.params.id]
  );
  const sectors = await query(
    `SELECT s.slug, s.nume FROM sector s
     JOIN business_sector_map bsm ON bsm.sector_id = s.id
     WHERE bsm.business_id = $1`,
    [req.params.id]
  );
  const reviews = await query('SELECT rating, text, creat_la FROM review WHERE business_id = $1 AND aprobat = TRUE', [req.params.id]);

  res.json({ ...business, photos: photos.rows, categories: categories.rows, sectors: sectors.rows, reviews: reviews.rows });
});

// POST /api/business — formular de listare (review manual inainte de activ = true in productie)
// category_ids si sector_ids sunt SLUG-uri (ex: 'instalatori', 'sector-3'), nu id-uri numerice —
// asa cum le trimite formularul din frontend.
router.post('/', async (req, res) => {
  const { nume, descriere, ani_experienta, program, telefon, whatsapp, email, adresa, category_ids, sector_ids } = req.body;

  if (!nume || !telefon || !category_ids?.length || !sector_ids?.length) {
    return res.status(400).json({ error: 'Nume, telefon, cel puțin o categorie și un sector sunt obligatorii' });
  }

  const { pool } = await import('../db.js');
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const insertBusiness = await client.query(
      `INSERT INTO business (nume, descriere, ani_experienta, program, telefon, whatsapp, email, adresa)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id`,
      [nume, descriere, ani_experienta, program, telefon, whatsapp, email, adresa]
    );
    const businessId = insertBusiness.rows[0].id;

    const categoryRows = await client.query(
      'SELECT id FROM category WHERE slug = ANY($1)', [category_ids]
    );
    const sectorRows = await client.query(
      'SELECT id FROM sector WHERE slug = ANY($1)', [sector_ids]
    );

    for (const { id: catId } of categoryRows.rows) {
      await client.query('INSERT INTO business_category_map (business_id, category_id) VALUES ($1,$2)', [businessId, catId]);
    }
    for (const { id: secId } of sectorRows.rows) {
      await client.query('INSERT INTO business_sector_map (business_id, sector_id) VALUES ($1,$2)', [businessId, secId]);
    }

    await client.query('COMMIT');
    res.status(201).json({ id: businessId });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: 'Eroare la salvare', detail: err.message });
  } finally {
    client.release();
  }
});

export default router;
