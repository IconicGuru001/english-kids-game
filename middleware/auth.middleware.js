// Verification middleware to confirm a user is logged in
export function requiereAuth(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: 'Debes iniciar sesión para jugar 🔒' });
  }
  next();
}

// Strict verification middleware to confirm teacher access rights
export function requiereAdmin(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: 'Debes iniciar sesión 🔒' });
  }
  
  if (req.session.rol !== 'profesor') {
    return res.status(403).json({ error: 'Acceso denegado: Solo para profesores ⛔' });
  }
  
  next();
}
