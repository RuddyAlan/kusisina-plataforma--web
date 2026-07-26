/* =========================================================================
   main.js — Sesión familiar y utilidades compartidas
   ========================================================================= */

/* Overlay de carga reutilizable: se inyecta una sola vez por página y se
   muestra mientras sql.js (WASM) inicializa, ya que puede tardar un
   instante en conexiones lentas. */
const CARGANDO = {
  _el: null,
  mostrar(mensaje){
    if (!this._el){
      this._el = document.createElement("div");
      this._el.id = "kusiCargando";
      this._el.setAttribute("role", "status");
      this._el.setAttribute("aria-live", "polite");
      Object.assign(this._el.style, {
        position:"fixed", inset:"0", zIndex:"2000",
        background:"rgba(22,33,62,0.92)", color:"#F7F1E3",
        display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
        gap:"1rem", fontFamily:"'Work Sans', system-ui, sans-serif", textAlign:"center", padding:"1.5rem"
      });
      this._el.innerHTML = `
        <div class="spinner-border" style="color:#E8A33D;width:3rem;height:3rem;" aria-hidden="true"></div>
        <p class="mb-0" data-kusi-cargando-texto></p>`;
      document.body.appendChild(this._el);
    }
    this._el.querySelector("[data-kusi-cargando-texto]").textContent =
      mensaje || (typeof I18N !== "undefined" && I18N.idiomaActual() === "ay" ? "Wakichaski..." : "Cargando la plataforma...");
    this._el.style.display = "flex";
  },
  ocultar(){
    if (this._el) this._el.style.display = "none";
  }
};

/* Inicializa la base de datos mostrando el overlay de carga y, si algo
   falla (por ejemplo sin conexión a internet, ya que sql.js se carga
   desde un CDN), muestra un error claro con opción de reintentar en vez
   de dejar la página en blanco o silenciosamente rota. */
async function iniciarDB(){
  CARGANDO.mostrar();
  try {
    await DB.init();
    CARGANDO.ocultar();
    return true;
  } catch (error){
    CARGANDO.ocultar();
    const esEs = (typeof I18N === "undefined" || I18N.idiomaActual() === "es");
    await Swal.fire({
      icon: "error",
      title: esEs ? "No se pudo cargar Kusisiña" : "Kusisiña jan wakichaskiti",
      text: esEs
        ? "Revisa tu conexión a internet e inténtalo de nuevo."
        : "Internet ukaru uñjata, yaqhipax wakichaña.",
      confirmButtonText: esEs ? "Reintentar" : "Wasitat lurañani",
      confirmButtonColor: "#BF4E30",
      allowOutsideClick: false
    });
    window.location.reload();
    return false;
  }
}

const SESION = {
  guardar(familiaId){ localStorage.setItem("kusi_sesion_familia", familiaId); },
  obtener(){ return localStorage.getItem("kusi_sesion_familia"); },
  cerrar(){ localStorage.removeItem("kusi_sesion_familia"); }
};

function requerirSesion(){
  if (!SESION.obtener()){
    window.location.href = "login.html";
    return false;
  }
  return true;
}

function iniciales(nombre){
  return (nombre || "?").trim().split(/\s+/).slice(0,2).map(p=>p[0].toUpperCase()).join("");
}

function toast(mensaje, icono = "success"){
  Swal.fire({
    toast:true, position:"top-end", icon:icono, title:mensaje,
    showConfirmButton:false, timer:2600, timerProgressBar:true
  });
}

/* Confeti de celebración (usa canvas-confetti si está cargado en la página).
   Se usa al completar minijuegos, subir de nivel o desbloquear logros. */
function celebrar(intensidad = "normal"){
  if (typeof confetti !== "function") return;
  const colores = ["#BF4E30", "#E8A33D", "#3D7A5C", "#A93F65", "#16213E"];
  if (intensidad === "grande"){
    const fin = Date.now() + 1400;
    (function disparo(){
      confetti({ particleCount: 6, angle: 60, spread: 65, origin:{ x:0 }, colors: colores });
      confetti({ particleCount: 6, angle: 120, spread: 65, origin:{ x:1 }, colors: colores });
      if (Date.now() < fin) requestAnimationFrame(disparo);
    })();
    confetti({ particleCount: 120, spread: 100, origin:{ y:0.6 }, colors: colores });
  } else {
    confetti({ particleCount: 60, spread: 70, origin:{ y:0.6 }, colors: colores });
  }
}

// Botón de idioma + cerrar sesión, presentes en varias páginas
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-accion='alternar-idioma']").forEach(btn=>{
    btn.addEventListener("click", ()=> I18N.alternar());
  });
  document.querySelectorAll("[data-accion='cerrar-sesion']").forEach(btn=>{
    btn.addEventListener("click", (e)=>{
      e.preventDefault();
      Swal.fire({
        title: I18N.idiomaActual()==="es" ? "¿Cerrar sesión familiar?" : "¿Familia sesión jaytañati?",
        icon:"question", showCancelButton:true,
        confirmButtonColor:"#BF4E30",
        confirmButtonText: I18N.idiomaActual()==="es" ? "Sí, salir" : "Jisa",
        cancelButtonText: I18N.idiomaActual()==="es" ? "Cancelar" : "Jan"
      }).then(r=>{
        if (r.isConfirmed){ SESION.cerrar(); window.location.href="index.html"; }
      });
    });
  });
});
