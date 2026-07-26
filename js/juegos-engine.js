/* =========================================================================
   juegos-engine.js — Arcade Kusisiña
   -------------------------------------------------------------------------
   Cada minijuego es una función render*() que dibuja su HTML dentro de
   #contenedorJuego y termina llamando a finalizarJuego(), que centraliza el
   otorgamiento de XP/monedas, el desbloqueo de logros y las animaciones de
   celebración (confeti + SweetAlert2), reutilizando GAMIF.registrarActividad.
   ========================================================================= */

let FAMILIA = null;
let JUEGO_ACTUAL = null;

const CATALOGO_JUEGOS = [
  { clave:"memorama_emociones",   icono:"bi-grid-3x3-gap",   render:renderMemorama },
  { clave:"identificar_emociones",icono:"bi-emoji-laughing", render:renderIdentificar },
  { clave:"verdadero_falso",      icono:"bi-check2-circle",  render:renderVerdaderoFalso },
  { clave:"emparejar_emociones",  icono:"bi-link-45deg",     render:renderEmparejar },
  { clave:"rompecabezas_familiar",icono:"bi-puzzle",         render:renderRompecabezas },
  { clave:"mejor_decision",       icono:"bi-signpost-2",     render:()=>renderDecisiones("mejor_decision", DATA_DECISIONES) },
  { clave:"historia_interactiva", icono:"bi-book-half",      render:renderHistoria },
  { clave:"ruleta_desafios",      icono:"bi-arrow-repeat",   render:renderRuleta },
  { clave:"trivia_familiar",      icono:"bi-patch-question", render:renderTrivia },
  { clave:"situaciones_familiares",icono:"bi-people-fill",   render:()=>renderDecisiones("situaciones_familiares", DATA_SITUACIONES) }
];

(async function iniciarArcade(){
  if (!requerirSesion()) return;
  if (!(await iniciarDB())) return;
  await cargarFamilia();
  renderEstadoJugador();
  renderCatalogo();
})();

async function cargarFamilia(){
  const famId = SESION.obtener();
  FAMILIA = DB.query(`SELECT * FROM familias WHERE id=?`, [famId])[0];
}

function renderEstadoJugador(){
  const nivel = GAMIF.nivelPorPuntos(FAMILIA.puntos);
  const idioma = I18N.idiomaActual();
  document.getElementById("estadoJugador").innerHTML = `
    <span class="item-estado item-xp"><i class="bi bi-lightning-charge-fill"></i> ${FAMILIA.puntos} XP</span>
    <span class="item-estado item-monedas"><i class="bi bi-coin"></i> ${FAMILIA.monedas || 0}</span>
    <span class="item-estado item-nivel"><i class="bi ${nivel.icono}"></i> ${idioma==="es" ? nivel.es : nivel.ay}</span>
  `;
}

function renderCatalogo(){
  const idioma = I18N.idiomaActual();
  const grid = document.getElementById("grillaJuegos");
  const actividades = DB.query(`SELECT * FROM actividades WHERE categoria='juego' ORDER BY nivel ASC`);
  const completadas = DB.query(`SELECT actividad_clave, COUNT(*) c FROM progreso WHERE familia_id=? GROUP BY actividad_clave`, [FAMILIA.id]);
  const vecesJugado = clave => (completadas.find(c=>c.actividad_clave===clave) || {c:0}).c;

  grid.innerHTML = actividades.map(a => {
    const meta = CATALOGO_JUEGOS.find(j=>j.clave===a.clave);
    const desbloqueado = GAMIF.nivelDesbloqueado(FAMILIA.puntos, a.nivel);
    const nivelInfo = NIVELES.find(n=>n.n===a.nivel);
    const jugadas = vecesJugado(a.clave);
    return `
      <div class="col-md-6 col-lg-4">
        <div class="tarjeta-juego ${desbloqueado ? "" : "bloqueada"}" ${desbloqueado ? `data-abrir="${a.clave}"` : ""}>
          ${desbloqueado ? "" : `<i class="bi bi-lock-fill candado"></i>`}
          <div class="icono-juego"><i class="bi ${meta ? meta.icono : 'bi-controller'}"></i></div>
          <h3 class="fs-5 text-noche">${idioma==="es" ? a.titulo_es : a.titulo_ay}</h3>
          <p class="text-muted small mb-1">${idioma==="es" ? a.descripcion_es : a.descripcion_ay}</p>
          ${jugadas ? `<span class="small text-verde"><i class="bi bi-check-circle-fill"></i> ${idioma==="es" ? "Jugado "+jugadas+" vez(es)" : "Anatata "+jugadas}</span>` : ""}
          <div class="recompensas-juego">
            <span><i class="bi bi-lightning-charge-fill text-verde"></i> +${a.puntos} XP</span>
            <span><i class="bi bi-coin text-ocre"></i> +${a.monedas}</span>
          </div>
          ${desbloqueado
            ? `<button class="btn-kusi-primario btn-sm w-100 mt-auto">${idioma==="es" ? "Jugar" : "Anataña"}</button>`
            : `<div class="requisito-nivel"><i class="bi bi-lock"></i> ${idioma==="es" ? "Se desbloquea en nivel" : "Nivel ukan jistʼarasi"}: ${idioma==="es" ? nivelInfo.es : nivelInfo.ay}</div>`
          }
        </div>
      </div>`;
  }).join("");

  grid.querySelectorAll("[data-abrir]").forEach(el=>{
    el.addEventListener("click", ()=> abrirJuego(el.getAttribute("data-abrir")));
  });
}

