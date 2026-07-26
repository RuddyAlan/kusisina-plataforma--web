/* =========================================================================
   db.js — Capa de datos en la nube (Turso / libSQL)
   -------------------------------------------------------------------------
   Antes: sql.js (SQLite-WASM) exportado a localStorage → cada dispositivo
   tenía su propia base aislada, por eso una familia no podía iniciar
   sesión desde un segundo dispositivo.

   Ahora: todas las consultas van por fetch() a la API HTTP de Turso
   (protocolo Hrana v2), así que todos los dispositivos comparten los
   mismos datos. GitHub Pages sigue siendo 100% estático — no hay backend
   propio que mantener.

   IMPORTANTE: DB.query() y DB.run() ahora son ASÍNCRONAS. Todo el código
   que las use debe hacer `await DB.query(...)` / `await DB.run(...)`
   dentro de una función `async`. Esa es la Parte 2 de la migración; las
   siguientes partes actualizan cada archivo que llama a DB.

   Requiere que exista window.KUSI_CONFIG = { tursoUrl, tursoToken }
   definido en js/config.js ANTES de este script (ver Parte 3).
   ========================================================================= */

const DB = (() => {
  let _cfg = null;

  function _config(){
    if (!_cfg){
      if (typeof KUSI_CONFIG === "undefined" || !KUSI_CONFIG.tursoUrl || !KUSI_CONFIG.tursoToken){
        throw new Error("Falta configurar js/config.js con la URL y el token de Turso.");
      }
      _cfg = {
        // La API HTTP usa https:// en vez del esquema libsql://
        url: KUSI_CONFIG.tursoUrl.replace(/^libsql:\/\//, "https://").replace(/\/$/, "") + "/v2/pipeline",
        token: KUSI_CONFIG.tursoToken
      };
    }
    return _cfg;
  }

  /* Contraseñas: nunca se guardan en texto plano. Usamos SubtleCrypto
     (Web Crypto API nativa del navegador, sin librerías externas) con un
     salt aleatorio por familia. clave_hash = SHA-256(salt + clave).
     (Sin cambios respecto a la versión anterior.) */
  function _u8ToHex(u8){
    return Array.from(u8).map(b => b.toString(16).padStart(2,"0")).join("");
  }
  function generarSalt(){
    const arr = new Uint8Array(16);
    crypto.getRandomValues(arr);
    return _u8ToHex(arr);
  }
  async function hashClave(clave, salt){
    const datos = new TextEncoder().encode(salt + ":" + clave);
    const buffer = await crypto.subtle.digest("SHA-256", datos);
    return _u8ToHex(new Uint8Array(buffer));
  }

  /* --- Conversión de valores JS <-> formato "Hrana" que exige Turso --- */
  function _valorHrana(v){
    if (v === null || v === undefined) return { type: "null" };
    if (typeof v === "number") {
      return Number.isInteger(v) ? { type: "integer", value: String(v) } : { type: "float", value: v };
    }
    if (typeof v === "boolean") return { type: "integer", value: v ? "1" : "0" };
    return { type: "text", value: String(v) };
  }
  function _valorJS(celda){
    if (!celda || celda.type === "null") return null;
    switch (celda.type){
      case "integer": return Number(celda.value);
      case "float": return celda.value;
      case "text": return celda.value;
      case "blob": return celda.base64;
      default: return celda.value ?? null;
    }
  }
  function _filasAObjetos(resultado){
    const cols = resultado.cols.map(c => c.name);
    return resultado.rows.map(fila => {
      const obj = {};
      fila.forEach((celda, i) => { obj[cols[i]] = _valorJS(celda); });
      return obj;
    });
  }

  /* Ejecuta una sola sentencia SQL contra Turso y devuelve el "result" crudo. */
  async function _ejecutar(sql, params = []){
    const cfg = _config();
    let respuesta;
    try {
      respuesta = await fetch(cfg.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${cfg.token}`
        },
        body: JSON.stringify({
          requests: [
            { type: "execute", stmt: { sql, args: params.map(_valorHrana) } },
            { type: "close" }
          ]
        })
      });
    } catch (error){
      throw new Error("No se pudo conectar con la base de datos. Revisa tu conexión a internet.");
    }

    if (!respuesta.ok){
      throw new Error(`Error de la base de datos (HTTP ${respuesta.status}).`);
    }

    const datos = await respuesta.json();
    const resultado = datos.results && datos.results[0];
    if (!resultado || resultado.type === "error"){
      const msg = (resultado && resultado.error && resultado.error.message) || "Error desconocido en la base de datos.";
      throw new Error(msg);
    }
    return resultado.response.result;
  }

  /* Comprueba que la configuración y la conexión a Turso funcionan.
     Se llama una vez por página, igual que antes con sql.js. */
  async function init(){
    await _ejecutar("SELECT 1");
    return true;
  }

  /* SELECT: devuelve un array de objetos {columna: valor}, igual que antes. */
  async function query(sql, params = []){
    const resultado = await _ejecutar(sql, params);
    return _filasAObjetos(resultado);
  }

  /* INSERT/UPDATE/DELETE: ya no hace falta llamar a guardar() aparte,
     Turso persiste cada escritura de inmediato. */
  async function run(sql, params = []){
    const resultado = await _ejecutar(sql, params);
    return {
      lastInsertRowid: resultado.last_insert_rowid ? Number(resultado.last_insert_rowid) : null,
      rowsAffected: resultado.affected_row_count || 0
    };
  }

  function generarCodigoFamilia(){
    const letras = "ABCDEFGHJKLMNPQRSTUVWXYZ";
    let cod = "KUSI-";
    for (let i = 0; i < 4; i++) cod += letras[Math.floor(Math.random()*letras.length)];
    return cod;
  }

  return { init, query, run, generarCodigoFamilia, generarSalt, hashClave };
})();
