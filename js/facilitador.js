/* =========================================================================
   facilitador.js — Panel agregado de familias para facilitadores comunitarios
   -------------------------------------------------------------------------
   NOTA DE ARQUITECTURA: como no hay backend, este panel lee la misma base
   SQLite (sql.js) guardada en el localStorage de ESTE navegador/dispositivo.
   Es el escenario de un taller presencial: la facilitadora lleva su laptop
   o tablet y las familias se registran ahí mismo durante la sesión. Para un
   despliegue municipal con muchas facilitadoras y dispositivos distintos,
   esta capa debería apuntar a una API con una base de datos central
   (por ejemplo el mismo esquema, pero servido desde SQLite/Postgres en un
   servidor), manteniendo el resto del panel sin cambios.

   El PIN de acceso es solo una barrera básica para uso en taller (evita que
   una familia entre por error); NO es autenticación segura para producción.
   ========================================================================= */

const PIN_FACILITADOR_DEMO = "KUSI-FACILITA";
let TODAS_LAS_FAMILIAS = [];
let filtroTexto = "";
let filtroMunicipio = "todos";
let filtroEstado = "todos";
let chartNiveles = null;
let chartActividades = null;

document.getElementById("formAcceso").addEventListener("submit", (e)=>{
  e.preventDefault();
  const pin = document.getElementById("pinAcceso").value.trim().toUpperCase();
  if (pin === PIN_FACILITADOR_DEMO){
    sessionStorage.setItem("kusi_facilitador_ok", "1");
    abrirPanel();
  } else {
    Swal.fire(I18N.idiomaActual()==="es" ? "Código incorrecto" : "Código jan walikiti", "", "error");
  }
});

document.addEventListener("DOMContentLoaded", ()=>{
  if (sessionStorage.getItem("kusi_facilitador_ok") === "1") abrirPanel();
});

async function abrirPanel(){
  document.getElementById("compuertaAcceso").classList.add("d-none");
  document.getElementById("panelFacilitador").classList.remove("d-none");
  if (!(await iniciarDB())) return;
  await cargarDatos();

  document.getElementById("buscarFamilia").addEventListener("input", (e)=>{
    filtroTexto = e.target.value.toLowerCase();
    renderTabla();
  });
  document.getElementById("filtroMunicipio").addEventListener("change", (e)=>{
    filtroMunicipio = e.target.value; renderTabla();
  });
  document.getElementById("filtroEstado").addEventListener("change", (e)=>{
    filtroEstado = e.target.value; renderTabla();
  });
  document.getElementById("btnExportar").addEventListener("click", exportarCSV);
}

function diasDesde(fechaStr){
  if (!fechaStr) return Infinity;
  const hoy = new Date();
  const fecha = new Date(fechaStr);
  return Math.floor((hoy - fecha) / (1000*60*60*24));
}

function estadoFamilia(fam){
  if (!fam.ultima_actividad) return "nueva";
  return diasDesde(fam.ultima_actividad) > 7 ? "atencion" : "activa";
}

function etiquetaEstado(estado){
  const idioma = I18N.idiomaActual();
  const mapa = {
    activa:   { texto: idioma==="es" ? "Activa" : "Anataski", clase:"bg-verde" },
    atencion: { texto: idioma==="es" ? "Necesita seguimiento" : "Yanapt'aña munapxi", clase:"bg-terracota" },
    nueva:    { texto: idioma==="es" ? "Recién registrada" : "Jichha qillqantata", clase:"bg-noche" }
  };
  return mapa[estado];
}

async function cargarDatos(){
  TODAS_LAS_FAMILIAS = DB.query(`SELECT * FROM familias ORDER BY creada DESC`);
  renderKPIs();
  renderGraficos();
  renderTabla();
}

