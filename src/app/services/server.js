const express = require('express');
const multer = require('multer');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // Para gerar IDs únicos

const app = express();
const port = process.env.PORT || 3001;

// Configuração do Multer para armazenamento de arquivos em memória
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // Limite de 10MB
  }
});


app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true }));

// Path to the animal data file
const animalDataPath = path.join(__dirname, 'animalData.json');

// Função para converter buffer em base64
const bufferToBase64 = (buffer, mimetype) => {
  return `data:${mimetype};base64,${buffer.toString('base64')}`;
};

// Rota para upload de arquivos
app.post('/upload', (req, res) => {
  console.log("Início do upload");

  upload.single('file')(req, res, (err) => {
    if (err) {
      console.error("Erro no upload:", err);
      return res.status(500).send("Erro no upload");
    }

    console.log("Arquivo recebido:", req.file);

    if (!req.file) {
      console.log("Nenhum arquivo enviado");
      return res.status(400).send('No file uploaded.');
    }

    try {
      const base64Image = bufferToBase64(req.file.buffer, req.file.mimetype);

      // Salvar a imagem em um arquivo JSON
      const imageData = {
        image: base64Image,
        filename: req.file.originalname
      };

      fs.writeFileSync('imageData.json', JSON.stringify(imageData, null, 2));

      res.json({
        success: true,
        message: 'File uploaded and saved as base64 successfully',
        file: imageData
      });
    } catch (error) {
      console.error("Erro ao processar o arquivo:", error);
      res.status(500).send("Erro ao processar o arquivo");
    }
  });
});

// Obter imagens
app.get('/images', (req, res) => {
  console.log("Requisição para obter imagens");

  try {
    const imageData = fs.readFileSync('imageData.json', 'utf8');
    res.json(JSON.parse(imageData));
  } catch (error) {
    console.error("Erro ao ler o arquivo JSON:", error);
    res.status(500).send("Erro ao ler o arquivo JSON");
  }
});

// Função auxiliar para ler dados do arquivo JSON
function readData() {
  if (fs.existsSync(animalDataPath)) {
    const rawData = fs.readFileSync(animalDataPath, 'utf8');
    return JSON.parse(rawData);
  }
  return [];
}

// Função auxiliar para escrever dados no arquivo JSON
function writeData(data) {
  fs.writeFileSync(animalDataPath, JSON.stringify(data, null, 2));
}

// Obter todos os animais
app.get('/animals', (_req, res) => {
  try {
    const animals = readData();
    res.json(animals);
  } catch (error) {
    res.status(500).json({ message: 'Error reading data', error });
  }
});

// Obter um animal por ID
app.get('/animals/:id', (req, res) => {
  const id = req.params.id;
  try {
    const animals = readData();
    const animal = animals.find(a => a.id === id);
    if (animal) {
      res.json(animal);
    } else {
      res.status(404).json({ message: 'Animal not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error reading data', error });
  }
});

// Criar um novo animal
app.post('/animals', (req, res) => {
  const { name, race, image } = req.body;
  const newAnimal = {
    id: uuidv4(), // Gerar um ID único
    name,
    race,
    image
  };

  try {
    const animals = readData();
    animals.push(newAnimal);
    writeData(animals);
    res.status(201).json(newAnimal);
  } catch (error) {
    res.status(500).json({ message: 'Error creating animal', error });
  }
});

// Atualizar um animal por ID
app.put('/animals/:id', (req, res) => {
  const id = req.params.id;
  const updatedAnimal = req.body;
  try {
    const animals = readData();
    const index = animals.findIndex(a => a.id === id);
    if (index !== -1) {
      animals[index] = { ...animals[index], ...updatedAnimal };
      writeData(animals);
      res.json({ message: 'Animal updated successfully' });
    } else {
      res.status(404).json({ message: 'Animal not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating data', error });
  }
});

// Deletar um animal por ID
app.delete('/animals/:id', (req, res) => {
  const id = req.params.id;
  try {
    let animals = readData();
    animals = animals.filter(a => a.id !== id);
    writeData(animals);
    res.json({ message: 'Animal deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting data', error });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
