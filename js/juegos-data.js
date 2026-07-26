/* =========================================================================
   juegos-data.js — Contenido de los minijuegos educativos
   ========================================================================= */

/* ---------- 1. Memorama de Emociones ---------- */
const DATA_MEMORAMA = [
  { id:"alegria",  emoji:"😄", es:"Alegría",  ay:"Kusisiña" },
  { id:"tristeza", emoji:"😢", es:"Tristeza", ay:"Llakisiña" },
  { id:"enojo",    emoji:"😠", es:"Enojo",    ay:"Phiñasiña" },
  { id:"miedo",    emoji:"😨", es:"Miedo",    ay:"Axsarasiña" },
  { id:"sorpresa", emoji:"😲", es:"Sorpresa", ay:"Muspa" },
  { id:"calma",    emoji:"😌", es:"Calma",    ay:"Qasi Chuyma" }
];

/* ---------- 2. Identifica la Emoción ---------- */
const DATA_IDENTIFICAR = [
  { emoji:"😄", texto_es:"Mateo saltó de alegría cuando su equipo ganó el partido.", texto_ay:"Mateox anataw atipasa kusisitawa.",
    opciones:["Alegría","Tristeza","Enojo","Miedo"], correcta:0 },
  { emoji:"😢", texto_es:"A Wara se le cayeron las lágrimas cuando perdió su muñeca favorita.", texto_ay:"Warax muñecapa chhaqhayasa jachi.",
    opciones:["Sorpresa","Calma","Tristeza","Alegría"], correcta:2 },
  { emoji:"😠", texto_es:"Iván apretó los puños cuando su hermano rompió su dibujo.", texto_ay:"Ivánax jilaparuw phiñasiwayxi dibujopa t'unjatapata.",
    opciones:["Enojo","Miedo","Alegría","Calma"], correcta:0 },
  { emoji:"😨", texto_es:"Camila se escondió detrás de su mamá al escuchar un trueno fuerte.", texto_ay:"Camilax taykapa qhipar imantasi q'axu istʼasa.",
    opciones:["Alegría","Miedo","Sorpresa","Enojo"], correcta:1 },
  { emoji:"😲", texto_es:"A Rubén se le abrieron los ojos grandes al ver la torta de cumpleaños.", texto_ay:"Rubénan nayrapax jach'a jaqhtayasiwayxi tortaru uñjasa.",
    opciones:["Tristeza","Miedo","Sorpresa","Enojo"], correcta:2 },
  { emoji:"😌", texto_es:"Después de respirar profundo tres veces, Sofía se sintió tranquila otra vez.", texto_ay:"Kimsa kutin samsusa, Sofíax qasi chuymani kutt'awayxi.",
    opciones:["Calma","Enojo","Tristeza","Sorpresa"], correcta:0 },
  { emoji:"😠", texto_es:"Diego cerró la puerta fuerte porque no lo dejaron jugar más con la pelota.", texto_ay:"Diegox punku ch'amat jist'antayxi pelotampi jan anatayañataki.",
    opciones:["Alegría","Enojo","Sorpresa","Calma"], correcta:1 },
  { emoji:"😢", texto_es:"Ariana se quedó callada y con la cabeza baja después de que sus amigas no la invitaron a jugar.", texto_ay:"Arianax jan arsusa p'iqi aynachar apasa qhipaykiwayxi.",
    opciones:["Tristeza","Alegría","Sorpresa","Miedo"], correcta:0 }
];

