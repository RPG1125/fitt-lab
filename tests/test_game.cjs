const fs = require('node:fs');
const assert = require('node:assert/strict');
const { JSDOM, VirtualConsole } = require('jsdom');
const html = fs.readFileSync('public/index.html', 'utf8');
let checks = 0;
const errors = [];
const downloads = [];
const virtualConsole = new VirtualConsole();
virtualConsole.on('jsdomError', e => errors.push(e.message));
function shims(window) {
  window.scrollTo = () => {};
  window.matchMedia = () => ({ matches: false });
  window.HTMLElement.prototype.scrollIntoView = () => {};
  window.HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  window.HTMLDialogElement.prototype.close = function () { this.open = false; };
  window.URL.createObjectURL = blob => { downloads.push(blob); return 'blob:summary'; };
  window.URL.revokeObjectURL = () => {};
  window.HTMLAnchorElement.prototype.click = function () { downloads.push(this.download); };
  // Aleatoriedad reproducible solo para las pruebas, no para el HTML del usuario.
  let seed = 246813579;
  window.Math.random = () => { seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5; return (seed >>> 0) / 4294967296; };
}
const dom = new JSDOM(html, { runScripts: 'dangerously', url: 'https://fittlab.example/', virtualConsole, beforeParse: shims });
const window = dom.window;
const document = window.document;
const game = window.eval('({ state, CASES, LEVELS, DOMAINS, MAX_SCORE, TOTAL_CASES, makeDeck, score, start, renderQuestion, resetDecision, submitAnswer, nextQuestion, currentCase, buildSummary, shuffle })');
const button = id => document.getElementById(id);
const choice = id => document.querySelector(`[data-option="${id}"]`);
function check(condition, message) { assert.ok(condition, message); checks++; }
function choose(c, correct) {
  if (correct) for (const id of c.correct) choice(id).click();
  else choice(c.options.find(o => !c.correct.includes(o.id)).id).click();
}
function play(policy) {
  const transitions = [];
  while (game.state.screen === 'game' || game.state.screen === 'levelup') {
    if (game.state.screen === 'levelup') {
      transitions.push(game.state.records.length);
      check([4, 8].includes(game.state.records.length), 'Ascenso solo tras 4 u 8 casos');
      check(button('advance-level').textContent.includes(`nivel ${game.currentCase().level + 1}`), 'Ascenso al nivel correcto');
      const index = game.state.index;
      game.nextQuestion();
      check(game.state.index === index, 'El estado de ascenso impide saltos dobles');
      button('levelup-atlas').click();
      check(button('resource-dialog').open, 'Consulta disponible antes de ascender');
      button('close-dialog').click();
      button('advance-level').click();
      check(game.state.screen === 'game' && game.state.index === index + 1, 'Continúa con el siguiente caso del nuevo nivel');
      continue;
    }
    const c = game.currentCase();
    check(button('confirm').disabled, 'Sin selección no se confirma');
    const recordCount = game.state.records.length;
    game.submitAnswer();
    check(game.state.records.length === recordCount, 'No se registran respuestas vacías');
    check(document.querySelector('.case-profile').textContent.includes(c.profile.name), 'Caso y persona visibles en el panel principal');
    check(document.querySelector('.case-goal').textContent.includes(c.profile.goal), 'Objetivo de la persona visible');
    check(document.querySelector('.level-banner').textContent.includes(game.LEVELS[c.level - 1].name), 'Nivel actual visible');
    choose(c, policy(c, game.state.index));
    check(!button('confirm').disabled, 'Respuesta seleccionada puede confirmarse');
    button('confirm').click();
    const points = game.score();
    game.submitAnswer();
    check(game.score() === points && game.state.records.length === recordCount + 1, 'No se duplican puntos ni respuestas');
    check(button('feedback').textContent.includes(c.key), 'Cada caso explica la idea clave');
    check(button('feedback').textContent.includes(c.bridge), 'Cada caso conecta con FITT-VP');
    check(document.querySelectorAll('[data-option]:not(:disabled)').length === 0, 'Opciones bloqueadas después de confirmar');
    check(Number(document.querySelector('[role="progressbar"]').getAttribute('aria-valuenow')) === recordCount + 1, 'Progreso coincide con casos revisados');
    button('confirm').click();
  }
  check(transitions.join(',') === '4,8', 'Dos ascensos, en orden');
  check(game.state.screen === 'results', 'Campaña termina en resultados');
  return game.state.deck.map(c => c.id);
}

