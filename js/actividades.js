let NIVEL_FILTRO = "todos";

const PASOS_GUIA = {
  mapa_del_dia: {
    es: ["Consigan papel y colores.", "Cada uno dibuja 3 momentos de su día: uno feliz, uno difícil y uno tranquilo.", "Muéstrense los dibujos y cuenten qué pasó en cada momento."],
    ay: ["Papel ukat colores apthapiña.", "Sapa mayniw kimsa uru amtanaka dibujaña.", "Dibujonaka uñachayasiña ukat parlaña."]
  },
  semaforo_enojo: {
    es: ["Dibujen un semáforo (rojo, amarillo, verde).", "Rojo: paren y respiren 3 veces. Amarillo: piensen qué sienten. Verde: digan qué necesitan, sin gritar.", "Practiquen una vez con una situación inventada."],
    ay: ["Mä semáforo dibujaña (wila, q'illu, ch'uxña).", "Wila: jark'asiña ukat samsuña kimsa kuti. Q'illu: kuna muspa amuyaña. Ch'uxña: kunas munkta parlaña, jan qhiswarakisa.", "Mä kutik yatiqañataki lurapxam."]
  },
  acuerdos_casa: {
    es: ["Cada persona dice una regla que le gustaría tener en casa.", "Elijan juntas 3 acuerdos, escritos en positivo (qué SÍ hacer, no qué no hacer).", "Péguenlos en un lugar visible de la casa."],
    ay: ["Sapa jaqix mä amtawi parli.", "Kimsa amtanaka ajlliña, positivo qillqata.", "Uta uñstir cheqan lat'ayapxam."]
  },
  telar_familiar: {
    es: ["Cada persona elige una cualidad suya que ayuda a la familia (ej. paciencia, alegría).", "Dibujen juntos un telar donde cada 'hilo' es esa cualidad.", "Cuelguen el dibujo donde todos lo vean."],
    ay: ["Sapa jaqix mä kankañapa ajlliña familiaru yanapt'iri.", "Chikachasa mä awayu dibujaña.", "Dibujo uñstir cheqan lat'ayapxam."]
  },
  carta_gratitud: {
    es: ["Cada persona escribe o dibuja una carta corta agradeciendo algo del otro.", "Léanla en voz alta, mirándose.", "Guarden las cartas en un lugar especial de la familia."],
    ay: ["Sapa jaqix mä qillqa jukʼa lurañani yuspagarañataki.", "Arsusa liyipxam, uñtasisa.", "Qillqanaka imañapxam."]
  }
};

(async function(){
  if (!(await iniciarDB())) return;
  const actividades = DB.query(`SELECT * FROM actividades WHERE categoria != 'juego' ORDER BY nivel ASC`);

  renderFiltros();
  renderGrilla(actividades);

  document.addEventListener("kusi:idiomaCambiado", ()=> renderGrilla(actividades));
})();

function renderFiltros(){
  const cont = document.getElementById("filtrosNivel");
  const niveles = [{n:"todos", es:"Todos los niveles", ay:"Taqi nivelnaka"}, ...NIVELES.map(n=>({n:n.n, es:n.es, ay:n.ay}))];
  cont.innerHTML = niveles.map(n => `
    <button class="btn btn-sm ${NIVEL_FILTRO==n.n ? 'btn-kusi-primario':'btn-kusi-secundario'}" data-filtro="${n.n}">
      ${I18N.idiomaActual()==="es" ? n.es : n.ay}
    </button>`).join("");
  cont.querySelectorAll("[data-filtro]").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      NIVEL_FILTRO = btn.getAttribute("data-filtro") == "todos" ? "todos" : Number(btn.getAttribute("data-filtro"));
      renderFiltros();
      const actividades = DB.query(`SELECT * FROM actividades WHERE categoria != 'juego' ORDER BY nivel ASC`);
      renderGrilla(actividades);
    });
  });
}

