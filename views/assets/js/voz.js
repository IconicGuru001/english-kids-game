// Verification guard checking browser baseline availability
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export class ServicioPronunciacion {
  constructor() {
    if (!SpeechRecognition) {
      this.disponible = false;
      console.warn("Speech recognition api not natively reachable inside this window configuration instance.");
      return;
    }
    this.reconocedor = new SpeechRecognition();
    this.reconocedor.lang = 'en-US'; // Hardcoded to target secondary dialect tracking
    this.reconocedor.interimResults = false;
    this.disponible = true;
  }

  escucharPalabra(palabraEsperada, elementoMensaje, callbackExito) {
    if (!this.disponible) {
      elementoMensaje.textContent = "🎙️ Tu navegador no soporta entrada de voz. Usa Chrome o Edge.";
      return;
    }

    elementoMensaje.textContent = '🎧 Te escucho... ¡Di la palabra en voz alta!';
    this.reconocedor.start();

    this.reconocedor.onresult = (event) => {
      const transcripcion = event.results[0][0].transcript.toLowerCase().trim();
      const matchLimpio = palabraEsperada.toLowerCase().trim();

      if (transcripcion === matchLimpio) {
        elementoMensaje.textContent = `¡Excelente! Pronunciaste "${transcripcion}" a la perfección. 🗣️🌟`;
        callbackExito(); // Grant rewards execution trigger hook loop
      } else {
        elementoMensaje.textContent = `Escuché "${transcripcion}". ¡Inténtalo otra vez! 💪`;
      }
    };

    this.reconocedor.onerror = (err) => {
      if(err.error === 'no-speech') {
        elementoMensaje.textContent = "No te oí bien. ¡Habla un poco más fuerte! 📢";
      } else {
        elementoMensaje.textContent = "Hubo un problema con el micrófono. 🛑";
      }
    };
  }
}
