import * as vocabularioModel from '../models/vocabulario.model.js';

export async function listar(req, res) {
  try {
    const lista = await vocabularioModel.listarTodas();
    res.json(lista);
  } catch (error) {
    res.status(500).json({ error: 'Error al listar vocabulario' });
  }
}

export async function guardar(req, res) {
  const { palabraEn, palabraEs, emoji, categoria } = req.body;

  // Strict backend evaluation assertions matching instruction guidelines
  if (!palabraEn || !palabraEs || !emoji || !categoria) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    const nueva = await vocabularioModel.crearPalabra({ palabraEn, palabraEs, emoji, categoria });
    res.status(201).json(nueva);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la palabra' });
  }
}

export async function eliminar(req, res) {
  const { id } = req.params;
  try {
    await vocabularioModel.borrarPalabra(id);
    res.json({ mensaje: 'Palabra eliminada con éxito' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la palabra' });
  }
}