/* ---------- 3. Verdadero o Falso: Crianza sin Violencia ---------- */
const DATA_VERDADERO_FALSO = [
  { es:"Poner límites con calma es más efectivo a largo plazo que gritar o golpear.", ay:"Qasi chuymampi amtayaña wal walikïskiwa jan qhiswarakisa.",
    verdadero:true, explicacion_es:"Los límites claros y calmados ayudan a que el niño entienda y confíe, sin miedo.", explicacion_ay:"Sum amtanakax wawaru yatichi jan axsarayasa." },
  { es:"Un golpe a tiempo 'corrige' mejor que una conversación.", ay:"Mä jaqʼu pachapan 'walt'ayi' parlawi sipansa.",
    verdadero:false, explicacion_es:"El castigo físico no enseña la conducta deseada: solo genera miedo y puede dañar el vínculo.", explicacion_ay:"Usuchäwix jan yatichkiti, axsarayakiwa." },
  { es:"Nombrar lo que sentimos ('estoy enojado') ayuda a manejar mejor la emoción.", ay:"Kuna muspa ukax sutichañax wal yanapt'i.",
    verdadero:true, explicacion_es:"Poner en palabras una emoción reduce su intensidad y facilita pedir ayuda.", explicacion_ay:"Arunakan muspa apstʼañax jukʼachi." },
  { es:"Los niños que juegan con sus padres desarrollan menos conductas agresivas.", ay:"Awkinakapampi anatir wawanakax jukʼa phiñasiñani.",
    verdadero:true, explicacion_es:"El vínculo de juego fortalece la comunicación y reduce la frustración acumulada.", explicacion_ay:"Anatawix chikachaw ch'amañchi." },
  { es:"Gritar siempre asusta al niño lo suficiente como para que no repita la conducta.", ay:"Qhiswaraña taqpachanx wawa axsarayi jan wasitatañapataki.",
    verdadero:false, explicacion_es:"Gritar puede detener la conducta un momento, pero no enseña una alternativa y genera miedo o desconfianza.", explicacion_ay:"Qhiswarañax jan yatichkiti, axsarayakiwa." },
  { es:"El estrés de la persona adulta puede influir en cómo reacciona ante su hijo o hija.", ay:"Jach'a jaqin estrés ukax wawaru kunjams jaysañapatakisa yänaqi.",
    verdadero:true, explicacion_es:"Por eso cuidar el descanso y el apoyo de quien cría también previene la violencia.", explicacion_ay:"Ukatwa jach'a jaqix samarañapasa yänaqi." },
  { es:"Un acuerdo familiar escrito en positivo funciona mejor que una lista de prohibiciones.", ay:"Familia amtawi positivo qillqata sipansa walikïspawa.",
    verdadero:true, explicacion_es:"Decir qué SÍ hacer da una guía clara, en vez de solo marcar lo prohibido.", explicacion_ay:"Kunas lurañas ukax sum yatichi." },
  { es:"Comparar a un hijo con su hermano ayuda a que se esfuerce más.", ay:"Wawaru jilaparampi chikachañax askicharu chʼamañchi.",
    verdadero:false, explicacion_es:"Comparar suele dañar la autoestima y la relación entre hermanos, en vez de motivar.", explicacion_ay:"Chikachañax autoestima usuchi." },
  { es:"Está bien que una persona adulta pida disculpas a un niño cuando se equivoca.", ay:"Jach'a jaqix pantjasa wawaru perdón mayiñax walikiwa.",
    verdadero:true, explicacion_es:"Modela el respeto y enseña que equivocarse y reparar es parte de las relaciones sanas.", explicacion_ay:"Ukax respeto uñachayi." },
  { es:"La violencia física en la crianza es un método aprobado por la ley en Bolivia.", ay:"Uywañana usuchäwix Bolivia leyin walikiwa.",
    verdadero:false, explicacion_es:"Bolivia cuenta con leyes que protegen a niñas, niños y adolescentes contra el castigo físico y humillante.", explicacion_ay:"Boliviana leyinakapax wawanak jark'aski." }
];

