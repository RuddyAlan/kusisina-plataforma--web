/* =========================================================================
   juegos-minijuegos.js — Implementación de cada minijuego del Arcade
   ========================================================================= */

const idi = () => I18N.idiomaActual();
const cont = () => document.getElementById("contenedorJuego");

/* ============================== 1. MEMORAMA ============================= */
function renderMemorama(){
  const pares = DATA_MEMORAMA.slice(0, 6);
  let cartas = barajar([...pares, ...pares].map((p,i)=>({ ...p, uid:i })));
  let volteadas = [], acertadas = 0, intentos = 0, bloqueado = false;

  cont().innerHTML = `
    <div class="text-center mb-3">
      <h2 class="fs-4 text-noche">${idi()==="es" ? "Memorama de Emociones" : "Muspa Memorama"}</h2>
      <p class="text-muted">${idi()==="es" ? "Encuentra las 6 parejas con la menor cantidad de intentos." : "Suxta pareja thaqhaña."}</p>
      <span class="chip-nivel"><i class="bi bi-arrow-repeat"></i> <span id="contadorIntentos">0</span> ${idi()==="es" ? "intentos" : "kutinaka"}</span>
    </div>
    <div class="grid-memorama" id="gridMemorama"></div>
  `;

  const grid = document.getElementById("gridMemorama");
  grid.innerHTML = cartas.map(c => `
    <div class="carta-memoria" data-uid="${c.uid}" data-id="${c.id}">
      <div class="cara cara-atras"><i class="bi bi-question-lg"></i></div>
      <div class="cara cara-frente"><span style="font-size:1.8rem;">${c.emoji}</span><small>${idi()==="es" ? c.es : c.ay}</small></div>
    </div>
  `).join("");

  grid.querySelectorAll(".carta-memoria").forEach(el=>{
    el.addEventListener("click", ()=>{
      if (bloqueado || el.classList.contains("volteada") || el.classList.contains("acertada")) return;
      el.classList.add("volteada");
      volteadas.push(el);
      if (volteadas.length === 2){
        intentos++;
        document.getElementById("contadorIntentos").textContent = intentos;
        bloqueado = true;
        const [a,b] = volteadas;
        if (a.getAttribute("data-id") === b.getAttribute("data-id")){
          a.classList.add("acertada"); b.classList.add("acertada");
          acertadas++;
          volteadas = []; bloqueado = false;
          if (acertadas === pares.length){
            setTimeout(()=> finalizarJuego("memorama_emociones", {
              aciertos: Math.max(0, pares.length*2 - (intentos-pares.length)), total: pares.length*2,
              monedasExtra: intentos <= pares.length + 2 ? 10 : 0
            }), 500);
          }
        } else {
          setTimeout(()=>{
            a.classList.remove("volteada"); b.classList.remove("volteada");
            volteadas = []; bloqueado = false;
          }, 800);
        }
      }
    });
  });
}

/* ====================== 2. IDENTIFICAR EMOCIONES (quiz) ================== */
function renderIdentificar(){ renderQuizGenerico({
  clave:"identificar_emociones",
  titulo: idi()==="es" ? "Identifica la Emoción" : "Muspa Uñt'aña",
  preguntas: DATA_IDENTIFICAR.map(q => ({
    enunciado: (idi()==="es" ? q.texto_es : q.texto_ay) + `  ${q.emoji}`,
    opciones: q.opciones, correcta: q.correcta
  }))
});}

