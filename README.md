# 🎮 English Kids Game — Juego Interactivo para Aprender Inglés

¡Bienvenido al proyecto final! Esta es una plataforma web educativa interactiva y divertida diseñada para niños de **6 a 12 años**, construida siguiendo un patrón de arquitectura estricto **MVC (Modelo-Vista-Controlador)**.

---

## 🚀 Características Principales (MVP)
* **Registro/Login Infantil:** Autenticación amigable sin correo electrónico para proteger la privacidad.
* **Mini-Juego 1 (Quiz de Vocabulario):** Preguntas con emojis y barajado aleatorio para evitar patrones repetitivos.
* **Mini-Juego 2 (Memoria / Matching):** Tablero dinámico interactivo para emparejar palabras y traducciones.
* **Sistema de Niveles Evolutivo:** Puntuación en vivo basada en estrellas acumuladas:
  * 0-9 🌟 → Nivel 1 (Principiante)
  * 10-24 🌟 → Nivel 2 (Explorador)
  * 25-49 🌟 → Nivel 3 (Aventurero)
  * 50+ 🌟 → Nivel 4 (Maestro del Inglés)
* **Salón de la Fama:** Top 10 de estudiantes con mayor cantidad de estrellas acumuladas.
* **Panel de Administrador (CRUD):** Firewall exclusivo para profesores para añadir, listar y eliminar vocabulario.

### 🧠 Ampliación IA Integrada
* **Reconocimiento de Voz Nativo (Web Speech API):** Un botón interactivo que evalúa en tiempo real la pronunciación del inglés del niño por micrófono, otorgando una bonificación de +2 estrellas por acierto. ¡100% gratis y sin claves API externas!

---

## 🛠️ Stack Tecnológico Utilizado
* **Frontend:** HTML5, CSS3 Nativo (fuentes fluidas, transiciones de 0.3s y botones >60px adaptados para niños), JavaScript (ES6+ Vanilla).
* **Backend:** Node.js con Express.js.
* **Módulos:** ES Modules (`import`/`export`).
* **Base de Datos:** Driver Nativo de MongoDB (`mongodb`). *Sin ORMs/Mongoose.*
* **Autenticación y Sesiones:** `bcrypt` + `express-session` serializadas mediante `connect-mongo`.

---

## 📦 Instalación y Configuración Paso a Paso

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com
   cd english-kids-game
   ```

2. **Instalar dependencias necesarias:**
   ```bash
   npm install
   ```

3. **Configurar el entorno:**
   Crea un archivo llamado `.env` en la raíz del proyecto y añade tus credenciales:
   ```env
   MONGO_URI=tu_cadena_de_conexion_de_mongodb_atlas
   SESSION_SECRET=un_secreto_largo_y_seguro_para_ninos
   PORT=3000
   ```

4. **Sembrar el vocabulario inicial (Seed Script):**
   Rellena tu base de datos automáticamente con las 10 palabras de prueba iniciales:
   ```bash
   node seed.js
   ```

5. **Iniciar el servidor en modo desarrollo:**
   ```bash
   npm run dev
   ```
   Abre tu navegador e ingresa a: **`http://localhost:3000`**

---

## 🏛️ Estructura del Patrón MVC
El proyecto mantiene una separación limpia de responsabilidades:
* `config/`: Archivo de inicialización de la conexión de la base de datos (Singleton).
* `models/`: Interacción directa con las colecciones nativas de MongoDB.
* `controllers/`: Lógica de control, validaciones de backend y formateo de datos JSON.
* `routes/`: Enrutamiento semántico REST de las peticiones HTTP de la API.
* `middleware/`: Firewalls de sesión (`requiereAuth`, `requiereAdmin`).
* `views/`: Vistas estáticas nativas consumidas por el cliente frontend.