function renderKPIs(){
  const total = TODAS_LAS_FAMILIAS.length;
  const puntosProm = total ? Math.round(TODAS_LAS_FAMILIAS.reduce((s,f)=>s+f.puntos,0) / total) : 0;
  const totalActividades = DB.query(`SELECT COUNT(*) c FROM progreso`)[0].c;
  const necesitanAtencion = TODAS_LAS_FAMILIAS.filter(f => estadoFamilia(f) === "atencion").length;

  document.getElementById("kpiFamilias").textContent = total;
  document.getElementById("kpiPuntos").textContent = puntosProm;
  document.getElementById("kpiActividades").textContent = totalActividades;
  document.getElementById("kpiAtencion").textContent = necesitanAtencion;
}

function renderGraficos(){
  // Distribución por nivel
  const conteoNiveles = NIVELES.map(niv => TODAS_LAS_FAMILIAS.filter(f => GAMIF.nivelPorPuntos(f.puntos).n === niv.n).length);
  if (chartNiveles) chartNiveles.destroy();
  chartNiveles = new Chart(document.getElementById("graficoNiveles"), {
    type: "doughnut",
    data: {
      labels: NIVELES.map(n => I18N.idiomaActual()==="es" ? n.es : n.ay),
      datasets: [{ data: conteoNiveles, backgroundColor: ["#E8A33D","#3D7A5C","#BF4E30","#A93F65"] }]
    },
    options: { plugins:{ legend:{ position:"bottom", labels:{ boxWidth:12 } } } }
  });

  // Actividades más jugadas (conteo agregando todas las familias)
  const filas = DB.query(`
    SELECT a.titulo_es, COUNT(*) total
    FROM progreso p JOIN actividades a ON a.clave = p.actividad_clave
    GROUP BY a.clave ORDER BY total DESC`);
  if (chartActividades) chartActividades.destroy();
  chartActividades = new Chart(document.getElementById("graficoActividades"), {
    type: "bar",
    data: {
      labels: filas.map(f=>f.titulo_es),
      datasets: [{ data: filas.map(f=>f.total), backgroundColor:"#BF4E30", borderRadius:8 }]
    },
    options: {
      indexAxis:"y",
      plugins:{ legend:{ display:false } },
      scales:{ x:{ beginAtZero:true, ticks:{ precision:0 } } }
    }
  });
}

function renderTabla(){
  const idioma = I18N.idiomaActual();
  const tbody = document.getElementById("tablaFamilias");
  const mensajeVacio = document.getElementById("mensajeSinFamilias");

  let filtradas = TODAS_LAS_FAMILIAS.filter(f=>{
    const coincideTexto = f.nombre.toLowerCase().includes(filtroTexto) || f.codigo.toLowerCase().includes(filtroTexto);
    const coincideMunicipio = filtroMunicipio === "todos" || f.municipio === filtroMunicipio;
    const coincideEstado = filtroEstado === "todos" || estadoFamilia(f) === filtroEstado;
    return coincideTexto && coincideMunicipio && coincideEstado;
  });

  if (!TODAS_LAS_FAMILIAS.length){
    tbody.innerHTML = "";
    mensajeVacio.classList.remove("d-none");
    return;
  }
  mensajeVacio.classList.add("d-none");

  tbody.innerHTML = filtradas.map(f=>{
    const nivel = GAMIF.nivelPorPuntos(f.puntos);
    const estado = estadoFamilia(f);
    const et = etiquetaEstado(estado);
    const ultima = f.ultima_actividad ? new Date(f.ultima_actividad).toLocaleDateString() : "—";
    return `
      <tr>
        <td>
          <div class="d-flex align-items-center gap-2">
            <div class="avatar-familia" style="width:36px;height:36px;font-size:.8rem;">${iniciales(f.nombre)}</div>
            <div>
              <div class="fw-semibold text-noche">${f.nombre}</div>
              <div class="small text-muted font-mono">${f.codigo} · ${f.municipio || "—"}</div>
            </div>
          </div>
        </td>
        <td><span class="chip-nivel">${idioma==="es" ? nivel.es : nivel.ay}</span></td>
        <td class="font-mono">${f.puntos}</td>
        <td class="small text-muted">${ultima}</td>
        <td><span class="badge ${et.clase}">${et.texto}</span></td>
        <td class="text-end"><button class="btn btn-sm btn-kusi-secundario" data-ver="${f.id}"><i class="bi bi-eye"></i> ${I18N.t("fac_verDetalle")}</button></td>
      </tr>`;
  }).join("");

  tbody.querySelectorAll("[data-ver]").forEach(btn=>{
    btn.addEventListener("click", ()=> verDetalleFamilia(Number(btn.getAttribute("data-ver"))));
  });
}