/* ---------- 4. Emparejar Emociones (situación ↔ emoción) ---------- */
const DATA_EMPAREJAR = [
  { emocion_es:"Alegría",  emocion_ay:"Kusisiña",   situacion_es:"Recibir un abrazo sorpresa de mamá",        situacion_ay:"Taykata muspa munasiña katuqaña" },
  { emocion_es:"Tristeza", emocion_ay:"Llakisiña",  situacion_es:"Que se rompa tu juguete favorito",           situacion_ay:"Munat anataw t'unjasi" },
  { emocion_es:"Enojo",    emocion_ay:"Phiñasiña",  situacion_es:"Que alguien te quite algo sin pedir permiso", situacion_ay:"Yaqha jaqix jan mayisa apsuña" },
  { emocion_es:"Miedo",    emocion_ay:"Axsarasiña", situacion_es:"Quedarse solo/a en la oscuridad",             situacion_ay:"Ch'amakan sapaki qhiparaña" },
  { emocion_es:"Sorpresa", emocion_ay:"Muspa",       situacion_es:"Una fiesta que no esperabas",                 situacion_ay:"Jan amuyat phista" },
  { emocion_es:"Calma",    emocion_ay:"Qasi Chuyma", situacion_es:"Escuchar una canción tranquila con la familia", situacion_ay:"Familiampi qasi taki istʼaña" }
];

/* ---------- 5. Rompecabezas Familiar (8-puzzle deslizante) ---------- */
const DATA_ROMPECABEZAS = {
  tamano: 3,
  piezas: ["🌳","🏠","👨‍👩‍👧‍👦","☀️","🌻","🦙","⭐", "🎈"] // 8 piezas + 1 espacio vacío
};

/* ---------- 6. Historia Interactiva: Un Día en Casa ---------- */
const DATA_HISTORIA = {
  inicio: {
    texto_es:"Después del colegio, tu hijo llega enojado porque un compañero se burló de él. Tira la mochila al piso.",
    texto_ay:"Colegiot kutʼasa, wawamax phiñasita puriwayxi, mä amigopax burlasitapata.",
    opciones:[
      { texto_es:"Le preguntas con calma qué pasó, antes de hablar de la mochila.", texto_ay:"Qasi chuymampi jisktʼta kuns pasawayi.", ir:"nodoCalma" },
      { texto_es:"Le retas de inmediato por tirar la mochila.", texto_ay:"Jichhaki reta mochila apthapisa.", ir:"nodoReto" }
    ]
  },
  nodoCalma: {
    texto_es:"Tu hijo te cuenta lo que pasó y, poco a poco, se calma mientras habla contigo.",
    texto_ay:"Wawamax kuns pasawayi parlaskiri, jukʼamp jukʼat qasi chuymani jikxatasi.",
    opciones:[
      { texto_es:"Juntos piensan qué puede decirle a su compañero mañana.", texto_ay:"Chikachasa amuyapxta kunas amigoparu qhipa uru sasaru sasa.", ir:"finalBueno" },
      { texto_es:"Le dices que la próxima vez recoja la mochila primero.", texto_ay:"Sasktama qhipa kutix mochila apthapiñapa.", ir:"finalRegular" }
    ]
  },
  nodoReto: {
    texto_es:"Tu hijo agacha la cabeza, recoge la mochila en silencio y no te cuenta lo que le pasó.",
    texto_ay:"Wawamax p'iqi aynacharu apasa, ch'amakat mochila apthapi, jan kuns willaski.",
    opciones:[
      { texto_es:"Te das cuenta y te acercas a preguntarle con calma qué le pasó.", texto_ay:"Amuyasita, jak'achasita qasi chuymampi jisktʼta.", ir:"finalRegular" },
      { texto_es:"Sigues con tus tareas, pensando que ya se le pasará solo.", texto_ay:"Lurawinakama sarantayta, sapakiw thuqurpayaniw sasa.", ir:"finalDificil" }
    ]
  },
  finalBueno: {
    final:true, tipo:"bueno",
    texto_es:"Tu hijo se siente escuchado y aprende que puede contarte lo que le pasa, incluso cuando está enojado. El vínculo se fortalece.",
    texto_ay:"Wawamax istʼatawa uñjasi, yatiqi jumar willañ atʼamawa, phiñasitäskchisa. Munasiñax chʼamañchi."
  },
  finalRegular: {
    final:true, tipo:"regular",
    texto_es:"Tu hijo se calma, pero se queda con la sensación de que lo importante fue la mochila y no cómo se sentía. Aun así, mañana puede volver a contarte otras cosas.",
    texto_ay:"Wawamax qasi chuymani jikxatasi, ukampirus mochila mä importante amuyasi. Ukampis qhipa urunx wasitat willaskaspawa."
  },
  finalDificil: {
    final:true, tipo:"dificil",
    texto_es:"Tu hijo aprende que, cuando algo le duele, es mejor quedarse callado. La próxima vez, puede costarle más contarte lo que siente.",
    texto_ay:"Wawamax yatiqi, kuns usutäskchi ukhax, ch'amakat qhiparañ askïskchi sasa. Qhipa kutix jukʼamp ch'amäspawa willañataki."
  }
};

