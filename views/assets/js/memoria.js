let primerasCartas = null;
let segundasCartas = null;
let bloqueandoTablero = false;
let intentos = 0;
let parejasEncontradas = 0;
const totalParejasEsperadas = 5;

async function iniciarTablero() {
  const respuesta = await fetch('/api/juego/memoria');
  const datos = await respuesta.json();
  
  const tablero = document.getElementById('tablero-memoria');
  tablero.innerHTML = '';
  
  datos.cartas.forEach(carta => {
    const div = document.createElement('div');
    div.classList.add('carta-memoria');
    div.dataset.matchId = carta.matchId;
    div.dataset.id = carta.id;
    div.textContent = '❓'; // Hidden text state
    
    div.addEventListener('click', () => voltearCarta(div, carta.contenido));
    tablero.appendChild(div);
  });
}

function voltearCarta(cardElement, contenido) {
  if (bloqueandoTablero || cardElement === primerasCartas || cardElement.classList.contains('emparejada')) return;

  cardElement.classList.add('volteada');
  cardElement.textContent = contenido;

  if (!primerasCartas) {
    primerasCartas = cardElement;
    return;
  }

  segundasCartas = cardElement;
  evaluarCoincidencia();
}

function evaluarCoincidencia() {
  intentos++;
  document.getElementById('intentos-count').textContent = intentos;
  
  const esCorrecto = primerasCartas.dataset.matchId === segundasCartas.dataset.matchId;
  esCorrecto ? registrarAcierto() : desvoltearCartas();
}

function registrarAcierto() {
  primerasCartas.classList.add('emparejada');
  segundasCartas.classList.add('emparejada');
  
  parejasEncontradas++;
  mostrarMensajeFeedback('¡Excelente! 🌟');
  guardarEstrellasBackend(2); // +2 Stars per correct match

  resetearSeleccion();

  if (parejasEncontradas === totalParejasEsperadas) {
    mostrarMensajeFeedback('¡Ganaste el juego! Eres un crack de los idiomas! 🏆');
  }
}

function desvoltearCartas() {
  bloqueandoTablero = true;
  mostrarMensajeFeedback('¡Inténtalo de nuevo! 🤗');

  setTimeout(() => {
    primerasCartas.classList.remove('volteada');
    segundasCartas.classList.remove('volteada');
    primerasCartas.textContent = '❓';
    segundasCartas.textContent = '❓';
    
    resetearSeleccion();
  }, 1200);
}

function resetearSeleccion() {
  [primerasCartas, segundasCartas] = [null, null];
  bloqueandoTablero = false;
}

function mostrarMensajeFeedback(msg) {
  document.getElementById('mensaje-feedback').textContent = msg;
}

async function guardarEstrellasBackend(cantidad) {
  try {
    const response = await fetch('/api/juego/puntos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estrellas: cantidad })
    });
    const data = await response.json();
    if (data.totalEstrellas !== undefined) {
      document.getElementById('estrellas-count').textContent = data.totalEstrellas;
    }
  } catch (err) {
    console.error('Error sincronizando puntos:', err);
  }
}

document.addEventListener('DOMContentLoaded', iniciarTablero);
