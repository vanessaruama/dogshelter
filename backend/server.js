import express from 'express';
import pkg from 'pg';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url'; // Necessário para usar `path` em ESM
import { v4 as uuidv4 } from 'uuid';

const { Pool } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false // Isso pode ser necessário dependendo do provedor de dados
  }
});

// Configuração do Multer para armazenamento de arquivos em memória
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true }));

// Função para criar tabelas no banco caso não existam
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

//--------------------------------------------//
//------- API's ------------------------------//
//--------------------------------------------//

//------------------------------------------------------//
//---- GET | Retorna a lista de registros cadastrados---//
//------------------------------------------------------//
app.get('/animals', async (_req, res) => {
  try {
    const result = await pool.query('SELECT * FROM animals');
    console.log(result.rows, "linhas")
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao ler o banco de dados', error });
  }
});

//---------------------------------------------------------------//
//---- GET | Retorna o registro cadastrado de acordo com o ID ---//
//---------------------------------------------------------------//
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

//----------------------------------------------//
//---- POST | Realiza um novo cadastro ---------//
//----------------------------------------------//
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

//------------------------------------------------------------------------------//
//---- PUT | Realiza uma alteração no cadastro de acordo com o ID enviado ------//
//------------------------------------------------------------------------------//
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

//------------------------------------------------------------------//
//---- DELETE | Deleta um registro de acordo com o ID enviado ------//
//------------------------------------------------------------------//
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

//--------------------------------------------//
//------- Frontend ---------------------------//
//--------------------------------------------//
const publicPath = path.join(__dirname, 'dist/dog-app');
console.error(__dirname)
// Middleware para servir arquivos estáticos
app.use(express.static(publicPath));

// Rota padrão para redirecionar para o frontend
app.get('*', (_req, res) => {
  res.sendFile(path.join("/opt/render/project/src/dist/dog-app", 'index.html'));
});