function verDetalleFamilia(familiaId){
  const idioma = I18N.idiomaActual();
  const fam = TODAS_LAS_FAMILIAS.find(f=>f.id===familiaId);
  const integrantes = DB.query(`SELECT * FROM integrantes WHERE familia_id=?`, [familiaId]);
  const historial = DB.query(`
    SELECT p.fecha, p.puntos_obtenidos, a.titulo_es, a.titulo_ay
    FROM progreso p JOIN actividades a ON a.clave = p.actividad_clave
    WHERE p.familia_id=? ORDER BY p.fecha DESC LIMIT 8`, [familiaId]);
  const insigniasFam = DB.query(`SELECT clave FROM insignias WHERE familia_id=?`, [familiaId]).map(r=>r.clave);

  const listaIntegrantes = integrantes.map(i =>
    `<li>${i.rol === "adulto" ? "👤" : "🧒"} ${i.nombre}${i.edad ? " · " + i.edad + " años" : ""}</li>`
  ).join("");

  const listaHistorial = historial.length
    ? historial.map(h => `<li>${idioma==="es" ? h.titulo_es : h.titulo_ay} — <span class="text-muted small">${new Date(h.fecha).toLocaleDateString()}</span> <strong class="text-verde">+${h.puntos_obtenidos}</strong></li>`).join("")
    : `<li class="text-muted">${idioma==="es" ? "Sin actividades todavía." : "Janïra anataña utjkiti."}</li>`;

  const listaInsignias = insigniasFam.length
    ? insigniasFam.map(c => `<span class="badge bg-ocre text-noche me-1"><i class="bi ${INSIGNIAS[c].icono}"></i> ${idioma==="es" ? INSIGNIAS[c].es : INSIGNIAS[c].ay}</span>`).join("")
    : `<span class="text-muted small">${idioma==="es" ? "Sin insignias todavía." : "Janïra insignia utjkiti."}</span>`;

  Swal.fire({
    title: fam.nombre,
    width: 560,
    html: `
      <div class="text-start">
        <p class="small text-muted mb-2 font-mono">${fam.codigo} · ${fam.municipio || "—"}</p>
        <h6 class="text-noche mb-1">${idioma==="es" ? "Integrantes" : "Familia jaqinaka"}</h6>
        <ul class="mb-3">${listaIntegrantes}</ul>
        <h6 class="text-noche mb-1">${idioma==="es" ? "Insignias" : "Insignianaka"}</h6>
        <div class="mb-3">${listaInsignias}</div>
        <h6 class="text-noche mb-1">${idioma==="es" ? "Actividad reciente" : "Jichha anataw"}</h6>
        <ul class="mb-0">${listaHistorial}</ul>
      </div>
    `,
    confirmButtonText: idioma==="es" ? "Cerrar" : "Jaytaña",
    confirmButtonColor:"#16213E"
  });
}

function exportarCSV(){
  const encabezado = ["Familia","Codigo","Municipio","Nivel","Puntos","Racha","UltimaActividad","Estado"];
  const filas = TODAS_LAS_FAMILIAS.map(f=>{
    const nivel = GAMIF.nivelPorPuntos(f.puntos);
    const estado = etiquetaEstado(estadoFamilia(f)).texto;
    return [f.nombre, f.codigo, f.municipio || "", nivel.es, f.puntos, f.racha || 0, f.ultima_actividad || "", estado];
  });
  const csv = [encabezado, ...filas].map(fila => fila.map(v => `"${String(v).replace(/"/g,'""')}"`).join(",")).join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `kusisiña-familias-${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
