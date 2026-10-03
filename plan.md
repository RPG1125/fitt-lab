# FITT Lab — actualización aprobada por el usuario

## Petición nueva
El juego debe ir mostrando casos aleatorios y aumentar la complejidad a medida que avanza. Se conserva el diseño editorial, la evaluación previa a FITT-VP, las fichas, las explicaciones y la entrega HTML autónoma.

## Mecánica
Banco local de 24 casos ficticios diferentes, no solo nombres intercambiados. Tres niveles con ocho casos disponibles cada uno, dos variantes por cada uno de los cuatro núcleos. Cada partida extrae un caso por núcleo en cada nivel y baraja su orden: 12 casos, sin repetición durante la partida. Al volver a jugar, se evita reutilizar la variante de cada posición núcleo/nivel de la partida inmediatamente anterior en esta sesión; el orden y las opciones siguen barajados. No se promete contenido infinito ni generación por IA.

1. **Fundamentos:** identificar pruebas pertinentes en situaciones directas; selección simple; 10 puntos por caso.
2. **Interpretación:** interpretar resultados y límites considerando factores de confusión, técnica y comparabilidad; selección simple; 20 puntos por caso.
3. **Integración:** integrar hallazgos, seguridad, contexto y ajustes en FITT-VP; selección múltiple de acciones fundamentadas; 30 puntos por caso.

Máximo de 240 puntos. Racha de aciertos y medallas de nivel sin bonificaciones ocultas. Se completa cada bloque de cuatro casos para desbloquear el siguiente; los errores dan explicación y no impiden continuar. Pantalla de ascenso indica por qué aumenta la dificultad. No es un algoritmo adaptativo clínico ni una certificación. Resultados por nivel y núcleo, casos efectivamente jugados, plan de refuerzo y resumen descargable.

## Estructura
- `src/shell.html`, `src/styles.css`, `src/reference.js`: estructura y referencias conservadas.
- `src/cases.js`: banco curado de casos.
- `src/game.js`: sorteo balanceado, estados, respuestas, ascensos y resultados.
- `scripts/build.py`: integra todo en `public/index.html`, sin peticiones remotas, para abrirlo con file://.
- `tests/test_game.cjs`: pruebas de cada variante, partidas aleatorias, cobertura, progresión, puntajes, resúmenes y uso local.
- `public/manus-routes.json`, logo y metadatos: conservados.
- HTML y guía docente actualizados en `/home/ubuntu/entregables/`.

## Diseño conservado y ampliado
Editorial científico contemporáneo. Azul tinta, blanco cálido y verde petróleo `#087f75`; naranja para errores formativos. Titulares Georgia y controles con tipografía del sistema, sin recursos remotos. Estructura asimétrica y carril lateral. Identidad FITT / LAB con pulso. Voz: «Primero evalúa. Después prescribe.» y «Cada caso te exige un poco más». Tarjeta de persona visible también en celular, indicador de nivel/dificultad/racha y pantallas de ascenso. Animaciones breves, reduced-motion, navegación por teclado y explicaciones antes de avanzar.

## Límites pedagógicos
Los cuatro núcleos no son una clasificación exhaustiva. Cribado, salud, medicación, preferencias y seguimiento se integran en escenarios. No hay diagnóstico por puntos de corte ni asignación automática de cargas o intensidad clínica. Nuevos casos de medicación se apoyan en la explicación de AHA sobre betabloqueadores y respuesta del pulso; no se recomienda cambiar medicación. Las fuentes ACSM 2011/2013 se mantienen como fundamento, no como últimas guías.