/* ====================== 3. VERDADERO O FALSO ============================= */
function renderVerdaderoFalso(){
  const preguntas = barajar(DATA_VERDADERO_FALSO).slice(0,8);
  let indice = 0, aciertos = 0, vidas = 3;

  cont().innerHTML = `
    <div class="text-center mb-3">
      <h2 class="fs-4 text-noche">${idi()==="es" ? "Verdadero o Falso" : "Cheqa jan Cheqa"}</h2>
      <div class="barra-vidas mb-2" id="vidasVF"></div>
      <span class="chip-nivel">${idi()==="es" ? "Pregunta" : "Jisktʼa"} <span id="numPregVF">1</span>/${preguntas.length}</span>
    </div>
    <div class="mx-auto" style="max-width:560px;">
      <div class="card-kusi p-4 text-center mb-3">
        <p class="fs-5 text-noche" id="enunciadoVF"></p>
      </div>
      <div class="d-flex gap-3 justify-content-center">
        <button class="btn-kusi-verde px-4" data-r="true">${idi()==="es" ? "Verdadero" : "Cheqa"}</button>
        <button class="btn-kusi-primario px-4" data-r="false">${idi()==="es" ? "Falso" : "Jan Cheqa"}</button>
      </div>
      <p class="text-muted small text-center mt-3" id="explicacionVF"></p>
    </div>
  `;
  pintarVidas();
  mostrarPregunta();

  function pintarVidas(){
    document.getElementById("vidasVF").innerHTML =
      [0,1,2].map(i=>`<i class="bi ${i < vidas ? 'bi-heart-fill' : 'bi-heart perdida'}"></i>`).join("");
  }

  function mostrarPregunta(){
    document.getElementById("explicacionVF").textContent = "";
    const q = preguntas[indice];
    document.getElementById("enunciadoVF").textContent = idi()==="es" ? q.es : q.ay;
    document.getElementById("numPregVF").textContent = indice+1;
    cont().querySelectorAll("[data-r]").forEach(b=> b.disabled = false);
  }

  cont().querySelectorAll("[data-r]").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const q = preguntas[indice];
      const respuesta = btn.getAttribute("data-r") === "true";
      const correcto = respuesta === q.verdadero;
      cont().querySelectorAll("[data-r]").forEach(b=> b.disabled = true);
      document.getElementById("explicacionVF").textContent = idi()==="es" ? q.explicacion_es : q.explicacion_ay;
      if (correcto) aciertos++; else vidas--;
      pintarVidas();

      setTimeout(()=>{
        indice++;
        if (vidas <= 0 || indice >= preguntas.length){
          finalizarJuego("verdadero_falso", { aciertos, total: preguntas.length });
        } else {
          mostrarPregunta();
        }
      }, 1400);
    });
  });
}

