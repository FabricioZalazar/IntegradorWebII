import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { generarPregunta } from './preguntas.js';
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/game', async (req, res) => {
  try {
    res.sendFile(path.join(__dirname, '/public/game.html'))
  } catch (err) {
    res.status(404).send(`<h1> error: Error 404 ${err} </h1>`);
  }
})

app.get('/api/pregunta', async (req, res) => {
  try {
    const pregunta = await generarPregunta();
    res.json(pregunta);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error al generar la pregunta' });
  }
});

app.post('/api/partida', async (req, res) => {
  const partida = req.body;
  try {
    const dataPath = path.join(__dirname, 'data', 'partidas.json');
    let partidas = [];
    try {
      const data = await fs.readFile(dataPath, 'utf-8');
      partidas = JSON.parse(data);
    } catch { }

    partidas.push(partida);
    await fs.writeFile(dataPath, JSON.stringify(partidas, null, 2));
    res.status(200).json({ message: 'Partida guardada' });
  } catch (err) {
    res.status(500).json({ error: 'No se pudo guardar la partida' });
  }
});

app.get('/api/ranking', async (req, res) => {
  try {
    const dataPath = path.join(__dirname, 'data', 'partidas.json');
    const contenido = await fs.readFile(dataPath, 'utf-8');
    const partidas = JSON.parse(contenido);

    const top20 = partidas
      .sort((a, b) => b.puntaje - a.puntaje)
      .slice(0, 20);

    res.json(top20);
  } catch (err) {
    res.status(500).json({ error: 'No se pudo leer el ranking' });
  }
});

app.listen(port, () => {
  console.log(`Servidor funcionando en el puerto ${port}`);
});