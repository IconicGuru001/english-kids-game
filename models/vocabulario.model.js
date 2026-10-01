import { getDB } from '../config/db.config.js';
import { ObjectId } from 'mongodb';

export async function obtenerAleatorias(cantidad = 4) {
  const db = getDB();
  return await db.collection('vocabulario')
    .aggregate([{ $sample: { size: cantidad } }])
    .toArray();
}

export async function crearPalabra({ palabraEn, palabraEs, emoji, categoria }) {
  const db = getDB();
  const nueva = { palabraEn, palabraEs, emoji, categoria, fecha: new Date() };
  const result = await db.collection('vocabulario').insertOne(nueva);
  return { ...nueva, _id: result.insertedId };
}

export async function listarTodas() {
  const db = getDB();
  return await db.collection('vocabulario').find({}).toArray();
}

export async function borrarPalabra(id) {
  const db = getDB();
  await db.collection('vocabulario').deleteOne({ _id: new ObjectId(id) });
}
