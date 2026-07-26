/* =========================================================================
   gamification.js — Motor de niveles, XP, monedas, logros y recompensas
   ========================================================================= */

const NIVELES = [
  { n:1, es:"Semilla",       ay:"Jatha",        umbral:0,   icono:"bi-flower1", color:"#8AA5A0" },
  { n:2, es:"Brote",         ay:"Ch'uxña",       umbral:150, icono:"bi-tree",    color:"#3D7A5C" },
  { n:3, es:"Raíz Fuerte",   ay:"Sapa Ch'ama",   umbral:350, icono:"bi-tsunami", color:"#BF4E30" },
  { n:4, es:"Árbol Fuerte",  ay:"Quqa Ch'ama",   umbral:600, icono:"bi-flower3", color:"#E8A33D" },
  { n:5, es:"Bosque Kusisiña", ay:"Kusisiña Quqa", umbral:950, icono:"bi-trophy", color:"#A93F65" }
];

const INSIGNIAS = {
  primera_actividad:   { es:"Primer paso en familia",     ay:"Nayrïr Thakhi",         icono:"bi-stars" },
  racha_3:              { es:"3 días seguidos jugando",    ay:"Kimsa Uru",             icono:"bi-fire" },
  nivel_2:              { es:"Llegamos a Brote",           ay:"Ch'uxñaru Puriwayxta",  icono:"bi-tree" },
  nivel_4:              { es:"Familia Árbol Fuerte",       ay:"Quqa Ch'ama Familia",   icono:"bi-flower3" },
  categoria_emocional:  { es:"Exploradores de emociones",  ay:"Muspa Thaqhirinaka",    icono:"bi-emoji-heart-eyes" },
  seis_actividades:     { es:"Familia constante",          ay:"Familia Wali Chama",    icono:"bi-trophy" },
  primer_juego:         { es:"Primer minijuego jugado",    ay:"Nayrïr Anataw",         icono:"bi-controller" },
  jugador_completo:     { es:"Probó los 10 minijuegos",    ay:"Taqi Anataw Yatiña",    icono:"bi-joystick" },
  puntaje_perfecto:     { es:"Puntaje perfecto",           ay:"Wali Askïr Puntos",     icono:"bi-gem" },
  coleccionista:        { es:"100 monedas ahorradas",      ay:"Pataka Qullqi",         icono:"bi-piggy-bank" },
  diez_juegos:          { es:"10 minijuegos completados",  ay:"Tunka Anataw Tukuyata", icono:"bi-award" }
};

const CLAVES_MINIJUEGOS = [
  "memorama_emociones","identificar_emociones","verdadero_falso","emparejar_emociones",
  "rompecabezas_familiar","mejor_decision","historia_interactiva","ruleta_desafios",
  "trivia_familiar","situaciones_familiares"
];

/* Recompensas reales (no monetarias) que la familia puede canjear en casa al
   juntar monedas. Se muestran como sugerencias en el tablero. */
const RECOMPENSAS = [
  { monedas:50,  es:"Elegir la película o el juego del fin de semana", ay:"Semana tukuyana anataw ajllaña", icono:"bi-film" },
  { monedas:100, es:"Cocinar juntos el plato favorito de la familia",   ay:"Familia manqʼa munata phayaña", icono:"bi-egg-fried" },
  { monedas:180, es:"Una tarde de paseo especial en familia",           ay:"Mä jayp'u familiampi sarnaqaña", icono:"bi-signpost-split" },
  { monedas:280, es:"Elegir la próxima actividad nueva para probar",    ay:"Machaq anataw ajllaña",          icono:"bi-gift" }
];

