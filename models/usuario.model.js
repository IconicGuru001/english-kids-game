import { getDB } from '../config/db.config.js';
import bcrypt from 'bcrypt';

export async function registrarUsuario({ username, password, rol = 'estudiante' }) {
  const db = getDB();
  const existe = await db.collection('usuarios').findOne({ username });
  if (existe) throw new Error('El usuario ya existe');

  const passwordHash = await bcrypt.hash(password, 10);
  const nuevoUsuario = {
    username,
    password: passwordHash,
    rol,
    estrellas: 0,
    nivel: 1,
    fechaRegistro: new Date()
  };

  const result = await db.collection('usuarios').insertOne(nuevoUsuario);
  return { _id: result.insertedId, username, rol };
}

export async function verificarCredenciales(username, password) {
  const db = getDB();
  const usuario = await db.collection('usuarios').findOne({ username });
  if (!usuario) return null;

  const coinciden = await bcrypt.compare(password, usuario.password);
  return coinciden ? usuario : null;
}
