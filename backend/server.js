const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const SquidCloud = require('squid-cloud'); // Importa a biblioteca Squid Cloud

const app = express();
const port = process.env.PORT || 3001;

// Configuração do Multer para armazenamento de arquivos em memória
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true }));

// Configuração do Squid Cloud
const squidCloud = new SquidCloud({
  apiKey: process.env.SQUID_API_KEY, // Substitua pelo seu API Key do Squid Cloud
  apiUrl: process.env.SQUID_API_URL // Substitua pela URL da API do Squid Cloud
});

// Funções para interagir com o Squid Cloud
const animalCollection = squidCloud.collection('animals');
const imageCollection = squidCloud.collection('images');

// Middleware para servir arquivos estáticos
const publicPath = path.join(__dirname, '../../dist/dog-app');
app.use(express.static(publicPath));

// Rota padrão para redirecionar para o frontend
app.get('*', (_req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
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
      await imageCollection.insert({
        image: base64Image,
        filename: req.file.originalname
      });
      res.json({ success: true, message: 'Arquivo enviado e salvo como base64 com sucesso' });
    } catch (error) {
      res.status(500).send("Erro ao processar o arquivo");
    }
  });
});

// Obter imagens
app.get('/images', async (_req, res) => {
  try {
    const images = await imageCollection.find().toArray();
    res.json(images);
  } catch (error) {
    res.status(500).send("Erro ao ler o banco de dados");
  }
});

// CRUD para animais
app.get('/animals', async (_req, res) => {
  try {
    const animals = await animalCollection.find().toArray();
    res.json(animals);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao ler o banco de dados', error });
  }
});

app.get('/animals/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const animal = await animalCollection.findOne({ id });
    if (animal) {
      res.json(animal);
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
    const newAnimal = {
      id,
      name,
      race,
      image
    };
    await animalCollection.insert(newAnimal);
    res.status(201).json(newAnimal);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar o animal', error });
  }
});

app.put('/animals/:id', async (req, res) => {
  const id = req.params.id;
  const { name, race, image } = req.body;
  try {
    const updatedAnimal = await animalCollection.findOneAndUpdate(
      { id },
      { $set: { name, race, image } },
      { returnOriginal: false }
    );
    if (updatedAnimal.value) {
      res.json({ message: 'Informações do animal atualizadas com sucesso', result: updatedAnimal.value });
    } else {
      res.status(404).json({ message: 'Animal não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar o animal', error });
  }
});

app.delete('/animals/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const result = await animalCollection.findOneAndDelete({ id });
    if (result.value) {
      res.json({ message: 'Animal deletado com sucesso' });
    } else {
      res.status(404).json({ message: 'Animal não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar o animal', error });
  }
});

// Teste de pastas
app.get('/files', (_req, res) => {
  fs.readdir(publicPath, (err, files) => {
    if (err) return res.status(500).send('Erro ao listar arquivos');
    res.send(files);
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