const GAMIF = (() => {

  function nivelPorPuntos(puntos){
    let actual = NIVELES[0];
    for (const niv of NIVELES) if (puntos >= niv.umbral) actual = niv;
    return actual;
  }

  function siguienteNivel(puntos){
    return NIVELES.find(n => n.umbral > puntos) || null;
  }

  function porcentajeAlSiguiente(puntos){
    const actual = nivelPorPuntos(puntos);
    const siguiente = siguienteNivel(puntos);
    if (!siguiente) return 100;
    const rango = siguiente.umbral - actual.umbral;
    const avance = puntos - actual.umbral;
    return Math.min(100, Math.round((avance / rango) * 100));
  }

  function nivelDesbloqueado(familiaPuntos, nivelRequerido){
    return nivelPorPuntos(familiaPuntos).n >= nivelRequerido;
  }

  /**
   * Registra el resultado de una actividad o minijuego, otorga XP (puntos) y
   * monedas, actualiza racha/nivel y calcula qué logros nuevos se desbloquean.
   * @param {number} familiaId
   * @param {string} actividadClave
   * @param {number} puntosActividad  XP base de la actividad (tabla actividades)
   * @param {object} opciones  { monedasExtra:number, desempeno:0-100, perfecto:boolean }
   */
  async function registrarActividad(familiaId, actividadClave, puntosActividad, opciones = {}){
    await DB.init();
    const { monedasExtra = 0, desempeno = null, perfecto = false } = opciones;

    const actividad = DB.query(`SELECT * FROM actividades WHERE clave=?`, [actividadClave])[0];
    if (!actividad){
      throw new Error(`No se encontró la actividad "${actividadClave}" en la base de datos.`);
    }
    const monedasBase = actividad.monedas || 15;
    const monedasGanadas = monedasBase + monedasExtra;

    DB.run(`INSERT INTO progreso (familia_id, actividad_clave, puntos_obtenidos, monedas_obtenidas, desempeno) VALUES (?,?,?,?,?)`,
      [familiaId, actividadClave, puntosActividad, monedasGanadas, desempeno]);

    const fam = DB.query(`SELECT * FROM familias WHERE id=?`, [familiaId])[0];
    const puntosNuevos = fam.puntos + puntosActividad;
    const monedasNuevas = (fam.monedas || 0) + monedasGanadas;
    const nivelAnterior = nivelPorPuntos(fam.puntos).n;
    const nivelNuevo = nivelPorPuntos(puntosNuevos).n;

    const hoy = new Date().toISOString().slice(0,10);
    let racha = fam.racha || 0;
    if (fam.ultima_actividad){
      const ayer = new Date(); ayer.setDate(ayer.getDate()-1);
      const ayerStr = ayer.toISOString().slice(0,10);
      if (fam.ultima_actividad === ayerStr) racha += 1;
      else if (fam.ultima_actividad !== hoy) racha = 1;
    } else {
      racha = 1;
    }

    DB.run(`UPDATE familias SET puntos=?, monedas=?, nivel=?, racha=?, ultima_actividad=? WHERE id=?`,
      [puntosNuevos, monedasNuevas, nivelNuevo, racha, hoy, familiaId]);

    const nuevasInsignias = [];
    const totalActividades = DB.query(`SELECT COUNT(*) c FROM progreso WHERE familia_id=?`,[familiaId])[0].c;
    const totalJuegos = DB.query(`
      SELECT COUNT(*) c FROM progreso p JOIN actividades a ON a.clave=p.actividad_clave
      WHERE p.familia_id=? AND a.categoria='juego'`, [familiaId])[0].c;
    const juegosDistintos = DB.query(`
      SELECT COUNT(DISTINCT p.actividad_clave) c FROM progreso p JOIN actividades a ON a.clave=p.actividad_clave
      WHERE p.familia_id=? AND a.categoria='juego'`, [familiaId])[0].c;
    const yaTiene = clave => DB.query(`SELECT 1 FROM insignias WHERE familia_id=? AND clave=?`,[familiaId, clave]).length > 0;

    function otorgar(clave){
      if (!yaTiene(clave)){
        DB.run(`INSERT INTO insignias (familia_id, clave) VALUES (?,?)`, [familiaId, clave]);
        nuevasInsignias.push(clave);
      }
    }

    if (totalActividades === 1) otorgar("primera_actividad");
    if (totalActividades >= 6) otorgar("seis_actividades");
    if (racha >= 3) otorgar("racha_3");
    if (nivelNuevo >= 2 && nivelAnterior < 2) otorgar("nivel_2");
    if (nivelNuevo >= 4 && nivelAnterior < 4) otorgar("nivel_4");
    if (actividad && actividad.categoria === "juego" && totalJuegos === 1) otorgar("primer_juego");
    if (totalJuegos >= 10) otorgar("diez_juegos");
    if (juegosDistintos >= CLAVES_MINIJUEGOS.length) otorgar("jugador_completo");
    if (perfecto) otorgar("puntaje_perfecto");
    if (monedasNuevas >= 100) otorgar("coleccionista");

    if (actividad && actividad.categoria === "emocional"){
      const emocionales = DB.query(`SELECT COUNT(*) c FROM progreso p JOIN actividades a ON a.clave=p.actividad_clave WHERE p.familia_id=? AND a.categoria='emocional'`,[familiaId])[0].c;
      if (emocionales >= 2) otorgar("categoria_emocional");
    }

    return {
      puntosGanados: puntosActividad, monedasGanadas,
      puntosNuevos, monedasNuevas, nivelNuevo,
      subioDeNivel: nivelNuevo > nivelAnterior,
      racha, nuevasInsignias
    };
  }

  return { nivelPorPuntos, siguienteNivel, porcentajeAlSiguiente, nivelDesbloqueado, registrarActividad };
})();
