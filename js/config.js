/* =========================================================================
   config.js — Credenciales de conexión a Turso (libSQL)
   -------------------------------------------------------------------------
   Este archivo debe cargarse ANTES que js/db.js en cada página HTML.

   ⚠️ Como GitHub Pages es 100% estático, este token queda visible en el
   código fuente público del sitio (lo hablamos antes de empezar). Si algún
   día notas actividad rara en tu base de Turso, puedes revocar este token
   y generar uno nuevo con:
       turso db tokens create kusisina
   y reemplazarlo aquí.
   ========================================================================= */

const KUSI_CONFIG = {
  tursoUrl: "libsql://kusisina-faras.aws-us-east-1.turso.io",
  tursoToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJleHAiOjE4NDgxODc4MzUsImlhdCI6MTc4NTAyOTQzNSwiaWQiOiIwMTlmOWE4My00MzAxLTcxMTgtOTQ4YS0zNjZkM2U0MzNiZWEiLCJraWQiOiJkLWo1LWNmSWcweVZiWXNFVDFPWHN1dGhvblJyQ0M2d0dwUGxKMkZhUHRJIiwicmlkIjoiZDM3NDAyOTUtZTlmMy00MWIwLWFhM2EtNzVmMzY4ZjFhZTQzIn0.2-F-cZIIHZtN-7C6R5kiyxvFaL6eUEOZQVBce-1TFJIPnbDTbF8ADOU2r9qK4SOQocNuBhyN80gPh_2lBKDEAQ"
};