/* ====================== 4. EMPAREJAR EMOCIONES =========================== */
function renderEmparejar(){
  const pares = DATA_EMPAREJAR;
  const emociones = barajar(pares.map((p,i)=>({ tipo:"emocion", i, texto: idi()==="es" ? p.emocion_es : p.emocion_ay })));
  const situaciones = barajar(pares.map((p,i)=>({ tipo:"situacion", i, texto: idi()==="es" ? p.situacion_es : p.situacion_ay })));
  let seleccion = null, encontrados = 0, errores = 0;

  cont().innerHTML = `
    <div class="text-center mb-3">
      <h2 class="fs-4 text-noche">${idi()==="es" ? "Emparejar Emociones" : "Muspa Chikachaña"}</h2>
      <p class="text-muted">${idi()==="es" ? "Toca una emoción y luego la situación que le corresponde." : "Mä muspa ajllim, ukat situación ukampi chikachaña."}</p>
    </div>
    <div class="row g-4 mx-auto" style="max-width:700px;">
      <div class="col-6 columna-emparejar" id="colEmociones"></div>
      <div class="col-6 columna-emparejar" id="colSituaciones"></div>
    </div>
  `;

  const colE = document.getElementById("colEmociones");
  const colS = document.getElementById("colSituaciones");
  colE.innerHTML = emociones.map(e => `<div class="ficha-emparejar" data-tipo="emocion" data-i="${e.i}">${e.texto}</div>`).join("");
  colS.innerHTML = situaciones.map(s => `<div class="ficha-emparejar" data-tipo="situacion" data-i="${s.i}">${s.texto}</div>`).join("");

  cont().querySelectorAll(".ficha-emparejar").forEach(el=>{
    el.addEventListener("click", ()=>{
      if (el.classList.contains("emparejada")) return;
      if (seleccion && seleccion.tipo === el.getAttribute("data-tipo")){
        // cambia de selección dentro de la misma columna
        seleccion.el.classList.remove("seleccionada");
        seleccion = { el, tipo: el.getAttribute("data-tipo"), i: el.getAttribute("data-i") };
        el.classList.add("seleccionada");
        return;
      }
      if (!seleccion){
        seleccion = { el, tipo: el.getAttribute("data-tipo"), i: el.getAttribute("data-i") };
        el.classList.add("seleccionada");
        return;
      }
      // segunda selección: comparar
      const segundo = { el, tipo: el.getAttribute("data-tipo"), i: el.getAttribute("data-i") };
      if (seleccion.i === segundo.i){
        seleccion.el.classList.remove("seleccionada"); seleccion.el.classList.add("emparejada");
        segundo.el.classList.add("emparejada");
        encontrados++;
        seleccion = null;
        if (encontrados === pares.length){
          setTimeout(()=> finalizarJuego("emparejar_emociones", {
            aciertos: pares.length, total: pares.length, monedasExtra: errores === 0 ? 10 : 0
          }), 400);
        }
      } else {
        errores++;
        el.classList.add("error"); seleccion.el.classList.add("error");
        setTimeout(()=>{
          el.classList.remove("error"); seleccion.el.classList.remove("error", "seleccionada");
          seleccion = null;
        }, 500);
      }
    });
  });
}

/* ====================== 5. ROMPECABEZAS DESLIZANTE ======================= */
function renderRompecabezas(){
  const N = DATA_ROMPECABEZAS.tamano; // 3
  const piezasOrdenadas = [...DATA_ROMPECABEZAS.piezas, null]; // null = espacio vacío
  let piezas = [...piezasOrdenadas];
  let movimientos = 0;

  // Generar un estado mezclado pero siempre resoluble: aplicamos movimientos válidos aleatorios
  for (let i = 0; i < 120; i++){
    const vacio = piezas.indexOf(null);
    const vecinos = indicesVecinos(vacio, N);
    const elegido = vecinos[Math.floor(Math.random()*vecinos.length)];
    [piezas[vacio], piezas[elegido]] = [piezas[elegido], piezas[vacio]];
  }

  cont().innerHTML = `
    <div class="text-center mb-3">
      <h2 class="fs-4 text-noche">${idi()==="es" ? "Rompecabezas Familiar" : "Familia Rompecabezas"}</h2>
      <p class="text-muted">${idi()==="es" ? "Desliza las piezas hasta reconstruir el orden original." : "Piezanaka apasa nayrïr orden ukaru kutt'ayaña."}</p>
      <span class="chip-nivel"><i class="bi bi-arrows-move"></i> <span id="numMovs">0</span> ${idi()==="es" ? "movimientos" : "kutinaka"}</span>
    </div>
    <div class="grid-rompecabezas" id="gridPuzzle"></div>
  `;

  pintar();

  function pintar(){
    const grid = document.getElementById("gridPuzzle");
    grid.innerHTML = piezas.map((p, idx) => `
      <div class="ficha-rompecabezas ${p===null ? 'vacia':''}" data-idx="${idx}">${p===null ? "" : p}</div>
    `).join("");
    grid.querySelectorAll(".ficha-rompecabezas").forEach(el=>{
      el.addEventListener("click", ()=>{
        const idx = Number(el.getAttribute("data-idx"));
        const vacio = piezas.indexOf(null);
        if (indicesVecinos(vacio, N).includes(idx)){
          [piezas[vacio], piezas[idx]] = [piezas[idx], piezas[vacio]];
          movimientos++;
          document.getElementById("numMovs").textContent = movimientos;
          pintar();
          if (piezas.every((p,i) => p === piezasOrdenadas[i])){
            setTimeout(()=> finalizarJuego("rompecabezas_familiar", {
              aciertos: movimientos <= 20 ? 1 : 0, total: 1,
              monedasExtra: movimientos <= 20 ? 12 : 0
            }), 400);
          }
        }
      });
    });
  }

  function indicesVecinos(idx, n){
    const fila = Math.floor(idx/n), col = idx % n, vecinos = [];
    if (fila > 0) vecinos.push(idx-n);
    if (fila < n-1) vecinos.push(idx+n);
    if (col > 0) vecinos.push(idx-1);
    if (col < n-1) vecinos.push(idx+1);
    return vecinos;
  }
}

