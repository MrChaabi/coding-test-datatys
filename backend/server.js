require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const pool = require('./sql/db');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());

pool.connect()
  .then(() => console.log(' Connecté à PostgreSQL'))
  .catch(err => console.error('Erreur de connexion PostgreSQL:', err));

app.post('/users', upload.single('avatar'), async (req, res) => {
  const { first_name, last_name, country, city, email, phone_number } = req.body;
  const avatar = req.file;

  console.log("📩 Données reçues :", req.body);
  console.log("🖼 Fichier reçu :", avatar);

  try {
    const result = await pool.query(
      'INSERT INTO users (first_name, last_name, country, city, email, phone_number, avatar_path) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [first_name, last_name, country, city, email, phone_number, avatar ? avatar.path : null]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Erreur lors de l'insertion :", error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});


app.get('/health', (req, res) => res.send({ message: 'ok' }));

app.listen(3002, () => {
    console.log('Serveur backend en écoute sur http://localhost:3002');
});