function abrirJuego(clave){
  JUEGO_ACTUAL = clave;
  document.getElementById("catalogoJuegos").classList.add("d-none");
  const cont = document.getElementById("contenedorJuego");
  cont.classList.remove("d-none");
  cont.innerHTML = "";
  const meta = CATALOGO_JUEGOS.find(j=>j.clave===clave);
  if (meta) meta.render();
}

function volverAlCatalogo(){
  document.getElementById("contenedorJuego").classList.add("d-none");
  document.getElementById("catalogoJuegos").classList.remove("d-none");
  renderCatalogo();
}
document.getElementById("btnVolverCatalogo").addEventListener("click", volverAlCatalogo);

/**
 * Cierra un minijuego: otorga XP/monedas vía GAMIF, celebra con confeti y
 * muestra el resumen (incluye subida de nivel y logros nuevos si aplica).
 */
async function finalizarJuego(clave, { aciertos = null, total = null, monedasExtra = 0 } = {}){
  const idioma = I18N.idiomaActual();
  try {
    const actividad = DB.query(`SELECT * FROM actividades WHERE clave=?`, [clave])[0];
    if (!actividad) throw new Error(`Actividad "${clave}" no encontrada.`);
    const desempeno = (aciertos !== null && total) ? Math.round((aciertos/total)*100) : null;
    const perfecto = desempeno === 100;

    const resultado = await GAMIF.registrarActividad(SESION.obtener(), clave, actividad.puntos, {
      monedasExtra, desempeno, perfecto
    });

    await cargarFamilia();
    renderEstadoJugador();
    celebrar(resultado.subioDeNivel || perfecto ? "grande" : "normal");

    let html = `<div class="mb-2">`;
    if (desempeno !== null){
      html += `<p class="fs-5 mb-1">${idioma==="es" ? "Resultado" : "Tukuyawi"}: <strong>${aciertos}/${total}</strong> ${perfecto ? "🌟" : ""}</p>`;
    }
    html += `
      <div class="d-flex justify-content-center gap-3 my-3">
        <span class="moneda-flotante"><i class="bi bi-lightning-charge-fill"></i> +${resultado.puntosGanados} XP</span>
        <span class="moneda-flotante"><i class="bi bi-coin"></i> +${resultado.monedasGanadas}</span>
      </div>`;

    if (resultado.subioDeNivel){
      const niv = GAMIF.nivelPorPuntos(resultado.puntosNuevos);
      html += `<p class="mb-1">🎉 ${idioma==="es" ? "¡Subieron de nivel! Ahora son" : "¡Nivel mistupxta! Jichhax"} <strong>${idioma==="es"?niv.es:niv.ay}</strong></p>`;
    }
    if (resultado.nuevasInsignias.length){
      html += `<div class="d-flex justify-content-center flex-wrap gap-2 mt-2">` +
        resultado.nuevasInsignias.map(c=>`
          <div class="text-center" style="width:70px;">
            <div class="medalla" style="width:56px;height:56px;font-size:1.2rem;"><i class="bi ${INSIGNIAS[c].icono}"></i></div>
            <div class="small">${idioma==="es" ? INSIGNIAS[c].es : INSIGNIAS[c].ay}</div>
          </div>`).join("") + `</div>`;
    }
    html += `</div>`;

    Swal.fire({
      icon:"success",
      title: idioma==="es" ? "¡Buen trabajo en familia!" : "¡Waliki familiampi!",
      html,
      confirmButtonText: idioma==="es" ? "Volver al arcade" : "Kutt'aña",
      confirmButtonColor:"#3D7A5C"
    }).then(()=> volverAlCatalogo());
  } catch (error){
    console.error("Error al finalizar el juego:", error);
    Swal.fire({
      icon:"error",
      title: idioma==="es" ? "No pudimos guardar el resultado" : "Jan imasa tukuyawi",
      text: idioma==="es"
        ? "Algo falló al registrar los puntos de este juego. Vuelve a intentarlo; si el problema sigue, es posible que el almacenamiento del navegador esté lleno."
        : "Mä pantjasiwa. Wasitat lurañani.",
      confirmButtonText: idioma==="es" ? "Volver al arcade" : "Kutt'aña",
      confirmButtonColor:"#BF4E30"
    }).then(()=> volverAlCatalogo());
  }
}

function barajar(array){
  const copia = [...array];
  for (let i = copia.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i+1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}