function renderGrilla(actividades){
  const famId = SESION.obtener();
  const completadas = famId ? DB.query(`SELECT actividad_clave FROM progreso WHERE familia_id=?`, [famId]).map(r=>r.actividad_clave) : [];
  const grilla = document.getElementById("grillaActividades");
  const filtradas = NIVEL_FILTRO === "todos" ? actividades : actividades.filter(a=>a.nivel === NIVEL_FILTRO);

  grilla.innerHTML = filtradas.map(a => {
    const nivelInfo = NIVELES.find(n=>n.n===a.nivel);
    const hecha = completadas.includes(a.clave);
    return `
    <div class="col-md-6 col-lg-4">
      <div class="card-kusi card-actividad p-4">
        <div class="d-flex justify-content-between align-items-start mb-2">
          <div class="card-icono bg-terracota"><i class="bi ${a.icono}"></i></div>
          <span class="badge-nivel badge bg-noche">${I18N.idiomaActual()==="es" ? nivelInfo.es : nivelInfo.ay}</span>
        </div>
        <h3 class="fs-5 text-noche">${I18N.idiomaActual()==="es" ? a.titulo_es : a.titulo_ay}</h3>
        <p class="text-muted small">${I18N.idiomaActual()==="es" ? a.descripcion_es : a.descripcion_ay}</p>
        <div class="d-flex justify-content-between align-items-center small text-muted mb-3 font-mono">
          <span><i class="bi bi-clock"></i> ${a.duracion_min} min</span>
          <span><i class="bi bi-stars text-ocre"></i> +${a.puntos} pts</span>
        </div>
        ${hecha ? `<p class="small text-verde mb-2"><i class="bi bi-check-circle-fill"></i> ${I18N.t('act_boton_completada')}</p>` : ""}
        <button class="btn btn-kusi-verde w-100 btn-sm" data-actividad="${a.clave}">
          <i class="bi bi-play-fill me-1"></i>${hecha ? I18N.t('act_boton_repetir') : I18N.t('act_boton_jugar')}
        </button>
      </div>
    </div>`;
  }).join("");

  grilla.querySelectorAll("[data-actividad]").forEach(btn=>{
    btn.addEventListener("click", ()=> iniciarActividad(btn.getAttribute("data-actividad")));
  });
}

function iniciarActividad(clave){
  if (!SESION.obtener()){
    Swal.fire({
      icon:"info",
      title: I18N.idiomaActual()==="es" ? "Ingresa primero a tu familia" : "Nayrïr familiaru mantaña",
      confirmButtonText: I18N.idiomaActual()==="es" ? "Ir a ingresar" : "Mantaña",
      confirmButtonColor:"#BF4E30"
    }).then(()=> window.location.href = "login.html");
    return;
  }

  if (clave === "rueda_emociones"){
    window.location.href = "juego-emociones.html";
    return;
  }

  const pasos = PASOS_GUIA[clave];
  const idioma = I18N.idiomaActual();
  const lista = pasos ? pasos[idioma].map((p,i)=>`<li class="mb-2"><strong>${i+1}.</strong> ${p}</li>`).join("") : "";

  Swal.fire({
    title: idioma==="es" ? "Guía de la actividad" : "Anataña yatichawi",
    html: `<ol class="text-start">${lista}</ol>`,
    confirmButtonText: I18N.t("juego_registrar"),
    showCancelButton:true,
    cancelButtonText: idioma==="es" ? "Cerrar" : "Jaytaña",
    confirmButtonColor:"#3D7A5C"
  }).then(async (r)=>{
    if (r.isConfirmed){
      try {
        const actividad = DB.query(`SELECT * FROM actividades WHERE clave=?`,[clave])[0];
        if (!actividad) throw new Error(`Actividad "${clave}" no encontrada.`);
        const resultado = await GAMIF.registrarActividad(SESION.obtener(), clave, actividad.puntos);
        mostrarCelebracion(resultado, actividad.puntos);
      } catch (error){
        console.error("Error al registrar la actividad:", error);
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
  });
}

function mostrarCelebracion(resultado, puntos){
  const idioma = I18N.idiomaActual();
  celebrar(resultado.subioDeNivel ? "grande" : "normal");
  let extra = "";
  if (resultado.subioDeNivel){
    const niv = GAMIF.nivelPorPuntos(resultado.puntosNuevos);
    extra += `<p class="mt-2">🎉 ${idioma==="es" ? "¡Subieron de nivel! Ahora son" : "¡Nivel mistupxta! Jichhax"} <strong>${idioma==="es"?niv.es:niv.ay}</strong></p>`;
  }
  if (resultado.nuevasInsignias.length){
    extra += `<div class="d-flex justify-content-center gap-2 mt-2">` +
      resultado.nuevasInsignias.map(c=>`<div class="medalla" style="width:56px;height:56px;font-size:1.2rem;"><i class="bi ${INSIGNIAS[c].icono}"></i></div>`).join("") +
      `</div>`;
  }
  Swal.fire({
    icon:"success",
    title: `+${puntos} XP`,
    html: `<div class="d-flex justify-content-center gap-3 my-2">
             <span class="moneda-flotante"><i class="bi bi-coin"></i> +${resultado.monedasGanadas}</span>
           </div>
           <p>${idioma==="es" ? "¡Buen trabajo en familia!" : "¡Waliki familiampi!"}</p>${extra}`,
    confirmButtonColor:"#BF4E30"
  }).then(()=> window.location.reload());
}
