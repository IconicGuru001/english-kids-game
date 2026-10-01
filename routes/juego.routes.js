import express from 'express';
import { getQuiz, guardarPuntos } from '../controllers/juego.controller.js';
import { getMemoryGame } from '../controllers/juego.controller.js';
import { requiereAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

// All game endpoints are protected by standard session check middleware
router.get('/quiz', requiereAuth, getQuiz);
router.get('/memoria', requiereAuth, getMemoryGame);
router.post('/puntos', requiereAuth, guardarPuntos);

export default router;
