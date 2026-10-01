import * as vocabularioModel from '../models/vocabulario.model.js';
import { getDB } from '../config/db.config.js';
import { ObjectId } from 'mongodb';

// 1. 🕹️ GET QUIZ GAME DATA
export async function getQuiz(req, res) {
  try {
    const palabras = await vocabularioModel.obtenerAleatorias(4);
    if (palabras.length < 4) {
      return res.status(400).json({ error: 'No hay suficientes palabras en la BD' });
    }

    // Pick a truly random word from the four retrieved as the target answer
    const indiceCorrecto = Math.floor(Math.random() * palabras.length);
    const itemCorrecto = palabras[indiceCorrecto];

    const opciones = palabras.map(p => p.palabraEn);

    // Fisher-Yates shuffle algorithm for uniform random option buttons distribution
    for (let i = opciones.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [opciones[i], opciones[j]] = [opciones[j], opciones[i]];
    }

    res.json({ 
      emoji: itemCorrecto.emoji, 
      correcta: itemCorrecto.palabraEn, 
      opciones 
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener quiz' });
  }
}

// 2. 🧠 GET MEMORY GAME DATA
export async function getMemoryGame(req, res) {
  try {
    const palabras = await vocabularioModel.obtenerAleatorias(5);
    if (palabras.length < 5) {
      return res.status(400).json({ error: 'No hay suficientes palabras en la BD' });
    }

    const cartas = [];
    
    palabras.forEach((p, index) => {
      cartas.push({
        id: `${index}-en`,
        matchId: index,
        contenido: `${p.emoji} ${p.palabraEn}`,
        tipo: 'en'
      });
      cartas.push({
        id: `${index}-es`,
        matchId: index,
        contenido: p.palabraEs,
        tipo: 'es'
      });
    });

    for (let i = cartas.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cartas[i], cartas[j]] = [cartas[j], cartas[i]];
    }

    res.json({ cartas });
  } catch (error) {
    res.status(500).json({ error: 'Error al generar el tablero de memoria' });
  }
}

// 3. ⭐ SAVE STARS EARNED & UPDATE EVOLUTIVE PROFILE LEVELS
export async function guardarPuntos(req, res) {
  const { estrellas } = req.body;
  const userId = req.session.userId;
  if (!userId) return res.status(401).json({ error: 'No autorizado' });

  try {
    const db = getDB();
    await db.collection('usuarios').updateOne(
      { _id: new ObjectId(userId) },
      { $inc: { estrellas: estrellas } }
    );

    const usuarioActualizado = await db.collection('usuarios').findOne({ _id: new ObjectId(userId) });
    
    let nuevoNivel = 1;
    const pts = usuarioActualizado.estrellas;
    if (pts >= 50) nuevoNivel = 4;
    else if (pts >= 25) nuevoNivel = 3;
    else if (pts >= 10) nuevoNivel = 2;

    await db.collection('usuarios').updateOne(
      { _id: new ObjectId(userId) },
      { $set: { nivel: nuevoNivel } }
    );

    res.json({ totalEstrellas: pts, nivel: nuevoNivel });
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar el progreso.' });
  }
}

































/*import * as vocabularioModel from '../models/vocabulario.model.js';
import { getDB } from '../config/db.config.js';
import { ObjectId } from 'mongodb';

// 1. GET QUIZ GAME DATA
export async function getQuiz(req, res) {
  try {
    const palabras = await vocabularioModel.obtenerAleatorias(4);
    if (palabras.length < 4) {
      return res.status(400).json({ error: 'No hay suficientes palabras en la BD' });
    }

    // Pick a truly random word from the four retrieved as the target answer
    const indiceCorrecto = Math.floor(Math.random() * palabras.length);
    const itemCorrecto = palabras[indiceCorrecto];

    const opciones = palabras.map(p => p.palabraEn);

    // Fisher-Yates shuffle algorithm for uniform random option buttons distribution
    for (let i = opciones.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [opciones[i], opciones[j]] = [opciones[j], opciones[i]];
    }

    res.json({ 
      emoji: itemCorrecto.emoji, 
      correcta: itemCorrecto.palabraEn, 
      opciones 
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener quiz' });
  }
}

// 2.  GET MEMORY GAME DATA
export async function getMemoryGame(req, res) {
  try {
    const palabras = await vocabularioModel.obtenerAleatorias(5);
    if (palabras.length < 5) {
      return res.status(400).json({ error: 'No hay suficientes palabras en la BD' });
    }

    const cartas = [];
    
    palabras.forEach((p, index) => {
      cartas.push({
        id: `${index}-en`,
        matchId: index,
        contenido: `${p.emoji} ${p.palabraEn}`,
        tipo: 'en'
      });
      cartas.push({
        id: `${index}-es`,
        matchId: index,
        contenido: p.palabraEs,
        tipo: 'es'
      });
    });

    for (let i = cartas.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cartas[i], cartas[j]] = [cartas[j], cartas[i]];
    }

    res.json({ cartas });
  } catch (error) {
    res.status(500).json({ error: 'Error al generar el tablero de memoria' });
  }
}

// 3.  SAVE STARS EARNED & UPDATE EVOLUTIVE PROFILE LEVELS
export async function guardarPuntos(req, res) {
  const { estrellas } = req.body;
  const userId = req.session.userId;
  if (!userId) return res.status(401).json({ error: 'No autorizado' });

  try {
    const db = getDB();
    await db.collection('usuarios').updateOne(
      { _id: new ObjectId(userId) },
      { $inc: { estrellas: estrellas } }
    );

    const usuarioActualizado = await db.collection('usuarios').findOne({ _id: new ObjectId(userId) });
    
    let nuevoNivel = 1;
    const pts = usuarioActualizado.estrellas;
    if (pts >= 50) nuevoNivel = 4;
    else if (pts >= 25) nuevoNivel = 3;
    else if (pts >= 10) nuevoNivel = 2;

    await db.collection('usuarios').updateOne(
      { _id: new ObjectId(userId) },
      { $set: { nivel: nuevoNivel } }
    );

    res.json({ totalEstrellas: pts, nivel: nuevoNivel });
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar el progreso.' });
  }
}
*/











/*import * as vocabularioModel from '../models/vocabulario.model.js';
import { getDB } from '../config/db.config.js';
import { ObjectId } from 'mongodb';


export async function getQuiz(req, res) {
  try {
    const palabras = await vocabularioModel.obtenerAleatorias(4);
    if (palabras.length < 4) {
      return res.status(400).json({ error: 'No hay suficientes palabras en la BD' });
    }

    // 1. Pick a truly random word from the four retrieved as the target answer
    const indiceCorrecto = Math.floor(Math.random() * palabras.length);
    const itemCorrecto = palabras[indiceCorrecto];

    // 2. Map options
    const opciones = palabras.map(p => p.palabraEn);

    // 3. Professional Fisher-Yates shuffle algorithm (unbiased distribution)
    for (let i = opciones.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [opciones[i], opciones[j]] = [opciones[j], opciones[i]];
    }

    res.json({ 
      emoji: itemCorrecto.emoji, 
      correcta: itemCorrecto.palabraEn, 
      opciones 
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener quiz' });
  }
} */




/*
export async function getQuiz(req, res) {
  try {
    const palabras = await vocabularioModel.obtenerAleatorias(4);
    if (palabras.length < 4) {
      return res.status(400).json({ error: 'Faltan palabras en la BD para armar el juego.' });
    }
    const correcta = palabras[0];
    // Barajar opciones aleatoriamente para cumplir las directrices de UX
    const opciones = palabras.map(p => p.palabraEn).sort(() => Math.random() - 0.5);
    
    res.json({ emoji: correcta.emoji, correcta: correcta.palabraEn, opciones });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el quiz.' });
  }
} */


/*
export async function guardarPuntos(req, res) {
  const { estrellas } = req.body;
  const userId = req.session.userId;
  if (!userId) return res.status(401).json({ error: 'No autorizado' });

  try {
    const db = getDB();
    // Sumar estrellas de forma incremental
    await db.collection('usuarios').updateOne(
      { _id: new ObjectId(userId) },
      { $inc: { estrellas: estrellas } }
    );

    const usuarioActualizado = await db.collection('usuarios').findOne({ _id: new ObjectId(userId) });
    
    // Sistema lógico de niveles basado en rangos establecidos
    let nuevoNivel = 1;
    const pts = usuarioActualizado.estrellas;
    if (pts >= 50) nuevoNivel = 4;
    else if (pts >= 25) nuevoNivel = 3;
    else if (pts >= 10) nuevoNivel = 2;

    await db.collection('usuarios').updateOne(
      { _id: new ObjectId(userId) },
      { $set: { nivel: nuevoNivel } }
    );

    res.json({ totalEstrellas: pts, nivel: nuevoNivel });
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar el progreso.' });
  }
} */





//Added for Page 3: Memory Game
/*import * as vocabularioModel from '../models/vocabulario.model.js';

export async function getMemoryGame(req, res) {
  try {
    // Page 3 dictates a board of 8-12 cards. Let's pull 5 random words (resulting in 10 cards)
    const palabras = await vocabularioModel.obtenerAleatorias(5);
    if (palabras.length < 5) {
      return res.status(400).json({ error: 'No hay suficientes palabras en la BD' });
    }

    const cartas = [];
    
    // Deconstruct each word into 2 matched elements (English token and Spanish token)
    palabras.forEach((p, index) => {
      cartas.push({
        id: `${index}-en`,
        matchId: index,
        contenido: `${p.emoji} ${p.palabraEn}`,
        tipo: 'en'
      });
      cartas.push({
        id: `${index}-es`,
        matchId: index,
        contenido: p.palabraEs,
        tipo: 'es'
      });
    });

    // Professional Fisher-Yates shuffle algorithm to mix the cards grid uniformly
    for (let i = cartas.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cartas[i], cartas[j]] = [cartas[j], cartas[i]];
    }

    res.json({ cartas });
  } catch (error) {
    res.status(500).json({ error: 'Error al generar el tablero de memoria' });
  }
} */

