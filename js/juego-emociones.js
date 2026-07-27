const EMOCIONES = [
  { es:"Alegría", ay:"Kusisiña", c:"#E8A33D", pregunta_es:"Cuenta una vez en que sentiste mucha alegría en familia.", pregunta_ay:"Mä kutik familiampi kusisitätaxa parlaña." },
  { es:"Tristeza", ay:"Llakisiña", c:"#1F2E52", pregunta_es:"Cuenta una vez en que estuviste triste. ¿Quién te ayudó?", pregunta_ay:"Mä kutik llakisitätaxa parlaña. ¿Khitis yanapt'itu?" },
  { es:"Enojo", ay:"Phiñasiña", c:"#BF4E30", pregunta_es:"Cuenta una vez que te enojaste. ¿Qué hiciste para calmarte?", pregunta_ay:"Mä kutik phiñasitätaxa parlaña. ¿Kunas lurta thaqhañataki?" },
  { es:"Miedo", ay:"Axsarasiña", c:"#3D7A5C", pregunta_es:"Cuenta una vez en que sentiste miedo. ¿Qué te ayudaría a sentirte más segura o seguro?", pregunta_ay:"Mä kutik axsarasitätaxa parlaña." },
  { es:"Sorpresa", ay:"Muspa Uñjaña", c:"#A93F65", pregunta_es:"Cuenta una sorpresa que recuerdes con cariño.", pregunta_ay:"Mä muspa amtawi parlaña." },
  { es:"Calma", ay:"Qasi Chuymana", c:"#8AA5A0", pregunta_es:"¿Qué actividad hacen en familia que les da tranquilidad?", pregunta_ay:"¿Kuna anataw familiampi qasi chuymani churtam?" }
];

let turnoActual = "adulto";
let emocionActual = null;
let listaIntegrantes = [];

(async function(){
  if (!requerirSesion()) return;
  if (!(await iniciarDB())) return;
  const famId = SESION.obtener();
  listaIntegrantes = await DB.query(`SELECT * FROM integrantes WHERE familia_id=?`, [famId]);

  dibujarRueda();
  actualizarTurno();

  document.getElementById("btnGirar").addEventListener("click", girar);
  document.getElementById("btnRegistrar").addEventListener("click", registrarPuntos);
})();

function nombreDeTurno(){
  const idioma = I18N.idiomaActual();
  if (turnoActual === "adulto"){
    const a = listaIntegrantes.find(i=>i.rol==="adulto");
    return a ? a.nombre : (idioma==="es" ? "Persona adulta" : "Jach'a jaqi");
  } else {
    const n = listaIntegrantes.filter(i=>i.rol==="nino");
    return n.length ? n[Math.floor(Math.random()*n.length)].nombre : (idioma==="es" ? "Niña/niño" : "Wawa");
  }
}

function actualizarTurno(){
  document.getElementById("nombreTurno").textContent = nombreDeTurno();
}

function dibujarRueda(){
  const svg = document.getElementById("ruedaJuego");
  const cx=150, cy=150, r=140;
  const paso = 360/EMOCIONES.length;
  const idioma = I18N.idiomaActual();
  let html = "";
  EMOCIONES.forEach((e,i)=>{
    const a0 = (i*paso - 90) * Math.PI/180;
    const a1 = ((i+1)*paso - 90) * Math.PI/180;
    const x0 = cx + r*Math.cos(a0), y0 = cy + r*Math.sin(a0);
    const x1 = cx + r*Math.cos(a1), y1 = cy + r*Math.sin(a1);
    html += `<path d="M${cx},${cy} L${x0},${y0} A${r},${r} 0 0,1 ${x1},${y1} Z" fill="${e.c}" stroke="#F7F1E3" stroke-width="2"/>`;
    const am = (a0+a1)/2;
    const tx = cx + (r*0.62)*Math.cos(am), ty = cy + (r*0.62)*Math.sin(am);
    const etiqueta = idioma==="es" ? e.es : e.ay;
    html += `<text x="${tx}" y="${ty}" fill="#fff" font-size="13" font-family="Work Sans" font-weight="600" text-anchor="middle" transform="rotate(${(am*180/Math.PI)+90},${tx},${ty})">${etiqueta}</text>`;
  });
  html += `<circle cx="${cx}" cy="${cy}" r="26" fill="#16213E" stroke="#F7F1E3" stroke-width="3"/>`;
  svg.innerHTML = html;
}

