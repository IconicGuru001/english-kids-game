import express from 'express';
import { listar, guardar, eliminar } from '../controllers/admin.controller.js';
import { requiereAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Secure layout - only authorized teachers can interact with these endpoints
router.get('/vocabulario', requiereAdmin, listar);
router.post('/vocabulario', requiereAdmin, guardar);
router.delete('/vocabulario/:id', requiereAdmin, eliminar);

export default router;