/* ====================== 6. HISTORIA INTERACTIVA =========================== */
function renderHistoria(){
  let nodoActual = "inicio";
  pintarNodo();

  function pintarNodo(){
    const nodo = DATA_HISTORIA[nodoActual];
    if (nodo.final){
      const emojiFinal = { bueno:"🌟", regular:"🙂", dificil:"💭" }[nodo.tipo] || "🙂";
      cont().innerHTML = `
        <div class="panel-historia text-center mx-auto" style="max-width:620px;">
          <div style="font-size:2.6rem;">${emojiFinal}</div>
          <p class="fs-5 text-noche mt-2">${idi()==="es" ? nodo.texto_es : nodo.texto_ay}</p>
          <button class="btn-kusi-verde mt-3" id="btnFinHistoria">${idi()==="es" ? "Terminar historia" : "Historia tukuyaña"}</button>
        </div>
      `;
      document.getElementById("btnFinHistoria").addEventListener("click", ()=>{
        finalizarJuego("historia_interactiva", { aciertos: nodo.tipo==="bueno" ? 1 : 0, total: 1 });
      });
      return;
    }
    cont().innerHTML = `
      <div class="panel-historia mx-auto" style="max-width:620px;">
        <div class="eyebrow text-terracota mb-2 font-mono small">${idi()==="es" ? "Historia Interactiva" : "Historia"}</div>
        <p class="fs-5 text-noche">${idi()==="es" ? nodo.texto_es : nodo.texto_ay}</p>
        <div class="mt-3" id="opcionesHistoria"></div>
      </div>
    `;
    document.getElementById("opcionesHistoria").innerHTML = nodo.opciones.map((op,i)=>
      `<button class="opcion-historia" data-i="${i}">${idi()==="es" ? op.texto_es : op.texto_ay}</button>`
    ).join("");
    document.querySelectorAll("#opcionesHistoria [data-i]").forEach(btn=>{
      btn.addEventListener("click", ()=>{
        nodoActual = nodo.opciones[Number(btn.getAttribute("data-i"))].ir;
        pintarNodo();
      });
    });
  }
}

