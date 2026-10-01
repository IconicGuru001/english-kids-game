async function cargarPerfil() {
  try {
    // We check the user session attributes by hitting a profile status endpoint
    const response = await fetch('/api/juego/perfil-estado');
    
    if (response.status === 401) {
      window.location.href = 'index.html'; // Kick out unauthenticated users
      return;
    }
    
    const usuario = await response.json();
    
    document.getElementById('username-display').textContent = usuario.username;
    document.getElementById('estrellas-total').textContent = usuario.estrellas;
    
    // Assign descriptive child-friendly titles matching the layout instructions page 3
    let nombreNivel = "Principiante 🍼";
    if (usuario.nivel === 2) nombreNivel = "Explorador 🧭";
    if (usuario.nivel === 3) nombreNivel = "Aventurero 🗺️";
    if (usuario.nivel === 4) nombreNivel = "Maestro del Inglés 👑";
    
    document.getElementById('nivel-texto').textContent = `Nivel ${usuario.nivel}: ${nombreNivel}`;

    // If role parameter evaluates to teacher, expose the management route block item
    if (usuario.rol === 'profesor') {
      document.getElementById('btn-admin-panel').style.display = 'inline-flex';
    }
  } catch (err) {
    console.error('Error matching active user profiling matrix:', err);
  }
}

// Global script tracking handle execution for Session Logout
document.getElementById('btn-cerrar-sesion').addEventListener('click', async () => {
  if (confirm('¿Quieres cerrar sesión, campeón?')) {
    const res = await fetch('/api/auth/logout', { method: 'POST' });
    const data = await res.json();
    alert(data.mensaje);
    window.location.href = 'index.html'; // Return back to welcome gate layout
  }
});

document.addEventListener('DOMContentLoaded', cargarPerfil);
