import { Router } from 'express';
import { query } from '../db.js';

const router = Router();

const basicAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    res.set('WWW-Authenticate', 'Basic realm="Admin Panel"');
    return res.status(401).send('Autentificare necesară');
  }
  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [username, password] = credentials.split(':');

  if (username === 'admin' && password === process.env.ADMIN_PASSWORD) {
    return next();
  }
  res.set('WWW-Authenticate', 'Basic realm="Admin Panel"');
  return res.status(401).send('Autentificare eșuată');
};

router.use(basicAuth);

router.get('/pending', async (req, res) => {
  try {
    const { rows } = await query(`
      SELECT b.id, b.nume, b.telefon, b.email, b.descriere,
             array_agg(DISTINCT c.nume) as categorii,
             array_agg(DISTINCT s.nume) as sectoare
      FROM business b
      LEFT JOIN business_category_map bcm ON b.id = bcm.business_id
      LEFT JOIN category c ON bcm.category_id = c.id
      LEFT JOIN business_sector_map bsm ON b.id = bsm.business_id
      LEFT JOIN sector s ON bsm.sector_id = s.id
      WHERE b.activ = FALSE
      GROUP BY b.id
      ORDER BY b.id DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Eroare la preluarea profilurilor', detail: err.message });
  }
});

router.post('/approve/:id', async (req, res) => {
  try {
    await query('UPDATE business SET activ = TRUE WHERE id = $1', [req.params.id]);
    res.json({ success: true, message: 'Profil aprobat' });
  } catch (err) {
    res.status(500).json({ error: 'Eroare la aprobare', detail: err.message });
  }
});

router.post('/verify/:id', async (req, res) => {
  try {
    await query('UPDATE business SET is_verified = TRUE WHERE id = $1', [req.params.id]);
    res.json({ success: true, message: 'Profil marcat ca verificat' });
  } catch (err) {
    res.status(500).json({ error: 'Eroare la verificare', detail: err.message });
  }
});

export default router;