/* ============== 7 & 10. ELIGE LA MEJOR DECISIÓN / SITUACIONES ============ */
function renderDecisiones(clave, banco){
  const escenarios = barajar(banco).slice(0, Math.min(5, banco.length));
  let indice = 0, puntajeCalidad = 0;
  const PESO = { buena:2, regular:1, mala:0 };

  mostrarEscenario();

  function mostrarEscenario(){
    const esc = escenarios[indice];
    const opciones = barajar(esc.opciones);
    cont().innerHTML = `
      <div class="text-center mb-2">
        <span class="chip-nivel">${idi()==="es" ? "Situación" : "Lurawi"} ${indice+1}/${escenarios.length}</span>
      </div>
      <div class="tarjeta-decision mx-auto" style="max-width:640px;">
        <p class="fs-5 text-noche">${idi()==="es" ? esc.situacion_es : (esc.situacion_ay || esc.situacion_es)}</p>
        <div id="opcionesDecision" class="mt-3"></div>
        <p class="small text-muted mt-2" id="feedbackDecision"></p>
      </div>
    `;
    document.getElementById("opcionesDecision").innerHTML = opciones.map((op,i)=>
      `<button class="opcion-decision" data-i="${i}">${idi()==="es" ? op.texto_es : (op.texto_ay || op.texto_es)}</button>`
    ).join("");

    document.querySelectorAll("#opcionesDecision [data-i]").forEach(btn=>{
      btn.addEventListener("click", ()=>{
        const op = opciones[Number(btn.getAttribute("data-i"))];
        document.querySelectorAll("#opcionesDecision button").forEach(b=> b.disabled = true);
        btn.classList.add(op.calidad);
        document.getElementById("feedbackDecision").textContent = idi()==="es" ? op.feedback_es : (op.feedback_ay || op.feedback_es);
        puntajeCalidad += PESO[op.calidad];

        setTimeout(()=>{
          indice++;
          if (indice >= escenarios.length){
            const maximo = escenarios.length * 2;
            finalizarJuego(clave, { aciertos: puntajeCalidad, total: maximo });
          } else {
            mostrarEscenario();
          }
        }, 1800);
      });
    });
  }
}

/* ====================== 8. RULETA DE DESAFÍOS ============================ */
function renderRuleta(){
  const desafios = DATA_RULETA;
  cont().innerHTML = `
    <div class="text-center">
      <h2 class="fs-4 text-noche">${idi()==="es" ? "Ruleta de Desafíos" : "Desafío Muyu"}</h2>
      <p class="text-muted mb-4">${idi()==="es" ? "Giren y completen el reto sorpresa en familia." : "Muyuyasa desafío phuqhapxam."}</p>
      <div class="rueda-contenedor">
        <div class="rueda-puntero"></div>
        <svg class="rueda-svg" id="ruedaDesafios" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg"></svg>
      </div>
      <button id="btnGirarDesafio" class="btn-kusi-primario mt-4">${idi()==="es" ? "Girar" : "Muyuyaña"}</button>
      <div class="card-kusi p-4 mt-4 mx-auto d-none" id="cardDesafio" style="max-width:480px;">
        <p class="fs-5 text-noche" id="textoDesafio"></p>
        <button class="btn-kusi-verde w-100" id="btnListoDesafio">${idi()==="es" ? "¡Listo, lo hicimos!" : "¡Phuqhawayxtwa!"}</button>
      </div>
    </div>
  `;

  const svg = document.getElementById("ruedaDesafios");
  const cx=150, cy=150, r=140, paso=360/desafios.length;
  const colores = ["#BF4E30","#E8A33D","#3D7A5C","#A93F65","#16213E","#8AA5A0","#9C3D24","#2E5E46"];
  let html = "";
  desafios.forEach((d,i)=>{
    const a0=(i*paso-90)*Math.PI/180, a1=((i+1)*paso-90)*Math.PI/180;
    const x0=cx+r*Math.cos(a0), y0=cy+r*Math.sin(a0), x1=cx+r*Math.cos(a1), y1=cy+r*Math.sin(a1);
    html += `<path d="M${cx},${cy} L${x0},${y0} A${r},${r} 0 0,1 ${x1},${y1} Z" fill="${colores[i%colores.length]}" stroke="#F7F1E3" stroke-width="2"/>`;
  });
  html += `<circle cx="${cx}" cy="${cy}" r="24" fill="#16213E" stroke="#F7F1E3" stroke-width="3"/>`;
  svg.innerHTML = html;

  let anguloAcumulado = 0;
  document.getElementById("btnGirarDesafio").addEventListener("click", function(){
    this.disabled = true;
    const indiceGanador = Math.floor(Math.random()*desafios.length);
    const vueltas = 5 + Math.floor(Math.random()*3);
    const anguloSector = indiceGanador*paso + paso/2;
    anguloAcumulado += vueltas*360 + (360 - anguloSector);
    svg.style.transform = `rotate(${anguloAcumulado}deg)`;

    setTimeout(()=>{
      const d = desafios[indiceGanador];
      document.getElementById("textoDesafio").innerHTML = `<i class="bi ${d.icono} text-terracota me-2"></i>` + (idi()==="es" ? d.es : d.ay);
      document.getElementById("cardDesafio").classList.remove("d-none");
      document.getElementById("btnListoDesafio").onclick = ()=> finalizarJuego("ruleta_desafios", { monedasExtra: 5 });
    }, 3300);
  });
}

