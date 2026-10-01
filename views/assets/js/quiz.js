let respuestaCorrecta = "";
let bloqueandoClicks = false;

async function cargarPregunta() {
  try {
    bloqueandoClicks = false;
    document.getElementById('mensaje').textContent = '';
    
    const response = await fetch('/api/juego/quiz');
    const data = await response.json();
    
    if (data.error) {
      document.getElementById('emoji').textContent = '⚠️';
      document.getElementById('mensaje').textContent = '¡Añade palabras en el panel de profesor!';
      return;
    }

    document.getElementById('emoji').textContent = data.emoji;
    respuestaCorrecta = data.correcta;
    
    const opcionesDiv = document.getElementById('opciones');
    opcionesDiv.innerHTML = '';
    
    data.opciones.forEach(opcion => {
      const btn = document.createElement('button');
      btn.textContent = opcion;
      btn.classList.add('btn-opcion');
      btn.addEventListener('click', () => comprobarRespuesta(opcion, btn));
      opcionesDiv.appendChild(btn);
    });
  } catch (err) {
    console.error('Error cargando la pregunta:', err);
  }
}

async function comprobarRespuesta(seleccion, botonClickeado) {
  if (bloqueandoClicks) return;
  bloqueandoClicks = true;

  if (seleccion === respuestaCorrecta) {
    botonClickeado.classList.add('correcta');
    document.getElementById('mensaje').textContent = '¡Muy bien! 🌟 ¡Eres un crack!';
    
    // Save points to backend (+1 star per correct answer, as per specification)
    await enviarPuntos(1);
    
    setTimeout(cargarPregunta, 1500);
  } else {
    botonClickeado.classList.add('incorrecta');
    document.getElementById('mensaje').textContent = '¡Inténtalo de nuevo! 🤗';
    // No points deducted, ensuring a friendly user experience for kids
    setTimeout(() => {
      botonClickeado.classList.remove('incorrecta');
      bloqueandoClicks = false;
    }, 1200);
  }
}

async function enviarPuntos(cantidad) {
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
    console.error('Error al guardar puntos:', err);
  }
}

document.addEventListener('DOMContentLoaded', cargarPregunta);





//Adding voice recognition functionality for pronunciation practice
import { ServicioPronunciacion } from './voz.js';
const vozAI = new ServicioPronunciacion();

document.getElementById('btn-mic').addEventListener('click', () => {
  vozAI.escucharPalabra(respuestaCorrecta, document.getElementById('mensaje'), () => {
    enviarPuntos(2); // Grants a +2 star bonus for a successful voice match
  });
});
