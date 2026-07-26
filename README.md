# 🌱 Kusisiña — Familias que juegan, familias que crecen

**Kusisiña** es una plataforma web boliviana de **co-playing** y **crianza positiva**, pensada para
prevenir la violencia hacia niñas, niños y adolescentes en familias de **La Paz y El Alto**. Es un
proyecto de impacto social sin fines de lucro, con contenido **bilingüe español / aymara**.

> *"Bolivia sin golpes ni gritos empieza en cada hogar."*

## 🔗 Demo en vivo

👉 **[Ver la plataforma en funcionamiento](#)** *(el enlace se actualiza automáticamente en la sección "About" del repositorio y aquí una vez publicado con GitHub Pages — ver más abajo)*

## ✨ ¿Qué incluye la plataforma?

- **Landing page** con la propuesta de valor del proyecto y la metodología de co-playing.
- **Registro e inicio de sesión familiar** (una cuenta por familia, con perfiles para cada niña/niño).
- **6 actividades guiadas de co-playing** (conversación en pareja adulto–niño/a), incluyendo la
  **Rueda de Emociones** interactiva.
- **Arcade Kusisiña**: 10 minijuegos educativos (memorama, trivia, historia interactiva, verdadero/falso,
  ruleta de desafíos, y más), con desbloqueo progresivo por nivel.
- **Tablero familiar** con nivel, XP, monedas, racha de días jugados, insignias y gráfico de progreso.
- **Panel de facilitador/a comunitario/a** con KPIs agregados, gráficos y exportación a CSV — pensado para
  talleres presenciales.
- **Selector de idioma español / aymara** en toda la interfaz.

## 🧱 Stack técnico

Aplicación **100% del lado del cliente** (sin backend ni servidor propio):

| Capa | Tecnología |
|---|---|
| Estructura y estilos | HTML5, CSS3 propio (`css/style.css`), Bootstrap 5, Bootstrap Icons |
| Lógica | JavaScript ES6+ (sin framework ni build step) |
| Base de datos | [sql.js](https://github.com/sql-js/sql.js) (SQLite compilado a WebAssembly), persistida en `localStorage` |
| UI/UX | SweetAlert2 (diálogos), Chart.js (gráficos), canvas-confetti (celebraciones) |

Al no requerir backend, el sitio puede alojarse en **cualquier hosting estático** — incluido GitHub Pages,
gratis y sin configuración adicional.

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
│   ├── i18n.js            (diccionario ES/AY)
│   ├── db.js               (motor SQLite/WASM)
│   ├── gamification.js       (niveles, XP, logros)
│   ├── main.js                 (sesión, utilidades)
│   ├── actividades.js
│   ├── dashboard.js
│   ├── facilitador.js
│   ├── juego-emociones.js
│   ├── juegos-engine.js
│   ├── juegos-data.js
│   └── juegos-minijuegos.js
└── .github/workflows/deploy-pages.yml   # Despliegue automático a GitHub Pages
```

## 💻 Cómo ejecutarlo en local

No requiere instalación de dependencias ni build. Basta con servir la carpeta como sitio estático,
porque el navegador necesita un servidor HTTP (no `file://`) para que `sql.js` (WebAssembly) funcione
correctamente:

```bash
# Opción 1: Python (ya viene instalado en la mayoría de sistemas)
python3 -m http.server 8000

# Opción 2: Node.js
npx serve .

# Opción 3: extensión "Live Server" de VS Code
```

Luego abre `http://localhost:8000` en tu navegador.

## 🚀 Cómo se despliega (GitHub Pages)

Este repositorio ya incluye un workflow de GitHub Actions (`.github/workflows/deploy-pages.yml`) que
publica automáticamente el sitio en **GitHub Pages** cada vez que se hace `push` a la rama `main`.

Para activarlo (solo la primera vez):
1. Ve a **Settings → Pages** en este repositorio.
2. En **Source**, selecciona **GitHub Actions**.
3. Listo — cada `push` a `main` volverá a desplegar el sitio automáticamente.

## 🔐 Notas sobre datos y seguridad

- No hay servidor ni base de datos central: cada familia se guarda **en el navegador de su propio
  dispositivo** (`localStorage`), por lo que el progreso no se sincroniza entre dispositivos distintos.
- Las contraseñas nunca se guardan en texto plano (hash SHA-256 + sal aleatoria vía Web Crypto API).
- El panel de facilitador/a usa un PIN de acceso simple, pensado únicamente como barrera básica para
  talleres presenciales — **no es autenticación segura para producción**.

## 📞 Líneas de ayuda (Bolivia)

- Línea 156 — violencia hacia la niñez (La Paz)
- Familia Segura: 800 11 30 40
- FELCV (violencia hacia la mujer): 800 10 41 00

## 📄 Licencia

Proyecto de impacto social sin fines de lucro. Consulta el archivo `LICENSE` para más detalles.