/* ---------- 7. Elige la Mejor Decisión ---------- */
const DATA_DECISIONES = [
  { situacion_es:"Tu hija de 6 años no quiere guardar sus juguetes antes de dormir.", situacion_ay:"6 maranin phuchhamax jan anatäwinak imañ muni jayp'ur.",
    opciones:[
      { texto_es:"Le gritas y le dices que si no guarda, no habrá cuentos esta noche.", calidad:"mala", feedback_es:"Amenazar genera miedo, no el hábito. Además, quita un momento de conexión importante (el cuento)." },
      { texto_es:"Guardan los juguetes juntos, cantando una canción para hacerlo divertido.", calidad:"buena", feedback_es:"Convertir la tarea en juego enseña el hábito sin pelea y fortalece el vínculo." },
      { texto_es:"Los guardas tú misma/o para evitar el conflicto.", calidad:"regular", feedback_es:"Evita el conflicto hoy, pero no ayuda a que tu hija aprenda a hacerlo." }
    ]
  },
  { situacion_es:"Tu hijo adolescente llega 40 minutos tarde a casa sin avisar.", situacion_ay:"Wawamax tallar phuqhata 40 minuto qhiparusa utaru puri, jan willasa.",
    opciones:[
      { texto_es:"Lo castigas sin dejarlo salir por un mes, sin escuchar qué pasó.", calidad:"mala", feedback_es:"Un castigo muy largo sin diálogo previo puede generar resentimiento y ocultamiento futuro." },
      { texto_es:"Le expresas tu preocupación, escuchas su explicación y acuerdan juntos avisar la próxima vez.", calidad:"buena", feedback_es:"Combina el límite claro con el diálogo: se sostiene la confianza y la responsabilidad." },
      { texto_es:"No dices nada para no generar un conflicto.", calidad:"regular", feedback_es:"Evitar el tema no ayuda a poner el límite necesario sobre avisar a tiempo." }
    ]
  },
  { situacion_es:"Durante la cena, tu hijo menor tira accidentalmente un vaso de agua.", situacion_ay:"Manqʼa pachan, sullka wawamax vaso umampi jaqhuntayi.",
    opciones:[
      { texto_es:"Le dices 'no pasa nada' y juntos limpian.", calidad:"buena", feedback_es:"Diferenciar accidentes de conductas intencionales evita culpa innecesaria y enseña a reparar." },
      { texto_es:"Lo regañas por 'torpe' delante de toda la familia.", calidad:"mala", feedback_es:"Etiquetar ('torpe') puede dañar la autoestima por un simple accidente." },
      { texto_es:"No dices nada, pero tu cara muestra molestia todo el resto de la cena.", calidad:"regular", feedback_es:"El niño puede notar la tensión igual, aunque no haya palabras. Nombrar y soltar ayuda más." }
    ]
  },
  { situacion_es:"Dos hermanos pelean por el control de la tele.", situacion_ay:"Pä jilat kullakanakax control televisiónatak nuwasipxi.",
    opciones:[
      { texto_es:"Apagas la tele y los mandas a cuartos separados sin hablar del tema.", calidad:"regular", feedback_es:"Detiene la pelea, pero no enseña a resolver el conflicto entre ellos." },
      { texto_es:"Les ayudas a proponer un acuerdo de turnos, y ellos deciden el orden.", calidad:"buena", feedback_es:"Enseña negociación y resolución de conflictos, una habilidad para toda la vida." },
      { texto_es:"Decides tú quién la usa, según quién se portó mejor hoy.", calidad:"mala", feedback_es:"Usar el 'buen comportamiento' como premio/castigo puede generar rivalidad entre hermanos." }
    ]
  },
  { situacion_es:"Tu hija te muestra un dibujo que hizo, mientras estás muy ocupada/o.", situacion_ay:"Phuchhamax dibujopa uñachayi, jumax wal lurawimpi jikxatasita.",
    opciones:[
      { texto_es:"Dejas lo que haces 30 segundos, lo miras y le dices algo específico que te gustó.", calidad:"buena", feedback_es:"Una atención breve pero genuina vale más que mucho tiempo distraído." },
      { texto_es:"Le dices 'ahorita no puedo' sin mirar el dibujo.", calidad:"mala", feedback_es:"Repetido en el tiempo, esto puede enseñar que sus logros no importan tanto." },
      { texto_es:"Miras rápido de reojo y dices 'qué lindo' sin detenerte.", calidad:"regular", feedback_es:"Es mejor que ignorarlo, pero el niño nota cuando la atención no es real." }
    ]
  },
  { situacion_es:"Tu hijo dice una mentira pequeña para no admitir que rompió algo.", situacion_ay:"Wawamax jisk'a k'arisiñ luri, t'unjatapa jan uñtʼayañataki.",
    opciones:[
      { texto_es:"Le gritas '¡mentiroso!' delante de otras personas.", calidad:"mala", feedback_es:"Etiquetar públicamente puede avergonzar y no enseña honestidad, solo miedo a ser descubierto." },
      { texto_es:"Hablan en privado sobre por qué es más fácil decir la verdad en casa.", calidad:"buena", feedback_es:"Crear un espacio seguro para la verdad reduce la necesidad de mentir por miedo." },
      { texto_es:"Ignoras la mentira porque 'total, no es grave'.", calidad:"regular", feedback_es:"Ignorar del todo pierde la oportunidad de conversar sobre la honestidad." }
    ]
  }
];