check(document.documentElement.lang === 'es', 'Idioma español');
check(game.CASES.length === 24, 'Banco de 24 casos');
check(new Set(game.CASES.map(c => c.id)).size === 24, 'IDs únicos');
check(new Set(game.CASES.map(c => c.profile.name)).size === 24, 'Personas distintas, no solo un caso fijo');
check(new Set(game.CASES.map(c => c.scenario)).size === 24, 'Escenarios distintos');
check(game.LEVELS.map(l => l.points).join(',') === '10,20,30', 'Puntos aumentan con la dificultad');
check(game.LEVELS.reduce((s, l) => s + l.points * 4, 0) === game.MAX_SCORE, 'Máximo derivado: 240 puntos');
for (const c of game.CASES) {
  check(c.correct.length > 0 && c.correct.length < c.options.length, 'Opciones correctas e incorrectas en cada caso');
  check(new Set(c.options.map(o => o.id)).size === c.options.length, 'IDs de opciones únicos');
  check(c.correct.every(id => c.options.some(o => o.id === id)), 'Respuestas esperadas existen');
  check(c.options.every(o => o.text && o.why), 'Cada opción tiene explicación');
  check(c.kind === (c.level === 3 ? 'multi' : 'single'), 'Selección múltiple solo en nivel avanzado');
  check(c.level === 3 ? c.correct.length > 1 : c.correct.length === 1, 'La demanda de integración aumenta');
}
for (const level of game.LEVELS) for (const domain of game.DOMAINS) {
  check(game.CASES.filter(c => c.level === level.id && c.domain === domain.id).length === 2, 'Dos variantes por nivel y núcleo');
}
check(!/<(?:script|img|iframe)[^>]+src=/i.test(html), 'Sin scripts o imágenes remotos');
check(!/<link[^>]+(?:stylesheet|preload)[^>]*>/i.test(html), 'Sin estilos o fuentes remotos');
check(!/\b(?:fetch|XMLHttpRequest|WebSocket)\s*\(/.test(html), 'Sin generación remota ni peticiones de datos');
check(!html.includes('{{SCRIPTS}}') && !html.includes('{{STYLES}}'), 'HTML construido completo');

const seen = new Set();
const sequences = new Set();
for (let i = 0; i < 500; i++) {
  const deck = game.makeDeck();
  check(deck.length === 12, 'Sorteo de doce casos');
  check(new Set(deck.map(c => c.id)).size === 12, 'Sin repetición interna');
  check(deck.map(c => c.level).join(',') === '1,1,1,1,2,2,2,2,3,3,3,3', 'Complejidad siempre creciente');
  for (const l of game.LEVELS) {
    const levelCases = deck.filter(c => c.level === l.id);
    check(new Set(levelCases.map(c => c.domain)).size === 4, 'Cuatro núcleos por nivel');
  }
  deck.forEach(c => seen.add(c.id));
  sequences.add(deck.map(c => c.id).join('|'));
  const replay = game.makeDeck(deck.map(c => c.id));
  check(replay.every(c => !deck.some(previous => previous.id === c.id)), 'Repetición usa otras variantes');
}
check(seen.size === 24, 'El sorteo alcanza todo el banco');
check(sequences.size > 100, 'Hay variedad real de secuencias, no una sola rotación fija');

button('guide-button').click();
check(button('resource-dialog').open, 'Guía abre');
check(button('modal-body').textContent.includes('Nivel 3'), 'Guía explica dificultad avanzada');
button('close-dialog').click();
button('atlas-button').click();
check(button('modal-body').textContent.includes('Betabloqueadores'), 'Fichas incluyen fundamento de medicación');
button('close-dialog').click();
button('start').click();
const first = game.currentCase();
choice(first.options.find(o => !first.correct.includes(o.id)).id).click();
choice(first.correct[0]).click();
check(game.state.selected.size === 1 && game.state.selected.has(first.correct[0]), 'Selección simple reemplaza respuesta');
game.resetDecision();game.renderQuestion();
const perfectDeck = play(() => true);
check(game.score() === 240, 'Campaña perfecta: 240');
check(game.state.bestStreak === 12, 'Racha máxima perfecta: 12');
check(document.querySelectorAll('.level-result').length === 3, 'Resumen de tres niveles');
check(document.querySelectorAll('.domain-result').length === 4, 'Resumen de cuatro núcleos');
check([...document.querySelectorAll('.domain-result')].every(e => e.textContent.includes('3/3')), 'Tres aciertos por núcleo');
check(document.querySelectorAll('details').length === 12, 'Revisión solo de doce casos jugados');
const summary = game.buildSummary();
check(perfectDeck.every(id => summary.includes(`Caso: ${id}`)), 'Descarga incluye todos los casos jugados');
check(game.CASES.filter(c => !perfectDeck.includes(c.id)).every(c => !summary.includes(`Caso: ${c.id}`)), 'Descarga no añade casos sin jugar');
check(window.localStorage.getItem('fittlab-v2-best') === '240', 'Mejor puntaje de la nueva versión guardado');
button('download-results').click();
check(downloads.includes('mi-resumen-fitt-lab-niveles.txt'), 'Resumen descargable');
check(downloads[0].size > 5000, 'Resumen completo');

button('replay').click();
check(game.state.deck.every(c => !perfectDeck.includes(c.id)), 'Nueva partida no repite variantes de la anterior');
check(game.score() === 0 && game.state.streak === 0, 'Reinicio de puntos y racha');
play(() => false);
check(game.score() === 0 && game.state.bestStreak === 0, 'Errores no restan y no crean rachas');
check(window.localStorage.getItem('fittlab-v2-best') === '240', 'Mejor puntaje se conserva');
button('replay').click();
play((_c, index) => index % 2 === 0);
check(game.score() === game.LEVELS.reduce((s, l) => s + l.points * 2, 0), 'Puntuación mixta ponderada correctamente');
check(game.state.bestStreak === 1, 'Los errores reinician la racha');

// Cada variante se comprueba tanto correcta como incorrectamente, incluso si no fue sorteada.
for (const c of game.CASES) {
  for (const correct of [true, false]) {
    game.state.deck = [c];game.state.index = 0;game.state.records = [];game.state.screen = 'game';
    game.state.optionOrder = [[...c.options]];game.state.streak = 0;game.state.bestStreak = 0;
    game.resetDecision();game.renderQuestion();
    if (c.kind === 'multi') {
      choice(c.correct[0]).click();choice(c.correct[0]).click();
      check(game.state.selected.size === 0 && button('confirm').disabled, 'Selección múltiple puede desmarcarse');
    }
    choose(c, correct);button('confirm').click();
    check(game.state.records[0].ok === correct, 'Puntúa correctamente cada variante');
    check(game.score() === (correct ? game.LEVELS[c.level - 1].points : 0), 'Peso correcto en cada variante');
    check(button('feedback').textContent.includes(c.explanation), 'Explicación íntegra para cada variante');
    if (!correct && c.kind === 'multi') {
      check(button('feedback').textContent.includes('Faltó incluir'), 'Explica acciones omitidas');
      check(button('feedback').textContent.includes('No corresponde'), 'Explica acciones improcedentes');
    }
  }
}
// Restablecer una partida real después de la instrumentación de variantes.
game.state.deck = [];game.start();
button('rail-reset').click();button('keep-playing').click();
check(game.state.screen === 'game', 'Cancelar salida conserva partida');
button('rail-reset').click();button('reset-now').click();
check(game.state.screen === 'home', 'Volver al inicio funciona');

const offlineConsole = new VirtualConsole();
const offlineErrors = [];
offlineConsole.on('jsdomError', e => offlineErrors.push(e.message));
const offline = new JSDOM(html, {url:'file:///juego-evaluacion-fitt-vp-niveles.html',runScripts:'dangerously',virtualConsole:offlineConsole,beforeParse:shims});
offline.window.document.getElementById('start').click();
check(Boolean(offline.window.document.getElementById('confirm')), 'Funciona como archivo local sin almacenamiento disponible');
check(offline.window.document.querySelector('.case-profile').textContent.length > 20, 'Archivo local muestra persona y contexto');
check(offlineErrors.length === 0, `Sin errores offline: ${offlineErrors.join('; ')}`);
check(errors.length === 0, `Sin errores de ejecución: ${errors.join('; ')}`);
process.stdout.write(`OK: ${checks} comprobaciones; 24 variantes en acierto/error, 500 sorteos, 3 campañas, 2 ascensos por campaña, puntajes, rachas, resumen y file://.\n`);
offline.window.close();window.close();
