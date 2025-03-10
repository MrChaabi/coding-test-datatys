const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const { Pool } = require('pg');
const shajs = require('sha.js');
require('dotenv').config();

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const allowed = ['.png', '.jpg', '.jpeg'];
    allowed.includes(ext) ? cb(null, true) : cb(new Error('Format image non supporté'));
  }
});

const hashPassword = (password) => {
  return shajs('sha256')
    .update(`${password}${process.env.PEPPER}`)
    .digest('hex');
};

router.post('/', upload.single('avatar'), async (req, res) => {
  try {
    const { file, body } = req;
    const required = ['first_name', 'last_name', 'email', 'password'];
    
    for (const field of required) {
      if (!body[field]) return res.status(400).json({ error: `${field} manquant` });
    }

    const query = `
      INSERT INTO users (
        first_name, last_name, email, password, 
        country, city, phone_number, avatar_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, first_name, email
    `;

    const values = [
      body.first_name,
      body.last_name,
      body.email,
      hashPassword(body.password),
      body.country || null,
      body.city || null,
      body.phone_number || null,
      file?.filename ? `/uploads/${file.filename}` : null
    ];

    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);

  } catch (error) {
    error.code === '23505' 
      ? res.status(409).json({ error: 'Email déjà utilisé' })
      : res.status(500).json({ error: 'Erreur serveur' });
  }
});

// READ ALL
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, first_name, last_name, email, avatar_url 
      FROM users
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// UPDATE
router.put('/:id', upload.single('avatar'), async (req, res) => {
  try {
    const { id } = req.params;
    const updates = [];
    const values = [];
    let index = 1;

    const fields = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: req.body.password ? hashPassword(req.body.password) : undefined,
      country: req.body.country,
      city: req.body.city,
      phone_number: req.body.phone_number,
      avatar_url: req.file ? `/uploads/${req.file.filename}` : undefined
    };

    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined) {
        updates.push(`${key} = $${index}`);
        values.push(value);
        index++;
      }
    }

    if (updates.length === 0) return res.status(400).json({ error: 'Aucune modification' });

    values.push(id);
    const query = `
      UPDATE users
      SET ${updates.join(', ')}
      WHERE id = $${index}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    res.json(result.rows[0]);

  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [req.params.id]);
    res.json({ message: 'Utilisateur supprimé' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;