/* ---------- 8. Ruleta de Desafíos ---------- */
const DATA_RULETA = [
  { es:"Abrazo de 20 segundos, sin hablar.", ay:"20 segundo munasiña, jan arsusa.", icono:"bi-emoji-heart-eyes" },
  { es:"Cada persona dice una cosa que agradece de hoy.", ay:"Sapa jaqix mä yuspagara arsuñapa.", icono:"bi-heart" },
  { es:"Bailen juntos una canción, 1 minuto.", ay:"Chikachasa mä taki bailapxam.", icono:"bi-music-note-beamed" },
  { es:"Cuenten un chiste cada uno.", ay:"Sapa mayniw mä phiru arsuñapa.", icono:"bi-emoji-laughing" },
  { es:"Hagan 10 saltos juntos contando en voz alta.", ay:"Tunka thuqhuñanaka chikachasa jach'a arupampi jakhuñani.", icono:"bi-lightning-charge" },
  { es:"Dibujen algo que los haga felices, en 2 minutos.", ay:"Kusisiñ churir kunas dibujapxam, pä minutunx.", icono:"bi-palette" },
  { es:"Cada uno imita la emoción 'sorpresa' de forma exagerada.", ay:"Sapa mayniw 'muspa' uñachayapxam.", icono:"bi-emoji-surprise" },
  { es:"Compartan el mejor recuerdo familiar de este mes.", ay:"Aka phaxsina askiëri amtawi arsupxam.", icono:"bi-stars" }
];

