const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = process.env.PORT || 3001;

// Configuração do Multer para armazenamento de arquivos em memória
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true }));

// Configuração do PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: 5432,
  ssl: { rejectUnauthorized: false }
});

// Função para criar tabelas
async function initializeDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS animals (
        id UUID PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        race VARCHAR(255),
        image TEXT
      );
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS images (
        id SERIAL PRIMARY KEY,
        image TEXT NOT NULL,
        filename VARCHAR(255) NOT NULL
      );
    `);
    console.log('Tabelas criadas ou já existentes');
  } catch (error) {
    console.error('Erro ao criar tabelas', error);
  }
}

// Chamar a função para criar tabelas ao iniciar o servidor
initializeDatabase();

app.use(express.static(path.join(__dirname, '../../dist/dog-app')));
// Rota padrão para redirecionar para o frontend
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '../../dist/browser/index.html'));
});

/** ------------------------------------  */
// ------------ API'S ---------------------
/** ------------------------------------  */

// Rota para upload de arquivos
app.post('/upload', (req, res) => {
  upload.single('file')(req, res, async (err) => {
    if (err) return res.status(500).send("Erro no upload");
    if (!req.file) return res.status(400).send('Nenhuma imagem carregada.');
    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    try {
      await pool.query('INSERT INTO images (image, filename) VALUES ($1, $2)', [base64Image, req.file.originalname]);
      res.json({ success: true, message: 'Arquivo enviado e salvo como base64 com sucesso' });
    } catch (error) {
      res.status(500).send("Erro ao processar o arquivo");
    }
  });
});

// Obter imagens
app.get('/images', async (_req, res) => {
  try {
    const result = await pool.query('SELECT * FROM images');
    res.json(result.rows);
  } catch (error) {
    res.status(500).send("Erro ao ler o banco de dados");
  }
});

// CRUD para animais
app.get('/animals', async (_req, res) => {
  try {
    const result = await pool.query('SELECT * FROM animals');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao ler o banco de dados', error });
  }
});

app.get('/animals/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query('SELECT * FROM animals WHERE id = $1', [id]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Animal não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erro ao ler o banco de dados', error });
  }
});

app.post('/animals', async (req, res) => {
  const { name, race, image } = req.body;
  const id = uuidv4();
  try {
    await pool.query('INSERT INTO animals (id, name, race, image) VALUES ($1, $2, $3, $4)', [id, name, race, image]);
    res.status(201).json({ id, name, race, image });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar o animal', error });
  }
});

app.put('/animals/:id', async (req, res) => {
  const id = req.params.id;
  const { name, race, image } = req.body;
  try {
    await pool.query('UPDATE animals SET name = $1, race = $2, image = $3 WHERE id = $4', [name, race, image, id]);
    res.json({ message: 'Informações do animal atualizadas com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar o animal', error });
  }
});

app.delete('/animals/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await pool.query('DELETE FROM animals WHERE id = $1', [id]);
    res.json({ message: 'Animal deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar o animal', error });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
