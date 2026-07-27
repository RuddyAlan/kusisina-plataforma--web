-- =========================================================================
-- schema.sql — Esquema inicial de Kusisiña en Turso (libSQL)
-- -------------------------------------------------------------------------
-- Ejecutar UNA sola vez sobre la base de datos nueva:
--   turso db shell kusisina < schema.sql
-- =========================================================================

CREATE TABLE IF NOT EXISTS familias (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  codigo TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  municipio TEXT,
  correo TEXT,
  clave_hash TEXT,
  clave_salt TEXT,
  puntos INTEGER DEFAULT 0,
  monedas INTEGER DEFAULT 0,
  nivel INTEGER DEFAULT 1,
  racha INTEGER DEFAULT 0,
  ultima_actividad TEXT,
  creada TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS integrantes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  familia_id INTEGER NOT NULL,
  nombre TEXT NOT NULL,
  rol TEXT NOT NULL,      -- 'adulto' | 'nino'
  edad INTEGER,
  avatar TEXT,
  FOREIGN KEY(familia_id) REFERENCES familias(id)
);

CREATE TABLE IF NOT EXISTS actividades (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  clave TEXT UNIQUE,
  titulo_es TEXT, titulo_ay TEXT,
  descripcion_es TEXT, descripcion_ay TEXT,
  nivel INTEGER,
  categoria TEXT,      -- 'emocional' | 'comunicacion' | 'limites' | 'juego'
  puntos INTEGER,
  monedas INTEGER DEFAULT 15,
  duracion_min INTEGER,
  icono TEXT
);

CREATE TABLE IF NOT EXISTS progreso (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  familia_id INTEGER NOT NULL,
  actividad_clave TEXT NOT NULL,
  fecha TEXT DEFAULT CURRENT_TIMESTAMP,
  puntos_obtenidos INTEGER,
  monedas_obtenidas INTEGER DEFAULT 0,
  desempeno INTEGER DEFAULT NULL -- % de aciertos, si aplica (0-100)
);