/* ---------- 9. Trivia Familiar ---------- */
const DATA_TRIVIA = [
  { pregunta_es:"¿Qué parte del cuerpo nos ayuda a calmarnos si respiramos profundo?", opciones:["Los pulmones","Los pies","El pelo"], correcta:0 },
  { pregunta_es:"¿Cuál de estas es una forma de disciplina positiva?", opciones:["Gritar fuerte","Explicar el límite con calma","Ignorar siempre"], correcta:1 },
  { pregunta_es:"¿Cómo se llama la línea telefónica gratuita 'Familia Segura' en Bolivia?", opciones:["800 11 30 40","123 456","911"], correcta:0 },
  { pregunta_es:"¿Qué emoción sentimos cuando algo inesperado ocurre?", opciones:["Calma","Sorpresa","Aburrimiento"], correcta:1 },
  { pregunta_es:"¿Qué instrumento andino se usa tradicionalmente en canciones familiares bolivianas?", opciones:["Charango","Piano","Violín"], correcta:0 },
  { pregunta_es:"¿Qué es más útil cuando un niño está muy enojado?", opciones:["Dejarlo gritar sin acompañarlo","Ayudarlo a nombrar lo que siente","Reírse de él"], correcta:1 },
  { pregunta_es:"¿Qué significa 'co-playing'?", opciones:["Jugar solo","Jugar en pareja adulto-niño","Ver televisión juntos"], correcta:1 },
  { pregunta_es:"¿Qué prenda textil boliviana simboliza la unión familiar en esta plataforma?", opciones:["El aguayo","La corbata","El sombrero"], correcta:0 }
];

/* ---------- 10. Situaciones Familiares ---------- */
const DATA_SITUACIONES = [
  { situacion_es:"Tu hija no quiere hacer la tarea y dice que 'es aburrida'.",
    opciones:[
      { texto_es:"Le dices que si no la hace, no hay recreo por una semana.", calidad:"mala", feedback_es:"Los castigos largos y desproporcionados generan resentimiento y no mejoran la motivación." },
      { texto_es:"Le preguntas qué parte le resulta aburrida y buscan juntos hacerla más entretenida.", calidad:"buena", feedback_es:"Entender la causa ayuda más que imponer, y modela resolución de problemas." },
      { texto_es:"La haces tú para que no se atrase en el colegio.", calidad:"mala", feedback_es:"Hacerla por ella no le permite aprender autonomía ni responsabilidad." }
    ]
  },
  { situacion_es:"Tu hijo se enoja mucho cuando pierde un juego de mesa.",
    opciones:[
      { texto_es:"Le dices que 'los hombres no lloran' y que se aguante.", calidad:"mala", feedback_es:"Invalidar la emoción según el género enseña a esconder sentimientos, no a manejarlos." },
      { texto_es:"Dejas que gane siempre para evitar el enojo.", calidad:"regular", feedback_es:"Evita el enojo hoy, pero no le enseña a tolerar perder, algo necesario en la vida." },
      { texto_es:"Nombras lo que siente ('veo que te frustra perder') y siguen jugando otra ronda.", calidad:"buena", feedback_es:"Nombrar la emoción sin juzgar ayuda a tolerar la frustración poco a poco." }
    ]
  },
  { situacion_es:"Es hora de dormir y tu hija pide 'un cuento más' por quinta vez.",
    opciones:[
      { texto_es:"Le gritas que ya se duerma de una vez.", calidad:"mala", feedback_es:"Gritar en un momento de cansancio mutuo suele escalar el conflicto en vez de resolverlo." },
      { texto_es:"Acuerdan antes de empezar cuántos cuentos habrá, y lo sostienes con cariño pero con firmeza.", calidad:"buena", feedback_es:"Los acuerdos previos son más fáciles de sostener que los límites improvisados en el momento." },
      { texto_es:"Le lees uno más, aunque ya sea muy tarde.", calidad:"regular", feedback_es:"Puede funcionar hoy, pero sin un límite claro, la negociación puede repetirse cada noche." }
    ]
  },
  { situacion_es:"Tu hijo adolescente se encierra en su cuarto y no quiere hablar contigo.",
    opciones:[
      { texto_es:"Entras a su cuarto sin tocar y exiges que te cuente qué le pasa.", calidad:"mala", feedback_es:"Invadir su espacio puede generar más cierre; el respeto por su privacidad fortalece la confianza." },
      { texto_es:"Le avisas que estás disponible cuando quiera hablar, y le das tiempo.", calidad:"buena", feedback_es:"Ofrecer disponibilidad sin presionar respeta su proceso y mantiene la puerta abierta." },
      { texto_es:"Dejas de intentarlo por varios días, pensando que 'ya se le pasará'.", calidad:"regular", feedback_es:"Un poco de espacio ayuda, pero mantener alguna señal de cercanía sigue siendo importante." }
    ]
  }
];