/* ====================== 9. TRIVIA FAMILIAR (con tiempo) =================== */
function renderTrivia(){
  const preguntas = barajar(DATA_TRIVIA).slice(0, 8).map(q => ({
    enunciado: q.pregunta_es, opciones: q.opciones, correcta: q.correcta
  }));
  renderQuizGenerico({ clave:"trivia_familiar", titulo: idi()==="es" ? "Trivia Familiar" : "Familia Trivia", preguntas, conTiempo:true });
}

/* ====================== Motor genérico de quiz (usado por 3 juegos) ====== */
function renderQuizGenerico({ clave, titulo, preguntas, conTiempo=false }){
  let indice = 0, aciertos = 0, temporizador = null, segundos = 15;

  cont().innerHTML = `
    <div class="text-center mb-3">
      <h2 class="fs-4 text-noche">${titulo}</h2>
      <div class="d-flex justify-content-center gap-3 align-items-center">
        <span class="chip-nivel">${idi()==="es" ? "Pregunta" : "Jisktʼa"} <span id="numPreg">1</span>/${preguntas.length}</span>
        ${conTiempo ? `<span class="chip-nivel" style="background:var(--terracota);"><i class="bi bi-stopwatch"></i> <span id="tiempoRestante">15</span>s</span>` : ""}
      </div>
    </div>
    <div class="mx-auto" style="max-width:560px;">
      <div class="card-kusi p-4 mb-3 text-center">
        <p class="fs-5 text-noche mb-0" id="enunciadoQuiz"></p>
      </div>
      <div id="opcionesQuiz"></div>
    </div>
  `;

  mostrarPregunta();

  function mostrarPregunta(){
    clearInterval(temporizador);
    const q = preguntas[indice];
    document.getElementById("enunciadoQuiz").textContent = q.enunciado;
    document.getElementById("numPreg").textContent = indice+1;
    document.getElementById("opcionesQuiz").innerHTML = q.opciones.map((op,i)=>
      `<button class="opcion-quiz" data-i="${i}">${op}</button>`
    ).join("");
    document.querySelectorAll("#opcionesQuiz [data-i]").forEach(btn=>{
      btn.addEventListener("click", ()=> responder(Number(btn.getAttribute("data-i"))));
    });

    if (conTiempo){
      segundos = 15;
      document.getElementById("tiempoRestante").textContent = segundos;
      temporizador = setInterval(()=>{
        segundos--;
        document.getElementById("tiempoRestante").textContent = segundos;
        if (segundos <= 0){ clearInterval(temporizador); responder(-1); }
      }, 1000);
    }
  }

  function responder(iElegida){
    clearInterval(temporizador);
    const q = preguntas[indice];
    document.querySelectorAll("#opcionesQuiz button").forEach((b,i)=>{
      b.disabled = true;
      if (i === q.correcta) b.classList.add("correcta");
      else if (i === iElegida) b.classList.add("incorrecta");
    });
    if (iElegida === q.correcta) aciertos++;

    setTimeout(()=>{
      indice++;
      if (indice >= preguntas.length){
        finalizarJuego(clave, { aciertos, total: preguntas.length });
      } else {
        mostrarPregunta();
      }
    }, 1100);
  }
}
