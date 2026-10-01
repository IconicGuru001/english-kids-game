import { conectarDB, getDB } from './config/db.config.js';

const palabrasIniciales = [
  { palabraEn: "Apple", palabraEs: "Manzana", emoji: "🍎", categoria: "Comida" },
  { palabraEn: "Banana", palabraEs: "Plátano", emoji: "🍌", categoria: "Comida" },
  { palabraEn: "Dog", palabraEs: "Perro", emoji: "🐶", categoria: "Animales" },
  { palabraEn: "Cat", palabraEs: "Gato", emoji: "🐱", categoria: "Animales" },
  { palabraEn: "Sun", palabraEs: "Sol", emoji: "☀️", categoria: "Naturaleza" },
  { palabraEn: "Moon", palabraEs: "Luna", emoji: "🌙", categoria: "Naturaleza" },
  { palabraEn: "House", palabraEs: "Casa", emoji: "🏠", categoria: "Lugares" },
  { palabraEn: "Car", palabraEs: "Coche", emoji: "🚗", categoria: "Transporte" },
  { palabraEn: "Book", palabraEs: "Libro", emoji: "📚", categoria: "Objetos" },
  { palabraEn: "Star", palabraEs: "Estrella", emoji: "⭐", categoria: "Naturaleza" }
];

async function sembrar() {
  await conectarDB();
  const db = getDB();
  await db.collection('vocabulario').deleteMany({});
  await db.collection('vocabulario').insertMany(palabrasIniciales);
  console.log('¡Base de datos sembrada con 10 palabras iniciales con éxito! 🌱');
  process.exit(0);
}

sembrar();