CREATE TABLE IF NOT EXISTS insignias (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  familia_id INTEGER NOT NULL,
  clave TEXT NOT NULL,
  fecha TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Índices para las búsquedas más frecuentes (login por código, registro por correo)
CREATE INDEX IF NOT EXISTS idx_familias_codigo ON familias(codigo);
CREATE INDEX IF NOT EXISTS idx_familias_correo ON familias(correo);
CREATE INDEX IF NOT EXISTS idx_integrantes_familia ON integrantes(familia_id);
CREATE INDEX IF NOT EXISTS idx_progreso_familia ON progreso(familia_id);
CREATE INDEX IF NOT EXISTS idx_insignias_familia ON insignias(familia_id);

-- Catálogo de actividades y minijuegos (igual al que insertaba poblarActividades() en db.js)
INSERT OR IGNORE INTO actividades
  (clave,titulo_es,titulo_ay,descripcion_es,descripcion_ay,nivel,categoria,puntos,monedas,duracion_min,icono)
VALUES
('rueda_emociones','Rueda de Emociones','Muspa Muyu',
  'Giren la rueda y cuenten un recuerdo relacionado a la emoción que salga.',
  'Muyu muyuyañataki ukat mä amtawi parlañataki.',
  1,'emocional',40,15,10,'bi-emoji-smile'),
('mapa_del_dia','Mapa del Día','Uru Mapa',
  'Dibujen juntos cómo fue el día de cada uno, usando caras y colores.',
  'Chikachasa sapa urunaka dibujaña.',
  1,'comunicacion',30,10,15,'bi-map'),
('semaforo_enojo','El Semáforo del Enojo','Phisqallu',
  'Practiquen tres pasos para calmarse antes de responder cuando algo molesta.',
  'Kimsa thakhinaka thaqhaña jan phiñasiñataki.',
  2,'limites',35,12,10,'bi-stoplights'),
('acuerdos_casa','Acuerdos de Casa','Utana Amtanaka',
  'Escriban juntos 3 acuerdos familiares en vez de reglas impuestas.',
  'Kimsa amtanaka utaru qillqaña.',
  2,'limites',45,15,20,'bi-house-heart'),
('telar_familiar','El Telar Familiar','Awayu Sata',
  'Cada integrante aporta un "hilo" (cualidad) que fortalece a la familia.',
  'Sapa jaqix mä ''q''aytu'' churi familiaru.',
  3,'comunicacion',50,18,15,'bi-flower3'),
('carta_gratitud','Carta de Agradecimiento','Yuspagara Qillqa',
  'Escriban o dibujen una carta agradeciendo algo del otro.',
  'Mä qillqa lurañani yuspagarañataki.',
  3,'emocional',45,15,15,'bi-envelope-heart'),
('memorama_emociones','Memorama de Emociones','Muspa Memorama',
  'Encuentren las parejas de emociones antes de que se acaben los intentos.',
  'Muspa parejanaka thaqhapxam.',
  1,'juego',50,20,8,'bi-grid-3x3-gap'),
('identificar_emociones','Identifica la Emoción','Muspa Uñt''aña',
  'Observen cada carita o situación y elijan qué emoción representa.',
  'Sapa uñnaqa uñjasa, kuna muspa ukax ajlliña.',
  1,'juego',40,15,6,'bi-emoji-laughing'),
('verdadero_falso','Verdadero o Falso: Crianza sin Violencia','Cheqa jan Cheqa',
  'Respondan rápido: ¿es verdadero o falso sobre crianza positiva?',
  'Jani jaytasa kutt''anipxam: ¿cheqasa jan cheqasa?',
  1,'juego',35,15,5,'bi-check2-circle'),
('emparejar_emociones','Emparejar Emociones','Muspa Chikachaña',
  'Unan cada emoción con la situación de la vida diaria que le corresponde.',
  'Sapa muspa uraqi lurawimpi chikachapxam.',
  1,'juego',40,15,7,'bi-link-45deg'),
('rompecabezas_familiar','Rompecabezas Familiar','Familia Rompecabezas',
  'Ordenen las piezas para armar la imagen del árbol familiar.',
  'Piezanaka wakichasa árbol familiar uñstayapxam.',
  2,'juego',45,18,8,'bi-puzzle'),
('mejor_decision','Elige la Mejor Decisión','Waliki Amtaña',
  'Ante cada situación, elijan la respuesta más cercana a la crianza positiva.',
  'Sapa lurawiru, sum uywañ jak''a amtaw ajllapxam.',
  2,'juego',45,20,8,'bi-signpost-2'),
('historia_interactiva','Historia Interactiva: Un Día en Casa','Uta Uru Historia',
  'Tomen decisiones y descubran distintos finales para un día en familia.',
  'Amtanaka ajllasa, jayp''u tukuyanaka uñjapxam.',
  2,'juego',55,22,10,'bi-book-half'),
('ruleta_desafios','Ruleta de Desafíos','Desafío Muyu',
  'Giren la ruleta y completen el reto sorpresa en familia.',
  'Muyu muyuyasa, desafío phuqhapxam.',
  3,'juego',50,25,8,'bi-arrow-repeat'),
('trivia_familiar','Trivia Familiar','Familia Trivia',
  'Pongan a prueba lo que aprendieron sobre emociones y crianza positiva.',
  'Yatiqatanaka uñt''ayapxam, muspanaka ukat sum uywañ toqita.',
  3,'juego',60,25,8,'bi-patch-question'),
('situaciones_familiares','Situaciones Familiares','Familia Lurawinaka',
  'Casos reales de convivencia: elijan la reacción que cuida el vínculo.',
  'Cheqa lurawinaka: munasiña uñtir amtaw ajllapxam.',
  4,'juego',65,28,10,'bi-people-fill');
