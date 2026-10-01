import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const client = new MongoClient(process.env.MONGO_URI);
let db;

export async function conectarDB() {
  try {
    await client.connect();
    db = client.db();
    console.log('¡Conexión exitosa a MongoDB! 🎮');
  } catch (error) {
    console.error('Error conectando a la base de datos:', error);
    process.exit(1);
  }
}

export function getDB() {
  if (!db) throw new Error('Base de datos no inicializada. Llama primero a conectarDB().');
  return db;
}
