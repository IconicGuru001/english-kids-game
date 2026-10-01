import * as usuarioModel from '../models/usuario.model.js';

export async function registrar(req, res) {
  const { username, password, rol } = req.body;

  // Simple validation to keep data clean
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required! 🚫' });
  }

  try {
    // Default to student unless explicitly stated (protects from role injection)
    const nuevoRol = rol === 'profesor' ? 'profesor' : 'estudiante';
    const usuario = await usuarioModel.registrarUsuario({ 
      username: username.trim(), 
      password, 
      rol: nuevoRol 
    });

    // Automatically log the user in after registration
    req.session.userId = usuario._id;
    req.session.username = usuario.username;
    req.session.rol = usuario.rol;

    res.status(201).json({ 
      mensaje: '¡Registro exitoso! 🎉', 
      usuario: { username: usuario.username, rol: usuario.rol } 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function login(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Please enter both fields! ✏️' });
  }

  try {
    const usuario = await usuarioModel.verificarCredenciales(username.trim(), password);
    if (!usuario) {
      return res.status(401).json({ error: 'Invalid username or password 🥺' });
    }

    // Save info in session cookie store
    req.session.userId = usuario._id;
    req.session.username = usuario.username;
    req.session.rol = usuario.rol;

    res.json({ 
      mensaje: '¡Bienvenido de nuevo! 🚀', 
      usuario: { username: usuario.username, rol: usuario.rol } 
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error during login' });
  }
}

export function logout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Could not log out. Try again.' });
    }
    res.clearCookie('connect.sid'); // Clear browser session cookie
    res.json({ mensaje: '¡Sesión cerrada con éxito! Hasta luego 👋' });
  });
}
