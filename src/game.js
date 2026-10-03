const icon = name => `<svg class="icon" aria-hidden="true"><use href="#i-${name}"/></svg>`;
const $ = id => document.getElementById(id);
const esc = text => String(text).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const CASES_PER_LEVEL = 4;
const TOTAL_CASES = 12;
const MAX_SCORE = 240;
const state = {screen:'home',index:0,deck:[],previousIds:[],selected:new Set(),answered:false,records:[],optionOrder:[],best:0,streak:0,bestStreak:0};
try { const stored=Number(localStorage.getItem('fittlab-v2-best'));state.best=Number.isFinite(stored)?Math.max(0,Math.min(MAX_SCORE,stored)):0; } catch (_) { /* El almacenamiento no es obligatorio. */ }
const shuffle = list => {
  const copy=[...list];
  for(let i=copy.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]];}
  return copy;
};
const score = () => state.records.reduce((sum,r)=>sum+r.points,0);
const currentCase = () => state.deck[state.index];
const footer = () => `<footer><span>FITT / LAB · Cada caso te exige un poco más.</span><span>Casos ficticios · Sin datos personales · Sin internet</span></footer>`;
const strip = () => `<div class="fitt-strip">${FITT.map(f=>`<div><strong>${f.letter}</strong><span>${f.name}</span></div>`).join('')}</div>`;
function focusHeading() {
  const heading=$('main').querySelector('h1');
  if(heading){heading.tabIndex=-1;heading.focus({preventScroll:true});}
  window.scrollTo({top:0,behavior:'instant'});
}
function makeDeck(previousIds=[]) {
  const previous=new Set(previousIds);
  return LEVELS.flatMap(level=>shuffle(DOMAINS.map(domain=>{
    const pool=CASES.filter(c=>c.level===level.id&&c.domain===domain.id);
    if(!pool.length)throw new Error(`Falta un caso para nivel ${level.id}, ${domain.id}`);
    const alternatives=pool.filter(c=>!previous.has(c.id));
    const eligible=alternatives.length?alternatives:pool;
    return eligible[Math.floor(Math.random()*eligible.length)];
  })));
}
function renderHome() {
  state.screen='home';
  $('main').innerHTML=`<section class="hero fade" aria-labelledby="home-title">
    <div><div class="hero-tag eyebrow"><span class="dot"></span> Casos aleatorios · Dificultad creciente</div>
    <h1 id="home-title">Primero evalúa.<br><span class="serif">Después prescribe.</span></h1>
    <p class="lead">Cada persona cambia la decisión. Resuelve casos que salen al azar y asciende del reconocimiento de pruebas a la integración de hallazgos con FITT-VP.</p>
    <div class="hero-actions"><button class="btn" id="start">Iniciar partida ${icon('arrow')}</button><button class="text-btn" id="how">¿Cómo se juega?</button></div>
    <div class="meta-line"><span>${icon('clock')} 10–15 min sugeridos</span><span>${icon('check')} 12 casos por partida</span><span>3 niveles · 24 casos disponibles</span></div>
    ${state.best?`<p class="tiny muted" style="margin-top:14px">Tu mejor resultado en este navegador: <strong>${state.best}/${MAX_SCORE}</strong></p>`:''}</div>
    <article class="case-preview campaign-preview" aria-label="Niveles de dificultad"><div class="case-top"><span class="eyebrow">Tu campaña de aprendizaje</span><span class="pill">24 casos ficticios</span></div>
    <h2 class="serif">No es memorizar.<br>Es decidir mejor.</h2>
    <div class="preview-levels">${LEVELS.map(l=>`<div><span class="preview-number">0${l.id}</span><div><strong>${l.name}</strong><p>${l.description}</p></div><span class="preview-xp">${l.points} pts</span></div>`).join('')}</div>
    <div class="case-bottom">${icon('reset')}<span>Nuevas variantes y orden aleatorio al volver a jugar. Cada nivel incluye los cuatro núcleos.</span></div></article>
    </section><section aria-labelledby="pillars-title"><div class="section-head"><h2 id="pillars-title">Cuatro núcleos. Distintas personas.</h2><span class="tiny muted">Tus fichas están disponibles durante la partida.</span></div>
    <div class="pillars">${DOMAINS.map((d,i)=>`<button class="pillar" data-atlas="${d.id}"><div class="pillar-top">${icon(d.icon)}<span class="pillar-num">0${i+1} ↗</span></div><h3>${d.title}</h3><p>${d.subtitle}</p></button>`).join('')}</div>
    <div class="bottom-note">${icon('shield')}<span>El cribado previo y el contexto importan. Los cuatro núcleos no agotan toda la evaluación. Este juego es de razonamiento: no debes realizar las pruebas físicas para jugar.</span></div></section>${footer()}`;
  $('start').onclick=start;
  $('how').onclick=()=>openGuide('how');
  document.querySelectorAll('[data-atlas]').forEach(b=>b.onclick=()=>openAtlas(b.dataset.atlas));
}
function start() {
  if(state.deck.length)state.previousIds=state.deck.map(c=>c.id);
  state.deck=makeDeck(state.previousIds);
  state.optionOrder=state.deck.map(c=>shuffle(c.options));
  state.screen='game';state.index=0;state.records=[];state.streak=0;state.bestStreak=0;
  resetDecision();renderQuestion();focusHeading();
}
function resetDecision(){state.selected=new Set();state.answered=false;}
function domainName(id){return DOMAINS.find(d=>d.id===id).short;}
function renderRail(c) {
  return `<aside class="rail" aria-label="Niveles y expediente"><p class="eyebrow rail-label">Tu ascenso</p>
    <ol class="stage-list">${LEVELS.map(l=>`<li class="${c.level===l.id?'active':c.level>l.id?'done':''}" ${c.level===l.id?'aria-current="step"':''}><span class="stage-circle">${c.level>l.id?'✓':l.id}</span><div><strong>${l.name}</strong><small>${l.difficulty} · ${l.points} puntos/caso</small></div></li>`).join('')}</ol>
    <article class="rail-case"><span class="eyebrow muted">Caso ${String(state.index+1).padStart(2,'0')} · Nuevo expediente</span><h3>${esc(c.profile.name)} · ${c.profile.age} años</h3><p>${esc(c.profile.context)}</p><dl><dt>Objetivo de la persona</dt><dd>${esc(c.profile.goal)}</dd><dt>Tu desafío</dt><dd>${LEVELS[c.level-1].description}</dd></dl></article>
    <div class="mini-badges" aria-label="Núcleos recorridos en el nivel">${DOMAINS.map(d=>{const done=state.records.some(r=>r.level===c.level&&r.domain===d.id);return `<span class="mini-badge ${done?'completed':''}" title="${d.title}: ${done?'revisado':'pendiente'}" aria-label="${d.title}: ${done?'revisado':'pendiente'}">${icon(d.icon)}</span>`;}).join('')}</div>
    <button class="text-btn tiny rail-reset" id="rail-reset">${icon('reset')} Volver al inicio</button></aside>`;
}
function renderQuestion() {
  const c=currentCase();const level=LEVELS[c.level-1];const inLevel=state.index%CASES_PER_LEVEL+1;
  $('main').innerHTML=`<div class="game-layout fade">${renderRail(c)}<section class="question-panel" aria-label="Caso actual">
    <div class="progress-head"><p>Caso <strong>${state.index+1}/${TOTAL_CASES}</strong> · Nivel ${c.level}/3</p><div class="game-counters"><span class="streak">Racha ${state.streak}</span><span class="score">${score()} / ${MAX_SCORE} pts</span></div></div>
    <div class="progress-track" role="progressbar" aria-valuemin="0" aria-valuemax="${TOTAL_CASES}" aria-valuenow="${state.records.length}" aria-label="Casos revisados"><div class="progress-fill" style="width:${state.records.length/TOTAL_CASES*100}%"></div></div>
    <div class="level-banner level-${c.level}"><div><span class="eyebrow">${level.role} · Dificultad ${level.difficulty.toLowerCase()}</span><strong>${level.name}</strong></div><span class="pill">${inLevel}/4 · +${level.points} pts</span></div>
    <article class="question-card"><div class="q-label eyebrow">${icon(c.icon)} ${domainName(c.domain)} · Caso al azar</div>
    <div class="case-profile"><span class="profile-initial" aria-hidden="true">${esc(c.profile.name.charAt(0))}</span><div><strong>${esc(c.profile.name)}, ${c.profile.age} años</strong><p>${esc(c.profile.context)}</p></div></div>
    <p class="case-goal"><strong>Su objetivo:</strong> ${esc(c.profile.goal)}</p><h1>${c.title}</h1><div class="scenario">${c.scenario}</div>
    <p class="instruction">${c.kind==='multi'?'Dificultad avanzada: selecciona todas las acciones pertinentes. El conjunto completo debe ser correcto.':'Elige la decisión más fundamentada. Puedes cambiarla antes de confirmar.'}</p>
    <div class="options" role="group" aria-label="Opciones de respuesta">${state.optionOrder[state.index].map((o,i)=>`<button class="option" type="button" data-option="${o.id}" aria-pressed="false"><span class="option-letter" aria-hidden="true">${c.kind==='multi'?'□':String.fromCharCode(65+i)}</span><span>${o.text}</span></button>`).join('')}</div>
    <div id="feedback-area"></div><div class="decision-bar"><p id="decision-status">${c.kind==='multi'?'Ninguna acción seleccionada':'Piensa en el objetivo, el contexto y la seguridad.'}</p><button class="btn" id="confirm" disabled>Confirmar decisión ${icon('check')}</button></div></article>
    <p class="tiny muted" style="margin-top:15px">Puedes consultar las fichas. Los errores enseñan: no hay vidas ni límite de tiempo.</p></section></div>${footer()}`;
  $('rail-reset').onclick=confirmReset;
  document.querySelectorAll('[data-option]').forEach(b=>b.onclick=()=>selectOption(b.dataset.option));
  $('confirm').onclick=submitAnswer;
}
function selectOption(id) {
  if(state.screen!=='game'||state.answered)return;
  const c=currentCase();if(!c.options.some(o=>o.id===id))return;
  if(c.kind==='multi'){state.selected.has(id)?state.selected.delete(id):state.selected.add(id);}else{state.selected=new Set([id]);}
  document.querySelectorAll('[data-option]').forEach(b=>{
    const chosen=state.selected.has(b.dataset.option);b.classList.toggle('selected',chosen);b.setAttribute('aria-pressed',String(chosen));
    if(c.kind==='multi')b.querySelector('.option-letter').textContent=chosen?'✓':'□';
  });
  $('confirm').disabled=!state.selected.size;
  $('decision-status').textContent=c.kind==='multi'?`${state.selected.size} acción${state.selected.size===1?'':'es'} seleccionada${state.selected.size===1?'':'s'}`:'Decisión lista para revisar.';
}
function submitAnswer() {
  if(state.screen!=='game'||state.answered||!state.selected.size)return;
  const c=currentCase();const level=LEVELS[c.level-1];state.answered=true;
  const ok=state.selected.size===c.correct.length&&c.correct.every(id=>state.selected.has(id));
  state.streak=ok?state.streak+1:0;state.bestStreak=Math.max(state.bestStreak,state.streak);
  state.records.push({id:c.id,domain:c.domain,level:c.level,ok,points:ok?level.points:0,selected:[...state.selected]});
  document.querySelectorAll('[data-option]').forEach(b=>{
    b.disabled=true;const right=c.correct.includes(b.dataset.option);const chosen=state.selected.has(b.dataset.option);
    b.classList.toggle('correct',right);b.classList.toggle('incorrect',chosen&&!right);
    if(right||chosen)b.insertAdjacentHTML('beforeend',`<span class="option-status">${right?(chosen?'✓ Correcta':c.kind==='multi'?'✓ Faltaba':'✓ Correcta'):'Revisar'}</span>`);
  });
  const chosen=c.options.filter(o=>state.selected.has(o.id));
  const omitted=c.options.filter(o=>c.correct.includes(o.id)&&!state.selected.has(o.id));
  let detail=c.kind==='single'?`<p><strong>Tu decisión:</strong> ${chosen[0].why}</p>`:
    [...omitted.map(o=>`<p><strong>Faltó incluir:</strong> ${o.why}</p>`),...chosen.filter(o=>!c.correct.includes(o.id)).map(o=>`<p><strong>No corresponde:</strong> ${o.why}</p>`)].join('');
  $('feedback-area').innerHTML=`<section class="feedback ${ok?'':'warning'}" id="feedback" role="status" tabindex="-1"><h2>${icon(ok?'check':'info')}${ok?`Decisión fundamentada · +${level.points} puntos`:'Caso revisado · afina el criterio'}</h2>${detail}<p>${c.explanation}</p><p class="key"><strong>Idea clave:</strong> ${c.key}</p><p class="fitt-bridge"><strong>Puente con FITT-VP:</strong> ${c.bridge}</p>${ok&&state.streak>=3?`<p class="combo-message">Racha de ${state.streak} aciertos. ¡Mantén el criterio!</p>`:''}</section>`;
  $('decision-status').textContent=ok?'Lee la explicación antes de recibir el siguiente caso.':'No suma puntos; la explicación te prepara para el siguiente caso.';
  const last=state.index===TOTAL_CASES-1;const endLevel=(state.index+1)%CASES_PER_LEVEL===0;
  $('confirm').innerHTML=`${last?'Ver mi resultado':endLevel?'Cerrar nivel y ascender':'Siguiente caso al azar'} ${icon('arrow')}`;
  $('confirm').disabled=false;$('confirm').onclick=nextQuestion;
  document.querySelector('.score').textContent=`${score()} / ${MAX_SCORE} pts`;
  document.querySelector('.streak').textContent=`Racha ${state.streak}`;
  document.querySelector('.progress-fill').style.width=`${state.records.length/TOTAL_CASES*100}%`;
  document.querySelector('[role="progressbar"]').setAttribute('aria-valuenow',String(state.records.length));
  $('feedback').focus({preventScroll:true});$('feedback').scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'nearest'});
}
function nextQuestion() {
  if(state.screen!=='game'||!state.answered)return;
  if(state.index===TOTAL_CASES-1){renderResults();return;}
  if((state.index+1)%CASES_PER_LEVEL===0){renderLevelUp();return;}
  advanceCase();
}
function advanceCase() {
  state.index++;state.screen='game';resetDecision();renderQuestion();focusHeading();
}
function renderLevelUp() {
  state.screen='levelup';const completed=LEVELS[currentCase().level-1];const next=LEVELS[currentCase().level];
  const records=state.records.filter(r=>r.level===completed.id);const correct=records.filter(r=>r.ok).length;
  $('main').innerHTML=`<section class="levelup-screen fade"><div class="result-stamp">${icon('award')}</div><div class="eyebrow muted">Nivel ${completed.id} completado · 4 casos revisados</div>
    <h1>Subes un nivel.<br><span class="serif">Ahora el caso exige más.</span></h1><p class="lead">${completed.next}</p>
    <div class="levelup-stats"><span><strong>${correct}/4</strong> decisiones correctas</span><span><strong>${records.reduce((s,r)=>s+r.points,0)}/${completed.points*4}</strong> puntos del nivel</span></div>
    <div class="unlocked-card"><span class="eyebrow">Nivel ${next.id} desbloqueado</span><h2>${next.name}</h2><p>${next.description}</p><span class="pill">${next.difficulty} · ${next.points} puntos por caso</span></div>
    <p class="tiny muted">Avanzas al revisar los cuatro casos, no solo al acertarlos. Los puntos reflejan las decisiones correctas; el ascenso no certifica dominio clínico.</p>
    <button class="btn" id="advance-level">Entrar al nivel ${next.id} ${icon('arrow')}</button><button class="text-btn" id="levelup-atlas">${icon('book')} Consultar antes de continuar</button></section>${footer()}`;
  $('advance-level').onclick=()=>{if(state.screen==='levelup')advanceCase();};$('levelup-atlas').onclick=()=>openAtlas();focusHeading();
}
function chosenText(c,r){return c.options.filter(o=>r.selected.includes(o.id)).map(o=>o.text).join(' | ');}
function rightText(c){return c.options.filter(o=>c.correct.includes(o.id)).map(o=>o.text).join(' | ');}
function domainStats(id){const records=state.records.filter(r=>r.domain===id);return {correct:records.filter(r=>r.ok).length,total:records.length};}
function levelStats(id){const records=state.records.filter(r=>r.level===id);return {correct:records.filter(r=>r.ok).length,points:records.reduce((s,r)=>s+r.points,0)};}
function renderResults() {
  state.screen='results';const points=score();const correct=state.records.filter(r=>r.ok).length;
  state.best=Math.max(state.best,points);try{localStorage.setItem('fittlab-v2-best',String(state.best));}catch(_){}
  const strong=DOMAINS.filter(d=>domainStats(d.id).correct===3);const weak=DOMAINS.filter(d=>domainStats(d.id).correct<3);
  const headline=correct===TOTAL_CASES?'Tu criterio marca la diferencia.':correct>=9?'Ya integras decisiones complejas.':correct>=6?'Tu criterio va tomando forma.':'Cada caso deja una pista para mejorar.';
  $('main').innerHTML=`<section class="result-layout fade"><div class="result-top"><div class="result-stamp">${icon('award')}</div><div class="eyebrow muted">Campaña completada · 3 niveles</div><h1>${headline}</h1><p class="lead">Revisaste ${TOTAL_CASES} casos sorteados del banco de ${CASES.length}. Ahora compara cómo cambió tu criterio desde elegir pruebas hasta integrar hallazgos.</p></div>
    <div class="result-stats"><div><strong>${points}<span> / ${MAX_SCORE}</span></strong><span>Puntos de aprendizaje</span></div><div><strong>${correct}<span> / ${TOTAL_CASES}</span></strong><span>Casos correctos</span></div><div><strong>${state.bestStreak}</strong><span>Mejor racha de aciertos</span></div></div>
    <div class="level-results">${LEVELS.map(l=>{const s=levelStats(l.id);return `<article class="level-result"><span class="eyebrow">Nivel ${l.id} · ${l.difficulty}</span><h3>${l.name}</h3><p><strong>${s.correct}/4</strong> aciertos · ${s.points}/${l.points*4} pts</p><span class="level-medal">${s.correct===4?'Medalla: pleno de aciertos':s.correct>=2?'Medalla: criterio en desarrollo':'Recorrido completado; refuerza este nivel'}</span></article>`;}).join('')}</div>
    <div class="section-head"><h2>Tu criterio por núcleo</h2><span class="tiny muted">Un caso de cada núcleo en cada nivel.</span></div><div class="domain-results">${DOMAINS.map(d=>{const s=domainStats(d.id);return `<article class="domain-result">${icon(d.icon)}<div><h3>${d.title}</h3><p>${s.correct===s.total?'Buen criterio en los tres niveles.':'Revisa las decisiones que te costaron más.'}</p></div><strong>${s.correct}/${s.total}</strong></article>`;}).join('')}</div>
    <article class="summary-box"><h2>Tu mapa de aprendizaje</h2><p><strong>Aciertos sólidos:</strong> ${strong.length?strong.map(d=>d.short).join(', ')+'.':'Ya completaste el recorrido. Usa las explicaciones para afianzar cada núcleo.'}</p><p><strong>Para reforzar:</strong> ${weak.length?weak.map(d=>d.short).join(', ')+'.':'Respondiste correctamente los cuatro núcleos en todos los niveles.'}</p><p><strong>Siguiente paso:</strong> vuelve a jugar: se elegirá la otra variante de cada núcleo y nivel respecto de esta partida y se barajará su orden.</p><p class="tiny muted">Puntos por caso: 10 en Fundamentos, 20 en Interpretación y 30 en Integración. La selección múltiple puntúa solo si el conjunto está completo y sin opciones incorrectas. No es certificación de competencia clínica.</p></article>
    <article class="summary-box"><span class="eyebrow" style="color:var(--teal)">La conexión con tu clase</span><h2 style="margin-top:12px">Evaluar → interpretar → prescribir → reevaluar</h2><p>No hay una misma respuesta para todas las personas. La calidad del dato, los síntomas, los objetivos y la tolerancia informan una dosis individualizada.</p>${strip()}<p style="margin-top:16px;margin-bottom:0"><strong>Para discutir:</strong> ¿qué caso cambió tu primera intuición? ¿Qué factor de confusión encontraste? ¿Qué hallazgo modificaría la intensidad, el tipo o la progresión?</p></article>
    <div class="section-head"><h2>Tus ${TOTAL_CASES} casos jugados</h2><span class="tiny muted">La revisión refleja tu partida, no todo el banco.</span></div>
    ${state.deck.map((c,i)=>{const r=state.records[i];return `<details><summary><span class="review-status">${r.ok?'✓':'Revisar'}</span> · ${i+1}. ${esc(c.profile.name)} · Nivel ${c.level} · ${c.title}</summary><div class="review-content"><p><strong>Contexto:</strong> ${c.scenario}</p><p><strong>Elegiste:</strong> ${esc(chosenText(c,r))}</p><p><strong>Respuesta esperada:</strong> ${esc(rightText(c))}</p><p>${c.explanation}</p><p><strong>Idea clave:</strong> ${c.key}</p><p><strong>FITT-VP:</strong> ${c.bridge}</p></div></details>`;}).join('')}
    <div class="result-actions"><button class="btn" id="replay">${icon('reset')} Jugar con otros casos</button><button class="btn secondary" id="download-results">${icon('download')} Descargar mi resumen</button><button class="btn secondary" id="back-home">Volver al inicio</button></div><p class="live-notice" id="result-notice" role="status"></p><p class="tiny muted" style="text-align:center">No se envían respuestas al servidor. Las variantes se alternan en esta sesión; no es contenido infinito.</p></section>${footer()}`;
  $('replay').onclick=start;$('back-home').onclick=()=>{renderHome();focusHeading();};$('download-results').onclick=downloadResults;focusHeading();
}
function buildSummary() {
  return ['FITT LAB — CAMPAÑA DE CASOS ALEATORIOS',`Puntos: ${score()}/${MAX_SCORE} · Aciertos: ${state.records.filter(r=>r.ok).length}/${TOTAL_CASES} · Mejor racha: ${state.bestStreak}`,
    'Tres niveles revisados. Este resultado no certifica competencia clínica.','',
    ...LEVELS.map(l=>{const s=levelStats(l.id);return `Nivel ${l.id} ${l.name}: ${s.correct}/4 aciertos; ${s.points}/${l.points*4} puntos`;}),'',
    ...state.deck.flatMap((c,i)=>{const r=state.records[i];return [`${i+1}. ${c.profile.name}, ${c.profile.age} años · Nivel ${c.level} · ${domainName(c.domain)}`,`Caso: ${c.id}`,`Contexto: ${c.profile.context}`,`Objetivo: ${c.profile.goal}`,`Situación: ${c.scenario}`,`Pregunta: ${c.title}`,`Resultado: ${r.ok?'Correcto':'Por reforzar'} · ${r.points} puntos`,`Elegiste: ${chosenText(c,r)}`,`Respuesta esperada: ${rightText(c)}`,`Explicación: ${c.explanation}`,`Idea clave: ${c.key}`,`FITT-VP: ${c.bridge}`,''];}),
    'FITT-VP: Frecuencia, Intensidad, Tiempo, Tipo, Volumen y Progresión.','Evaluar → interpretar → prescribir → reevaluar.','Casos ficticios. No constituye una prescripción individual.'].join('\n');
}
function downloadResults() {
  const blob=new Blob(['\ufeff'+buildSummary()],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob);const anchor=document.createElement('a');
  anchor.href=url;anchor.download='mi-resumen-fitt-lab-niveles.txt';document.body.append(anchor);anchor.click();anchor.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  $('result-notice').textContent='Resumen preparado. Si el navegador permite descargas, lo encontrarás en tu carpeta de descargas.';
}
function showModal(title,content) {
  $('modal-title').textContent=title;$('modal-body').innerHTML=content;const dialog=$('resource-dialog');if(!dialog.open)dialog.showModal();dialog.scrollTop=0;
}
function openGuide(mode) {
  showModal(mode==='how'?'Cómo se juega':'Guía de clase',`<article class="atlas-item"><h3>Una partida, doce personas y tres niveles</h3><p>El juego sortea 12 casos entre un banco de 24: cuatro por nivel, uno de capacidad cardiorrespiratoria, composición corporal, fuerza y flexibilidad. El orden de los núcleos y las opciones se baraja. No se repiten casos dentro de una partida.</p><p><strong>Nivel 1 — Fundamentos:</strong> reconoce pruebas pertinentes, con información directa y una opción correcta.</p><p><strong>Nivel 2 — Interpretación:</strong> analiza factores de confusión, técnica, medicación y límites de lo que puedes concluir. Una opción correcta.</p><p><strong>Nivel 3 — Integración:</strong> integra varias acciones correctas con salud, contexto y FITT-VP. Debes elegir el conjunto completo.</p></article><h3>Ascenso, puntos y rachas</h3><p>Cierras cada nivel al revisar cuatro casos y desbloqueas el siguiente, aunque hayas cometido errores. Acierto completo: 10, 20 y 30 puntos según el nivel; máximo 240. No se dan puntos extra por la racha. Una respuesta incorrecta reinicia la racha, pero no resta puntos ni elimina vidas. No hay cuenta regresiva.</p><p>Las pantallas de ascenso explican qué cambia en la dificultad. Al final hay medallas formativas, mapa por núcleo y nivel, revisión de tus casos y resumen descargable. Los resultados no certifican competencia clínica.</p><h3>Qué cambia al repetir</h3><p>Durante esta sesión, la siguiente partida usa la otra variante de cada núcleo y nivel frente a la partida anterior y vuelve a barajar el orden. Si cierras o recargas el archivo, esa memoria se pierde. El banco es curado y finito: no utiliza IA ni internet para generar casos.</p><h3>Dinámica docente · 20–25 minutos sugeridos</h3><p><strong>Apertura (2 min).</strong> «¿Qué información necesitas antes de prescribir ejercicio?».</p><p><strong>Partida (10–15 min).</strong> Individual o por parejas. Antes de confirmar, justifiquen una elección y expliquen por qué descartan una opción. En el ascenso, identifiquen qué se vuelve más difícil.</p><p><strong>Discusión (5–8 min).</strong> Comparen las personas que les salieron, un factor de confusión y una decisión que cambia FITT-VP. No deben realizar las pruebas físicas: son escenarios de razonamiento.</p><h3>Compartir sin internet</h3><p>Descarga <strong>juego-evaluacion-fitt-vp-niveles.html</strong> y compártelo como archivo. Debe abrirse en un navegador, no solo en la vista previa del aula virtual o de mensajería. El HTML contiene código, estilos y casos. En celulares, algunas apps no ejecutan adjuntos HTML; usa navegador, computadora o vista web.</p><h3>Privacidad y alcance</h3><p>No se solicitan datos personales. Solo se guarda el mejor puntaje de esta versión en el navegador, si permite almacenamiento local. El resumen no se envía automáticamente al docente. Los enlaces de fuentes necesitan internet, pero jugar no.</p><p>Los casos y datos son ficticios, no normas diagnósticas. Los cuatro núcleos no son una clasificación exhaustiva. El juego no diagnostica, cambia medicamentos ni asigna una prescripción clínica automática.</p>`);
}
function confirmReset() {
  showModal('¿Volver al inicio?',`<p>Saldrás de esta partida. Cuando vuelvas a iniciar, el juego sorteará las variantes alternativas de cada núcleo y nivel.</p><div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn" id="keep-playing">Seguir jugando</button><button class="btn secondary" id="reset-now">Volver al inicio</button></div>`);
  $('keep-playing').onclick=()=>$('resource-dialog').close();$('reset-now').onclick=()=>{$('resource-dialog').close();renderHome();focusHeading();};
}
$('atlas-button').onclick=()=>openAtlas();$('guide-button').onclick=()=>openGuide();$('close-dialog').onclick=()=>$('resource-dialog').close();
$('resource-dialog').addEventListener('click',event=>{
  if(event.target===$('resource-dialog')){const rect=event.target.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)event.target.close();}
});
renderHome();
