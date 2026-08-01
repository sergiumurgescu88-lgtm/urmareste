import { Router } from 'express';
import multer from 'multer';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { query } from '../db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, '../../uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) return cb(null, true);
    cb(new Error('Doar imagini JPEG, PNG sau WebP sunt permise'));
  }
});

const router = Router();

const basicAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    res.set('WWW-Authenticate', 'Basic realm="Upload Panel"');
    return res.status(401).send('Autentificare necesara');
  }
  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [username, password] = credentials.split(':');

  if (username === 'admin' && password === process.env.ADMIN_PASSWORD) {
    return next();
  }
  res.set('WWW-Authenticate', 'Basic realm="Upload Panel"');
  return res.status(401).send('Autentificare eşuata');
};

router.use(basicAuth);

router.post('/upload/:businessId', upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Nicio imagine încãrcatç' });

    const photoUrl = '/uploads/' + req.file.filename;
    const { businessId } = req.params;

    const businessCheck = await query('SELECT id FROM business WHERE id = $1', [businessId]);
    if (!businessCheck.rows.length) return res.status(404).json({ error: 'Profil inexistent' });

    await query('INSERT INTO business_photo (business_id, url, ordine) VALUES ($1, $2, 0)', [businessId, photoUrl]);
    res.json({ success: true, url: photoUrl });
  } catch (err) {
    res.status(500).json({ error: 'Eroare la îcaĲcare', detail: err.message });
  }
});

export default router;