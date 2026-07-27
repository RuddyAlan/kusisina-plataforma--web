# 🌱 Kusisiña — Familias que juegan, familias que crecen

**Kusisiña** es una plataforma web boliviana de **co-playing** y **crianza positiva**, pensada para
prevenir la violencia hacia niñas, niños y adolescentes en familias de **La Paz y El Alto**. Es un
proyecto de impacto social sin fines de lucro, con contenido **bilingüe español / aymara**.

> *"Bolivia sin golpes ni gritos empieza en cada hogar."*

## 🔗 Demo en vivo

👉 **[Ver la plataforma en funcionamiento](#)** *(el enlace se actualiza automáticamente en la sección "About" del repositorio y aquí una vez publicado con GitHub Pages — ver más abajo)*

## ✨ ¿Qué incluye la plataforma?

- **Landing page** con la propuesta de valor del proyecto y la metodología de co-playing.
- **Registro e inicio de sesión familiar** (una cuenta por familia, con perfiles para cada niña/niño),
  accesible desde cualquier dispositivo.
- **6 actividades guiadas de co-playing** (conversación en pareja adulto–niño/a), incluyendo la
  **Rueda de Emociones** interactiva.
- **Arcade Kusisiña**: 10 minijuegos educativos (memorama, trivia, historia interactiva, verdadero/falso,
  ruleta de desafíos, y más), con desbloqueo progresivo por nivel.
- **Tablero familiar** con nivel, XP, monedas, racha de días jugados, insignias y gráfico de progreso.
- **Panel de facilitador/a comunitario/a** con KPIs agregados de *todas* las familias registradas
  (sin importar el dispositivo), gráficos y exportación a CSV.
- **Selector de idioma español / aymara** en toda la interfaz.

## 🧱 Stack técnico

Frontend **100% estático** (sin servidor propio que mantener) con base de datos administrada en la nube:

| Capa | Tecnología |
|---|---|
| Estructura y estilos | HTML5, CSS3 propio (`css/style.css`), Bootstrap 5, Bootstrap Icons |
| Lógica | JavaScript ES6+ (sin framework ni build step), async/await |
| Base de datos | [Turso](https://turso.tech) (libSQL / SQLite distribuido), accedida vía su API HTTP (`fetch`, sin librerías) |
| UI/UX | SweetAlert2 (diálogos), Chart.js (gráficos), canvas-confetti (celebraciones) |

El sitio se sigue alojando en **cualquier hosting estático** — incluido GitHub Pages, gratis y sin
configuración adicional — porque toda la lógica corre en el navegador; Turso es un servicio administrado,
no un backend que el proyecto tenga que operar.

> Anteriormente la base de datos era [sql.js](https://github.com/sql-js/sql.js) (SQLite-WASM) persistida en
> `localStorage`, lo que aislaba los datos por navegador/dispositivo. Se migró a Turso para que todas las
> familias puedan acceder a su cuenta desde cualquier dispositivo con el mismo código y contraseña.

## 📂 Estructura del proyecto

```
kusisina-plataforma/
├── index.html              # Landing page
├── login.html               # Ingreso de familia
├── registro.html             # Alta de familia
├── dashboard.html            # Tablero familiar ("Mi familia")
├── actividades.html           # Actividades de co-playing
├── juegos.html                 # Arcade (10 minijuegos)
├── juego-emociones.html         # Rueda de Emociones
├── educacion.html                # Contenido de crianza positiva
├── facilitador.html               # Panel comunitario agregado
├── css/style.css                   # Sistema de diseño
├── js/                               # Lógica de la plataforma
│   ├── config.js           (credenciales de conexión a Turso — ver abajo)
│   ├── i18n.js              (diccionario ES/AY)
│   ├── db.js                 (cliente HTTP hacia Turso/libSQL)
│   ├── gamification.js         (niveles, XP, logros)
│   ├── main.js                   (sesión, utilidades)
│   ├── actividades.js
│   ├── dashboard.js
│   ├── facilitador.js
│   ├── juego-emociones.js
│   ├── juegos-engine.js
│   ├── juegos-data.js
│   └── juegos-minijuegos.js
├── schema.sql                        # Esquema inicial de la base en Turso
└── .github/workflows/deploy-pages.yml   # Despliegue automático a GitHub Pages
```

## 🗄️ Configurar la base de datos (Turso)

1. Crea una cuenta gratis en [turso.tech](https://turso.tech) y una base de datos:
   ```bash
   turso db create kusisina
   turso db shell kusisina < schema.sql
   ```
2. Obtén la URL y un token de acceso:
   ```bash
   turso db show kusisina --url
   turso db tokens create kusisina
   ```
3. Completa `js/config.js` con ambos valores:
   ```js
   const KUSI_CONFIG = {
     tursoUrl: "libsql://tu-base.turso.io",
     tursoToken: "tu-token-aqui"
   };
   ```

## 💻 Cómo ejecutarlo en local

No requiere instalación de dependencias ni build. Basta con servir la carpeta como sitio estático
(el navegador necesita un servidor HTTP, no `file://`, para que las peticiones `fetch` funcionen
correctamente):

```bash
# Opción 1: Python (ya viene instalado en la mayoría de sistemas)
python3 -m http.server 8000

# Opción 2: Node.js
npx serve .

# Opción 3: extensión "Live Server" de VS Code
```

Luego abre `http://localhost:8000` en tu navegador. Necesitas tener `js/config.js` configurado (paso
anterior) para que el login y el registro funcionen.

## 🚀 Cómo se despliega (GitHub Pages)

Este repositorio ya incluye un workflow de GitHub Actions (`.github/workflows/deploy-pages.yml`) que
publica automáticamente el sitio en **GitHub Pages** cada vez que se hace `push` a la rama `main`.

Para activarlo (solo la primera vez):
1. Ve a **Settings → Pages** en este repositorio.
2. En **Source**, selecciona **GitHub Actions**.
3. Listo — cada `push` a `main` volverá a desplegar el sitio automáticamente.

## 🔐 Notas sobre datos y seguridad

- Todas las familias comparten una única base de datos central en Turso, así que el progreso **sí se
  sincroniza** entre dispositivos: una familia puede iniciar sesión con su código y contraseña desde
  cualquier computadora o celular.
- Las contraseñas nunca se guardan en texto plano (hash SHA-256 + sal aleatoria vía Web Crypto API).
- **El token de Turso en `js/config.js` queda visible en el código fuente público del sitio**, porque
  GitHub Pages es 100% estático y no hay forma de ocultar secretos en el navegador sin un backend o proxy
  intermedio. Si en algún momento se detecta actividad indebida en la base de datos, se puede revocar el
  token y generar uno nuevo (`turso db tokens create kusisina`) sin afectar los datos existentes.
- El panel de facilitador/a usa un PIN de acceso simple, pensado únicamente como barrera básica para
  talleres presenciales — **no es autenticación segura para producción**.

## 📞 Líneas de ayuda (Bolivia)

- Línea 156 — violencia hacia la niñez (La Paz)
- Familia Segura: 800 11 30 40
- FELCV (violencia hacia la mujer): 800 10 41 00

## 📄 Licencia

Proyecto de impacto social sin fines de lucro. Consulta el archivo `LICENSE` para más detalles.