let anguloAcumulado = 0;
function girar(){
  document.getElementById("btnGirar").disabled = true;
  const paso = 360/EMOCIONES.length;
  const vueltasExtra = 5 + Math.floor(Math.random()*3);
  const indiceGanador = Math.floor(Math.random()*EMOCIONES.length);
  // El puntero está arriba (0°). Calculamos el ángulo final para que el sector ganador quede bajo el puntero.
  const anguloSector = indiceGanador*paso + paso/2;
  const anguloFinal = vueltasExtra*360 + (360 - anguloSector);
  anguloAcumulado += anguloFinal;

  const svg = document.getElementById("ruedaJuego");
  svg.style.transform = `rotate(${anguloAcumulado}deg)`;

  setTimeout(()=>{
    emocionActual = EMOCIONES[indiceGanador];
    mostrarResultado();
    document.getElementById("btnGirar").disabled = false;
  }, 3300);
}

function mostrarResultado(){
  const idioma = I18N.idiomaActual();
  document.getElementById("tituloResultado").textContent = idioma==="es" ? emocionActual.es : emocionActual.ay;
  document.getElementById("pistaResultado").textContent = idioma==="es" ? emocionActual.pregunta_es : emocionActual.pregunta_ay;
  document.getElementById("labelReflexion").textContent = idioma==="es"
    ? `${nombreDeTurno()}, cuando terminen de conversar, pueden anotar una palabra clave:`
    : `${nombreDeTurno()}, aruskipasa tukuyasa, mä arunak qillqasipxta:`;
  document.getElementById("btnRegistrar").disabled = false;

  // Alterna el turno para la siguiente ronda
  turnoActual = turnoActual === "adulto" ? "nino" : "adulto";
  actualizarTurno();
}

async function registrarPuntos(){
  const idioma = I18N.idiomaActual();
  try {
    const famId = SESION.obtener();
    const actividad = (await DB.query(`SELECT * FROM actividades WHERE clave='rueda_emociones'`))[0];
    if (!actividad) throw new Error("Actividad 'rueda_emociones' no encontrada.");
    const resultado = await GAMIF.registrarActividad(famId, "rueda_emociones", actividad.puntos);
    celebrar(resultado.subioDeNivel ? "grande" : "normal");

    let extra = "";
    if (resultado.subioDeNivel){
      const niv = GAMIF.nivelPorPuntos(resultado.puntosNuevos);
      extra += `<p class="mt-2">🎉 ${idioma==="es" ? "¡Subieron a nivel" : "¡Nivel mistupxta"} <strong>${idioma==="es"?niv.es:niv.ay}</strong>!</p>`;
    }

    Swal.fire({
      icon:"success",
      title: `+${actividad.puntos} XP`,
      html: `<div class="d-flex justify-content-center gap-3 my-2">
               <span class="moneda-flotante"><i class="bi bi-coin"></i> +${resultado.monedasGanadas}</span>
             </div>
             <p>${idioma==="es" ? "¡Gracias por jugar y conversar juntos!" : "¡Yuspagara chikachasa anatañataki!"}</p>${extra}`,
      confirmButtonColor:"#3D7A5C",
      confirmButtonText: idioma==="es" ? "Ver mi tablero" : "Tablero uñjaña",
      showCancelButton:true,
      cancelButtonText: idioma==="es" ? "Girar otra vez" : "Yapa muyuyaña"
    }).then(r=>{
      if (r.isConfirmed) window.location.href = "dashboard.html";
      else {
        document.getElementById("btnRegistrar").disabled = true;
        document.getElementById("reflexion").value = "";
        document.getElementById("pistaResultado").textContent = idioma==="es" ? "Giren la rueda para comenzar." : "Muyu muyuyañataki qallta.";
        document.getElementById("tituloResultado").textContent = "—";
      }
    });
  } catch (error){
    console.error("Error al registrar la rueda de emociones:", error);
    Swal.fire({
      icon:"error",
      title: idioma==="es" ? "No pudimos guardar el resultado" : "Jan imasa tukuyawi",
      text: idioma==="es"
        ? "Algo falló al registrar esta actividad. Vuelve a intentarlo; si el problema sigue, es posible que el almacenamiento del navegador esté lleno."
        : "Mä pantjasiwa. Wasitat lurañani.",
      confirmButtonColor:"#BF4E30"
    });
  }
}
