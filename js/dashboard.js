(async function(){
  if (!requerirSesion()) return;
  if (!(await iniciarDB())) return;

  const famId = SESION.obtener();
  const fam = DB.query(`SELECT * FROM familias WHERE id=?`, [famId])[0];
  if (!fam){ SESION.cerrar(); window.location.href="login.html"; return; }

  const integrantes = DB.query(`SELECT * FROM integrantes WHERE familia_id=?`, [famId]);
  const adulto = integrantes.find(i=>i.rol==="adulto");

  document.getElementById("nombreFamilia").textContent = fam.nombre;
  document.getElementById("codigoFamiliaChip").textContent = fam.codigo;
  document.getElementById("avatarFamilia").textContent = iniciales(fam.nombre);
  document.getElementById("saludoNombre").textContent = adulto ? adulto.nombre : fam.nombre;

  const nivel = GAMIF.nivelPorPuntos(fam.puntos);
  const pct = GAMIF.porcentajeAlSiguiente(fam.puntos);
  document.getElementById("nivelNombre").textContent = I18N.idiomaActual()==="es" ? nivel.es : nivel.ay;
  document.getElementById("barraNivel").style.width = pct + "%";
  document.getElementById("puntosFamilia").textContent = fam.puntos;
  document.getElementById("monedasFamilia").textContent = fam.monedas || 0;
  document.getElementById("rachaFamilia").textContent = fam.racha || 0;

  // --- Recompensas canjeables según monedas actuales ---
  const gridRecompensas = document.getElementById("gridRecompensas");
  gridRecompensas.innerHTML = RECOMPENSAS.map(r=>{
    const lograda = (fam.monedas || 0) >= r.monedas;
    return `
      <div class="col text-center">
        <div class="medalla ${lograda ? "" : "bloqueada"}" style="width:56px;height:56px;font-size:1.3rem;"><i class="bi ${r.icono}"></i></div>
        <div class="small ${lograda ? "text-noche fw-semibold" : "text-muted"}">${I18N.idiomaActual()==="es" ? r.es : r.ay}</div>
        <div class="small font-mono text-ocre"><i class="bi bi-coin"></i> ${r.monedas}</div>
      </div>`;
  }).join("");

  // --- Insignias ---
  const obtenidas = DB.query(`SELECT clave FROM insignias WHERE familia_id=?`, [famId]).map(r=>r.clave);
  const grid = document.getElementById("gridInsignias");
  grid.innerHTML = "";
  Object.entries(INSIGNIAS).forEach(([clave, info])=>{
    const tiene = obtenidas.includes(clave);
    const col = document.createElement("div");
    col.className = "col";
    col.innerHTML = `
      <div class="medalla ${tiene ? "" : "bloqueada"}"><i class="bi ${info.icono}"></i></div>
      <div class="small ${tiene ? "text-noche fw-semibold" : "text-muted"}">${I18N.idiomaActual()==="es" ? info.es : info.ay}</div>
    `;
    grid.appendChild(col);
  });

  // --- Gráfico de progreso: puntos acumulados en el tiempo por categoría ---
  const filas = DB.query(`
    SELECT p.fecha, p.puntos_obtenidos, a.categoria
    FROM progreso p JOIN actividades a ON a.clave = p.actividad_clave
    WHERE p.familia_id = ? ORDER BY p.fecha ASC`, [famId]);

  const categorias = ["emocional","comunicacion","limites","juego"];
  const nombresCat = {emocional:"Emocional", comunicacion:"Comunicación", limites:"Límites", juego:"Juego"};
  const totalesPorCategoria = categorias.map(cat =>
    filas.filter(f=>f.categoria===cat).reduce((s,f)=>s+f.puntos_obtenidos,0)
  );

  new Chart(document.getElementById("graficoProgreso"), {
    type: "bar",
    data: {
      labels: categorias.map(c=>nombresCat[c]),
      datasets: [{
        label: "Puntos por área",
        data: totalesPorCategoria,
        backgroundColor: ["#BF4E30","#E8A33D","#3D7A5C","#A93F65"],
        borderRadius: 8
      }]
    },
    options: {
      plugins:{ legend:{ display:false } },
      scales:{ y:{ beginAtZero:true, ticks:{ precision:0 } } }
    }
  });

  // --- Actividad reciente ---
  const recientes = DB.query(`
    SELECT p.fecha, p.puntos_obtenidos, a.titulo_es, a.titulo_ay, a.icono
    FROM progreso p JOIN actividades a ON a.clave = p.actividad_clave
    WHERE p.familia_id=? ORDER BY p.fecha DESC LIMIT 6`, [famId]);

  const cont = document.getElementById("listaReciente");
  if (!recientes.length){
    cont.innerHTML = `<p class="text-muted small mb-0">${I18N.idiomaActual()==="es" ? "Todavía no jugaron ninguna actividad." : "Janïra anataña utjkiti."}</p>`;
  } else {
    cont.innerHTML = `<table class="table align-middle mb-0">
      <tbody>
        ${recientes.map(r=>`
          <tr>
            <td style="width:40px;"><i class="bi ${r.icono} text-terracota fs-5"></i></td>
            <td>${I18N.idiomaActual()==="es" ? r.titulo_es : r.titulo_ay}</td>
            <td class="text-muted small">${new Date(r.fecha).toLocaleDateString()}</td>
            <td class="text-end font-mono text-verde fw-bold">+${r.puntos_obtenidos}</td>
          </tr>`).join("")}
      </tbody>
    </table>`;
  }
})();
