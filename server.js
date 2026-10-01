import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { conectarDB } from './config/db.config.js';
import { getQuiz, guardarPuntos } from './controllers/juego.controller.js';

dotenv.config();
const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Conectar Base de Datos
await conectarDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos de la Vista (Frontend nativo)
app.use(express.static(path.join(__dirname, 'views')));

// Sesiones persistidas en MongoDB nativo sin dependencias externas
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret-infantil',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 día
}));

// Endpoints del API del Juego
app.get('/api/juego/quiz', getQuiz);
app.post('/api/juego/puntos', guardarPuntos);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}  🧸`));







// Add these imports to your server.js
import authRoutes from './routes/auth.routes.js';
import juegoRoutes from './routes/juego.routes.js';
import adminRoutes from './routes/admin.routes.js';

// ... base configurations ...

// Register router hubs paths below your session config lines
app.use('/api/auth', authRoutes);
app.use('/api/juego', juegoRoutes);
app.use('/api/admin', adminRoutes);
