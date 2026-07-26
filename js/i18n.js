/* =========================================================================
   i18n.js — Motor bilingüe Español / Aymara para Kusisiña
   -------------------------------------------------------------------------
   Nota metodológica: las frases en aymara se ofrecen como una primera
   aproximación para acercar la plataforma a familias aymara-hablantes de
   La Paz y El Alto. Antes de un despliegue en producción, se recomienda
   que un/a lingüista o hablante nativo revise y valide cada cadena.
   ========================================================================= */

const IDIOMAS = {
  es: {
    nombre: "Español",
    nav_inicio: "Inicio",
    nav_actividades: "Actividades",
    nav_juegos: "Arcade",
    nav_educacion: "Aprender",
    nav_dashboard: "Mi familia",
    nav_ingresar: "Ingresar",
    nav_registro: "Crear cuenta familiar",
    hero_eyebrow: "Co-Playing · Crianza positiva · La Paz — El Alto",
    hero_titulo: "Familias que juegan juntas, crecen juntas.",
    hero_texto: "Kusisiña es un espacio donde madres, padres, cuidadores y niñas, niños y adolescentes aprenden a comunicarse, regular emociones y prevenir la violencia, jugando en equipo.",
    hero_cta1: "Crear mi cuenta familiar",
    hero_cta2: "Ver cómo funciona",
    hero_dato: "familias acompañadas en La Paz y El Alto",
    seccion_que_titulo: "¿Qué es el Co-Playing?",
    seccion_que_texto: "Es aprender jugando, en pareja: una persona adulta y una niña, niño o adolescente resuelven juntas cada actividad. Nadie juega solo — el vínculo es parte del método.",
    pilar1_t: "Gamificación",
    pilar1_d: "Puntos, insignias y niveles que celebran cada paso hacia una crianza sin violencia.",
    pilar2_t: "Niveles por etapas",
    pilar2_d: "De Semilla a Árbol Fuerte: el recorrido crece con la confianza de tu familia.",
    pilar3_t: "Crianza positiva",
    pilar3_d: "Disciplina con límites claros, sin gritos ni golpes: acuerdos, no castigos.",
    pilar4_t: "Educación emocional",
    pilar4_d: "Nombrar lo que sentimos es el primer paso para no hacernos daño.",
    como_titulo: "Cómo se juega en casa",
    como1_t: "Crean su familia",
    como1_d: "Una cuenta para la persona adulta y un perfil para cada niña o niño.",
    como2_t: "Eligen una actividad",
    como2_d: "Juegos cortos (10–15 min) para hacer juntos, sin pantallas de por medio la mayor parte del tiempo.",
    como3_t: "Conversan y suman puntos",
    como3_d: "Cada actividad termina en una conversación guiada. Ahí está la magia.",
    como4_t: "Suben de nivel en familia",
    como4_d: "El progreso es compartido: gana la familia, no una sola persona.",
    cta_final_t: "Bolivia sin golpes ni gritos empieza en cada hogar.",
    cta_final_b: "Empezar ahora, es gratis",
    footer_recursos: "Recursos",
    footer_ayuda: "Líneas de ayuda Bolivia",
    footer_metodologia: "Metodología",
    login_titulo: "Ingresar a mi familia",
    login_codigo: "Código de familia",
    login_usuario: "¿Quién eres?",
    login_boton: "Entrar a jugar",
    login_sinCuenta: "¿Todavía no tienen cuenta familiar?",
    registro_titulo: "Creemos su cuenta familiar",
    registro_familia: "Nombre de la familia",
    registro_adulto: "Tu nombre (persona adulta)",
    registro_correo: "Correo electrónico",
    registro_clave: "Contraseña",
    registro_ciudad: "Municipio",
    registro_ninos: "Perfiles de niñas, niños o adolescentes",
    registro_agregarNino: "Agregar niña/niño",
    registro_boton: "Crear familia y empezar",
    dash_bienvenida: "Bienvenida de nuevo",
    dash_nivel: "Nivel actual",
    dash_puntos: "Puntos familiares",
    dash_racha: "Días seguidos jugando",
    dash_progresoEmocional: "Progreso del vínculo familiar",
    dash_insignias: "Insignias de la familia",
    dash_actividadReciente: "Actividad reciente",
    dash_verActividades: "Ver actividades",
    act_titulo: "Actividades para jugar en familia",
    act_subtitulo: "Elijan una y hagan equipo: una persona adulta + una niña, niño o adolescente.",
    act_filtro_todos: "Todos los niveles",
    act_boton_jugar: "Jugar ahora",
    act_boton_completada: "Ya la hicieron",
    act_boton_repetir: "Jugar de nuevo",
    edu_titulo: "Aprender para acompañar mejor",
    edu_subtitulo: "Ideas breves de crianza positiva, pensadas para el día a día en La Paz y El Alto.",
    juego_titulo: "Rueda de Emociones",
    juego_instr: "Giren la rueda por turnos. Cuando se detenga, quien giró cuenta una vez en que sintió esa emoción, y la otra persona escucha sin interrumpir.",
    juego_girar: "Girar la rueda",
    juego_turno: "Turno de",
    juego_registrar: "Ya conversamos, sumar puntos",
    ayuda_titulo: "Si tu familia necesita ayuda ahora",
    fac_titulo: "Panel de facilitador/a comunitario",
    fac_subtitulo: "Vista conjunta de las familias registradas en este dispositivo.",
    fac_familias: "Familias registradas",
    fac_puntosProm: "Puntos promedio",
    fac_actividades: "Actividades jugadas",
    fac_seguimiento: "Necesitan seguimiento",
    fac_buscar: "Buscar familia...",
    fac_municipio: "Municipio",
    fac_estadoTodos: "Todos los estados",
    fac_estadoActiva: "Activa",
    fac_estadoAtencion: "Necesita seguimiento",
    fac_estadoNueva: "Recién registrada",
    fac_colFamilia: "Familia",
    fac_colNivel: "Nivel",
    fac_colPuntos: "Puntos",
    fac_colUltima: "Última actividad",
    fac_colEstado: "Estado",
    fac_verDetalle: "Ver",
    fac_exportar: "Exportar CSV",
    fac_sinFamilias: "Todavía no hay familias registradas en este dispositivo.",
    fac_notaArquitectura: "Este panel muestra las familias creadas en este mismo dispositivo (ideal para talleres presenciales). Para ver familias de varios dispositivos a la vez se necesitaría un servidor central.",
    fac_accesoTitulo: "Acceso de facilitador/a",
    fac_accesoTexto: "Ingresa el código de acceso que te dio la organización.",
    fac_accesoBoton: "Entrar al panel",
    idioma_actual: "AY"
  },
  ay: {
    nombre: "Aymara",
    nav_inicio: "Qallta",
    nav_actividades: "Anatañanaka",
    nav_juegos: "Arcade",
    nav_educacion: "Yatiqaña",
    nav_dashboard: "Nayra familia",
    nav_ingresar: "Mantaña",
    nav_registro: "Familia qillqantaña",
    hero_eyebrow: "Co-Playing · Sum uywaña · La Paz — El Alto",
    hero_titulo: "Familias kawkinkirinaka anatasa, kawkinkirinaka jilañäni.",
    hero_texto: "Kusisiña ukax mä uraqi, kawkinsa awki-taykanaka ukat wawanaka parlasiñ yatiqapxi, chuymanchaña ukat jan usuchäwi jark'aña, anatasa.",
    hero_cta1: "Familia cuenta luraña",
    hero_cta2: "Kunjamsa lurasi uñjaña",
    hero_dato: "familianaka La Paz ukat El Alto markanx yanapt'ata",
    seccion_que_titulo: "¿Kunas Co-Playing?",
    seccion_que_texto: "Anatasa yatiqañawa, pä jaqi: mä jach'a jaqi ukat mä wawa chika anatapxi. Ni khitis sapaki anataki — munasiñax método ukankiwa.",
    pilar1_t: "Gamificación",
    pilar1_d: "Puntos, insignianaka ukat nivelnaka, jan usuchäwi jark'añataki thakhi thaqhata.",
    pilar2_t: "Nivelnaka",
    pilar2_d: "Jathat Qhulliru: thakhix familiaman chuymampi jilaskiwa.",
    pilar3_t: "Sum uywaña",
    pilar3_d: "Sarnaqawinaka sum uñt'ata, jan qhiswaraki jan ajllaraki: amtanaka, jan mut'uyanaka.",
    pilar4_t: "Chuymanchaña yatiqaña",
    pilar4_d: "Kuna muspa ukanaka sutichaña ukax nayrïr thakiwa jan usuchasiñataki.",
    como_titulo: "Kunjams utankama anatasispa",
    como1_t: "Familia luraña",
    como1_d: "Mä cuenta jach'a jaqitaki ukat mä perfil sapa wawataki.",
    como2_t: "Mä anataña ajlliña",
    como2_d: "Jukʼa anatanaka (10–15 minuto) chikachasa lurañataki.",
    como3_t: "Aruskipasa ukat puntos apthapiña",
    como3_d: "Sapa anatax mä aruskipäwimpi tukuyi. Ukanwa magia utji.",
    como4_t: "Familiampi nivel mistuña",
    como4_d: "Nayrïr sarawix chikachatawa: familia atipi, jan mä jaqiki.",
    cta_final_t: "Bolivia jan ajllaraki jan qhiswaraki utankama qalltasi.",
    cta_final_b: "Jichhürkama qallta, jani qulqini",
    footer_recursos: "Yanapa uñstäwinaka",
    footer_ayuda: "Bolivia yanap phuqha",
    footer_metodologia: "Método",
    login_titulo: "Familia manqana mantaña",
    login_codigo: "Familia código",
    login_usuario: "¿Khitisa jumax?",
    login_boton: "Anataña mantaña",
    login_sinCuenta: "¿Janirakis familia cuenta utjkiti?",
    registro_titulo: "Familia cuenta luraña",
    registro_familia: "Familia suti",
    registro_adulto: "Jumana sutima (jach'a jaqi)",
    registro_correo: "Correo electrónico",
    registro_clave: "Contraseña",
    registro_ciudad: "Markana suti",
    registro_ninos: "Wawanakana perfilanaka",
    registro_agregarNino: "Wawa yapaña",
    registro_boton: "Familia luraña ukat qallta",
    dash_bienvenida: "Waliki kutt'anïta",
    dash_nivel: "Jichha nivel",
    dash_puntos: "Familia puntos",
    dash_racha: "Uru jaykhu anatasa",
    dash_progresoEmocional: "Familia munasiñana sarawipa",
    dash_insignias: "Familia insignianaka",
    dash_actividadReciente: "Jichha pachana anataw",
    dash_verActividades: "Anatañanaka uñjaña",
    act_titulo: "Familiampi anatañataki anatanaka",
    act_subtitulo: "Mayaki ajlliña ukat chika lurañani: jach'a jaqi + wawa.",
    act_filtro_todos: "Taqi nivelnaka",
    act_boton_jugar: "Jichha anataña",
    act_boton_completada: "Lurayätawa",
    act_boton_repetir: "Yapa anataña",
    edu_titulo: "Yatiqaña sum uywañataki",
    edu_subtitulo: "Jukʼa yatxatawinaka, La Paz ukat El Alto uraqinakataki lurata.",
    juego_titulo: "Muspa Muyu",
    juego_instr: "Muyu muyuyapxam turno turno. Jark'asisa, khitis muyuyi ukax mä kutik parli, yaqhax istʼi jan jaytasa.",
    juego_girar: "Muyu muyuyaña",
    juego_turno: "Turno de",
    juego_registrar: "Aruskipawayta, puntos apthapiña",
    ayuda_titulo: "Familiamax jichhürkama yanapt'awi mayki ukhax",
    fac_titulo: "Yanapiri panel",
    fac_subtitulo: "Aka dispositivo ukan familianakana uñjawipa.",
    fac_familias: "Qillqantata familianaka",
    fac_puntosProm: "Puntos chika",
    fac_actividades: "Anatäwinaka lurata",
    fac_seguimiento: "Yanapt'aña munapxi",
    fac_buscar: "Familia thaqhaña...",
    fac_municipio: "Marka",
    fac_estadoTodos: "Taqi estado",
    fac_estadoActiva: "Anataski",
    fac_estadoAtencion: "Yanapt'aña munapxi",
    fac_estadoNueva: "Jichha qillqantata",
    fac_colFamilia: "Familia",
    fac_colNivel: "Nivel",
    fac_colPuntos: "Puntos",
    fac_colUltima: "Qhipa anataw",
    fac_colEstado: "Estado",
    fac_verDetalle: "Uñjaña",
    fac_exportar: "CSV apsuña",
    fac_sinFamilias: "Janïra familia qillqantatakiti aka dispositivo ukana.",
    fac_notaArquitectura: "Aka panel ukax aka dispositivo ukan luratanaka familianak uñachayi. Yaqha dispositivonakat uñjañataki mä servidor wakiskaspawa.",
    fac_accesoTitulo: "Yanapirina mantawipa",
    fac_accesoTexto: "Organización churtama código ukax qillqaña.",
    fac_accesoBoton: "Panelaru mantaña",
    idioma_actual: "ES"
  }
};

const I18N = (() => {
  const STORAGE_KEY = "kusi_idioma";

  function idiomaActual(){
    return localStorage.getItem(STORAGE_KEY) || "es";
  }

  function alternar(){
    const nuevo = idiomaActual() === "es" ? "ay" : "es";
    localStorage.setItem(STORAGE_KEY, nuevo);
    aplicar();
  }

  function t(clave){
    const dic = IDIOMAS[idiomaActual()];
    return (dic && dic[clave]) || IDIOMAS.es[clave] || clave;
  }

  function aplicar(){
    const dic = IDIOMAS[idiomaActual()];
    document.documentElement.lang = idiomaActual();
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const clave = el.getAttribute("data-i18n");
      if (dic[clave]) el.textContent = dic[clave];
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
      const clave = el.getAttribute("data-i18n-placeholder");
      if (dic[clave]) el.setAttribute("placeholder", dic[clave]);
    });
    document.querySelectorAll("[data-i18n-toggle-label]").forEach(el => {
      el.textContent = dic.idioma_actual;
    });
  }

  return { t, aplicar, alternar, idiomaActual };
})();

document.addEventListener("DOMContentLoaded", I18N.aplicar);
