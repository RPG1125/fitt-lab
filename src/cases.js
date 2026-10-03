// Banco curado de escenarios ficticios. Los datos no son normas ni diagnósticos.
const LEVELS = [
  {id:1,name:'Fundamentos',role:'Explorador',difficulty:'Básica',points:10,description:'Reconoce la capacidad y selecciona una prueba pertinente.',next:'Ahora interpretarás resultados: una cifra aislada puede ocultar técnica, medicación o condiciones distintas.'},
  {id:2,name:'Interpretación',role:'Analista',difficulty:'Intermedia',points:20,description:'Interpreta resultados con factores de confusión y límites de medición.',next:'Ahora integrarás varios hallazgos a la vez. Habrá más de una acción correcta y deberás conectar la evaluación con FITT-VP.'},
  {id:3,name:'Integración',role:'Integrador',difficulty:'Avanzada',points:30,description:'Integra seguridad, contexto y hallazgos con FITT-VP. Selecciona todas las acciones pertinentes.',next:''}
];
function caseDef(id,level,domain,profile,title,scenario,options,correct,explanation,key,bridge) {
  return {id,level,domain,profile:{name:profile[0],age:profile[1],context:profile[2],goal:profile[3]},title,scenario,
    kind:level===3?'multi':'single',options:options.map(([id,text,why])=>({id,text,why})),correct,explanation,key,bridge,
    icon:DOMAINS.find(d=>d.id===domain).icon};
}
const CASES = [
  caseDef('l1-cardio-marina',1,'cardio',['Marina',42,'Trabajo administrativo; poca actividad habitual.','Subir escaleras con menos esfuerzo.'],
    '¿Qué prueba elegirías para explorar su capacidad funcional?',
    'Tras completar el cribado, el profesional considera apropiada una prueba de campo. Marina no corre habitualmente. Hay un recorrido seguro, cronómetro y personal capacitado.',[
      ['walk','Caminata de 6 minutos estandarizada, con distancia, respuesta al esfuerzo y síntomas.','Permite observar capacidad funcional y tolerancia al esfuerzo en este contexto.'],
      ['sprint','Sprint máximo de 100 metros sin preparación.','Prioriza velocidad y no corresponde al objetivo funcional propuesto.'],
      ['rest','Solo registrar frecuencia cardiaca en reposo.','Es información de contexto, no una evaluación suficiente de capacidad de esfuerzo.'],
      ['reach','Medir alcance del tronco.','Explora aspectos de flexibilidad, no capacidad cardiorrespiratoria.']
    ],['walk'],'La prueba debe ajustarse a objetivo, salud, población y recursos. La caminata informa capacidad funcional; no mide directamente VO₂máx.','Una prueba pertinente es mejor que la más exigente.','El resultado y la tolerancia orientan intensidad y tiempo del ejercicio aeróbico.'),
  caseDef('l1-cardio-diego',1,'cardio',['Diego',29,'Ciclista recreativo; sin síntomas tras el cribado.','Conocer su respuesta a un esfuerzo aeróbico controlado.'],
    '¿Qué opción aporta información pertinente sobre el esfuerzo aeróbico?',
    'El laboratorio dispone de cicloergómetro, supervisión y un protocolo submáximo validado que resulta apropiado para Diego. No se busca evaluar un sprint ni la fuerza máxima.',[
      ['cycle','Aplicar el protocolo submáximo en cicloergómetro y registrar carga, frecuencia cardiaca, esfuerzo percibido y síntomas.','Combina una tarea aeróbica controlada con respuesta fisiológica y tolerancia.'],
      ['hand','Medir solo fuerza de prensión.','La prensión mide una capacidad muscular local, no el desempeño aeróbico.'],
      ['waist','Registrar solo la cintura.','Aporta antropometría, pero no respuesta al esfuerzo.'],
      ['race','Competir hasta el agotamiento sin protocolo.','La exigencia sin estandarización no responde de forma adecuada al objetivo.']
    ],['cycle'],'La modalidad debe corresponder al propósito y a la persona. Incluso una persona activa necesita cribado y un procedimiento apropiado.','Ser activo no vuelve innecesarios el protocolo y el cribado.','La respuesta al esfuerzo ayuda a individualizar intensidad y progresión; una ecuación de estimación debe ser válida para el protocolo.'),
  caseDef('l1-body-lucia',1,'body',['Lucía',35,'Quiere retomar hábitos saludables; evaluación inicial.','Conocer su composición más allá del peso.'],
    '¿Qué evaluación informa más que la balanza?',
    'Hay balanza, tallímetro, cinta métrica y bioimpedancia con personal entrenado y protocolo adecuado. Lucía pregunta si basta con conocer sus kilogramos.',[
      ['estimate','Antropometría más estimación de composición mediante bioimpedancia estandarizada, reconociendo sus límites.','Agrega información sobre componentes, con método y condiciones explícitos.'],
      ['bmi','Registrar el IMC como si fuera el porcentaje de grasa.','El IMC es una relación peso-talla; no equivale a porcentaje de grasa.'],
      ['photo','Clasificar grasa y músculo por una foto.','La apariencia no reemplaza una evaluación válida y respetuosa.'],
      ['weight','Asumir que un mismo peso implica idéntica composición.','El mismo peso puede corresponder a proporciones distintas de tejidos.']
    ],['estimate'],'Peso, talla y cintura aportan contexto. Un método de estimación apropiado permite explorar componentes sin confundir IMC con grasa corporal.','Peso, IMC y composición no son sinónimos.','La composición apoya objetivos y seguimiento, pero no decide por sí sola la intensidad.'),
  caseDef('l1-body-andres',1,'body',['Andrés',32,'Entrena fuerza; consulta por un IMC elevado.','Entender si ese dato describe su grasa corporal.'],
    '¿Qué harías antes de concluir que tiene mucha grasa?',
    'Andrés tiene un IMC elevado y experiencia en entrenamiento de fuerza. No dispones aún de una evaluación de sus componentes corporales.',[
      ['context','Explorar composición con un método apropiado y contextualizar antropometría, salud y hábitos.','El IMC no distingue masa muscular y grasa.'],
      ['assume','Concluir un porcentaje de grasa exacto solo con el IMC.','Ese porcentaje no se puede deducir directamente del IMC.'],
      ['ignore','Descartar toda evaluación porque entrena fuerza.','Ser entrenado no elimina la necesidad de interpretar salud y objetivos.'],
      ['look','Decidir únicamente por su apariencia.','La apariencia no sustituye un método válido.']
    ],['context'],'El IMC puede servir para cribado, pero no separa grasa de músculo. La interpretación depende del contexto y requiere información complementaria.','No transformes un indicador de cribado en una medición de grasa.','Acordar objetivos necesita más información que una categoría de IMC.'),
  caseDef('l1-strength-elena',1,'strength',['Elena',51,'Trabajo manual; evaluación sin dolor actual.','Obtener un dato inicial de fuerza de la mano.'],
    '¿Qué prueba corresponde a fuerza de prensión?',
    'Tras el cribado, se considera apropiado evaluar la mano. Hay un dinamómetro de prensión y un protocolo estandarizado.',[
      ['grip','Dinamometría de prensión con posición, intentos y lado registrados.','Es una prueba específica de fuerza de la mano.'],
      ['pushups','Contar flexiones hasta el agotamiento.','Se orienta a resistencia muscular en otra tarea, no a prensión.'],
      ['walk','Usar la distancia caminada.','No evalúa la fuerza específica de la mano.'],
      ['squat','Probar inmediatamente una sentadilla máxima sin preparación.','No corresponde al objetivo de la mano y omite familiarización.']
    ],['grip'],'Define la capacidad y el grupo muscular antes de elegir la prueba. La dinamometría informa fuerza de prensión, no toda la fuerza corporal.','Especificidad: prueba, capacidad y objetivo deben coincidir.','Un dato local no permite asignar cargas de entrenamiento a todos los músculos.'),
  caseDef('l1-strength-santiago',1,'strength',['Santiago',24,'Sin experiencia en entrenamiento con cargas.','Iniciar una evaluación de fuerza de miembros inferiores.'],
    '¿Qué primera estrategia es más fundamentada?',
    'El cribado permite continuar y hay supervisión. Santiago aún no conoce la técnica de los movimientos. Se desea evaluar fuerza sin imponer una prueba máxima de entrada.',[
      ['familiarize','Familiarizar la técnica y elegir una prueba de fuerza apropiada al grupo muscular, experiencia y seguridad.','La preparación y la pertinencia preceden a la exigencia de la prueba.'],
      ['max','Empezar con 1RM sin enseñar la técnica.','Omite preparación y no es la decisión inicial automática para un principiante.'],
      ['handonly','Usar la prensión para fijar todas las cargas de las piernas.','La fuerza de mano no define directamente la de miembros inferiores.'],
      ['flexonly','Medir solo flexibilidad y concluir su fuerza.','Son capacidades distintas.']
    ],['familiarize'],'La selección puede incluir procedimientos submáximos apropiados, con criterios definidos. No hay una prueba universal para todos; una 1RM exige condiciones y preparación.','Primero técnica y prueba pertinente; después exigencia.','La carga inicial requiere evaluación específica y tolerancia, no copiar el peso de otra persona.'),
  caseDef('l1-flex-paula',1,'flex',['Paula',40,'Muchas horas sentada; rigidez sin dolor actual.','Conocer rango de movimiento de cadera.'],
    '¿Qué prueba responde al objetivo articular?',
    'El cribado permite una evaluación de movimiento. Se necesita conocer un rango específico de cadera y se dispone de goniómetro.',[
      ['goniometry','Goniometría con articulación, movimiento, lado, postura y dolor registrados.','Evalúa el rango articular específico con técnica reproducible.'],
      ['force','Forzar el movimiento hasta causar dolor.','El dolor no es la meta de la evaluación.'],
      ['balance','Registrar solo tiempo de apoyo unipodal.','Evalúa principalmente equilibrio, no ese rango articular.'],
      ['all','Usar un alcance del tronco para describir todas las articulaciones.','Una prueba de campo no resume toda la flexibilidad.']
    ],['goniometry'],'La flexibilidad es específica de articulaciones y movimientos. Se registra el protocolo y se evita provocar dolor.','Una articulación no representa toda la flexibilidad corporal.','Los rangos tolerados ayudan a escoger tipo de ejercicios y progresión.'),
  caseDef('l1-flex-omar',1,'flex',['Omar',27,'Practica deporte recreativo; sin síntomas actuales.','Entender qué informa una prueba sit-and-reach.'],
    '¿Qué afirmación sobre esta prueba es apropiada?',
    'Se propone una prueba sit-and-reach con protocolo válido. Omar cree que el resultado permitirá describir desde tobillos hasta hombros.',[
      ['specific','Interpretarla dentro de su alcance específico y evaluar otros rangos cuando el objetivo lo requiera.','No describe todos los movimientos y articulaciones.'],
      ['universal','Afirmar que un único resultado resume toda la flexibilidad.','Generaliza fuera del alcance de la prueba.'],
      ['strength','Interpretar los centímetros como fuerza máxima.','Las unidades de alcance no representan fuerza.'],
      ['pain','Buscar dolor para asegurar que llegó al límite.','El dolor no valida un resultado ni justifica forzar.']
    ],['specific'],'Las pruebas de campo tienen utilidad y límites. Sus resultados dependen del procedimiento y no sustituyen toda la evaluación articular.','Conocer lo que una prueba no mide también es evaluar bien.','El tipo de trabajo de movilidad debe responder a articulaciones y objetivos concretos.'),

  caseDef('l2-cardio-rosa',2,'cardio',['Rosa',58,'Condición estable; usa un betabloqueador prescrito.','Comprender su pulso durante ejercicio evaluado.'],
    '¿Cómo interpretas un pulso menor al esperado por edad?',
    'La evaluación apropiada al caso está supervisada. Rosa usa un betabloqueador y su frecuencia cardiaca no aumenta como predice una fórmula poblacional. No presenta síntomas en la situación descrita.',[
      ['medication','Considerar el efecto del medicamento y la respuesta individual; integrar esfuerzo percibido, síntomas y medidas pertinentes.','Los betabloqueadores modifican el pulso; una fórmula por edad no describe necesariamente esa respuesta.'],
      ['push','Aumentar la carga hasta alcanzar a toda costa el pulso predicho.','Puede imponer esfuerzo excesivo por perseguir una cifra no individualizada.'],
      ['stopmeds','Suspender el medicamento antes de la siguiente prueba.','El evaluador no debe indicar suspender una medicación prescrita por esta comparación.'],
      ['fit','Concluir que un pulso menor demuestra una capacidad aeróbica superior.','La medicación puede explicar la diferencia; no demuestra esa superioridad.']
    ],['medication'],'La medicación y el contexto alteran la interpretación de la frecuencia cardiaca. Los objetivos de intensidad deben individualizarse con criterios apropiados; no se cambia medicación por el juego.','Un pulso bajo puede reflejar medicación, no mejor capacidad.','La intensidad no se fija automáticamente con una fórmula de frecuencia máxima por edad.'),
  caseDef('l2-cardio-victor',2,'cardio',['Víctor',47,'Seguimiento de capacidad funcional.','Saber si una mayor distancia refleja progreso.'],
    '¿Puedes atribuir el cambio a una mejora real?',
    'Datos simulados: pasó de 480 a 510 m en dos caminatas de 6 minutos. La primera fue en un recorrido corto con más giros; la segunda, en uno más largo. También cambió el estímulo verbal del evaluador.',[
      ['compare','Revisar la comparabilidad: recorrido, giros y estímulo pueden afectar la distancia; no atribuir todo el cambio al entrenamiento.','El protocolo no fue equivalente, por lo que hay factores que confunden la comparación.'],
      ['vo2','Afirmar que ganó exactamente la misma cantidad de VO₂máx que de metros.','Metros y consumo de oxígeno no son medidas equivalentes.'],
      ['diagnose','Diagnosticar una mejora cardiaca específica solo por la distancia.','Una prueba funcional no demuestra por sí sola ese diagnóstico.'],
      ['ignore','Ignorar los protocolos porque la duración fue igual.','La duración no controla todos los factores de la prueba.']
    ],['compare'],'Los cambios de desempeño requieren condiciones comparables y consideración del error y la variabilidad. Los números son simulados y no tienen un punto de corte diagnóstico.','Sin protocolo comparable, no toda diferencia es adaptación.','La progresión se decide por evidencia interpretable y tolerancia, no por una diferencia aislada.'),
  caseDef('l2-body-natalia',2,'body',['Natalia',33,'Seguimiento mediante bioimpedancia.','Distinguir cambio corporal de cambio en condiciones.'],
    '¿Qué explicación debes considerar primero?',
    'Su estimación de grasa por bioimpedancia cambió entre visitas. La segunda se hizo después de entrenar y con distinta hidratación; la primera no. Se usó el mismo equipo.',[
      ['conditions','Revisar condiciones y repetir según el protocolo apropiado antes de concluir un cambio real.','Hidratación y ejercicio reciente pueden influir en la estimación.'],
      ['exact','Aceptar toda diferencia como pérdida exacta de grasa.','El método y sus condiciones introducen variabilidad.'],
      ['same','Asumir comparabilidad solo por usar el mismo equipo.','El equipo no elimina el efecto de condiciones diferentes.'],
      ['dose','Aumentar intensidad únicamente por ese porcentaje.','La dosis necesita integrar salud, capacidad y respuesta al esfuerzo.']
    ],['conditions'],'La estandarización no se limita al equipo. Registra y controla las condiciones pertinentes del método y evita interpretar cambios pequeños sin contexto.','El resultado puede cambiar sin que cambie el tejido en la misma magnitud.','La composición es un indicador de seguimiento, no un interruptor automático de intensidad.'),
  caseDef('l2-body-felipe',2,'body',['Felipe',45,'Seguimiento de hábitos y ejercicio.','Entender cambios con peso estable.'],
    '¿Qué puedes concluir con estos datos?',
    'Su peso no cambió, pero la cintura medida con el mismo procedimiento es menor. No tienes una evaluación directa o estimación apropiada de masa grasa y masa libre de grasa para ambas visitas.',[
      ['limited','Reconocer un cambio antropométrico y la posibilidad de cambios corporales, sin asignar cantidades exactas de grasa o músculo.','La cintura aporta información, pero no cuantifica por sí sola todos los componentes.'],
      ['nothing','Concluir que no hubo ningún cambio porque el peso es igual.','El peso estable puede coexistir con cambios en otros indicadores.'],
      ['muscle','Afirmar que ganó exactamente la misma masa de músculo que perdió de grasa.','No hay datos suficientes para cuantificar esos componentes.'],
      ['vo2','Concluir que mejoró su VO₂máx por el cambio de cintura.','La cintura no mide el consumo máximo de oxígeno.']
    ],['limited'],'El seguimiento exige distinguir lo observado de lo inferido. Peso y cintura son útiles, pero no describen con precisión todos los tejidos ni todas las capacidades.','Dato observado no equivale a conclusión ilimitada.','El plan se reevalúa con varios indicadores y metas acordadas, no solo con la balanza.'),
  caseDef('l2-strength-beatriz',2,'strength',['Beatriz',62,'Seguimiento de fuerza de mano.','Interpretar una diferencia entre visitas.'],
    '¿La diferencia demuestra una ganancia de fuerza?',
    'Datos simulados de prensión: 28 kg y luego 32 kg. En la segunda visita cambiaron la mano evaluada y la posición del codo. No se registró el mismo protocolo.',[
      ['protocol','No atribuir toda la diferencia al entrenamiento; revisar lado, posición y protocolo antes de comparar.','La mano y la postura pueden afectar el resultado de prensión.'],
      ['allbody','Concluir que toda su fuerza corporal aumentó en la misma proporción.','Una prueba local no describe todos los grupos musculares.'],
      ['load','Usar 32 kg directamente como carga de cualquier ejercicio.','El resultado de un dinamómetro no se traslada a toda máquina o movimiento.'],
      ['diagnose','Diagnosticar pérdida o ganancia exacta de músculo con esas cifras.','La fuerza no mide directamente masa muscular y el protocolo cambió.']
    ],['protocol'],'Para comparar fuerza se necesitan pruebas equivalentes: grupo, lado, técnica, posición y procedimiento. Las cifras son ficticias y no corresponden a criterios diagnósticos.','La técnica forma parte del dato, no es un detalle secundario.','La progresión de cargas se basa en evaluación pertinente y ejecución tolerada.'),
  caseDef('l2-strength-julian',2,'strength',['Julián',30,'Entrena con la misma carga y técnica estandarizada.','Interpretar un aumento de repeticiones.'],
    '¿Qué capacidad describe principalmente esta mejora?',
    'En el mismo ejercicio y con la misma carga, Julián pasó de 10 a 15 repeticiones con técnica comparable. No se aplicó una prueba de fuerza máxima ni se midió masa muscular.',[
      ['endurance','Mejor desempeño de resistencia muscular en esa tarea, sin demostrar por sí solo un aumento exacto de fuerza máxima.','Sostener más repeticiones a una carga dada se relaciona con resistencia muscular.'],
      ['max','Un aumento exacto del 50 % de fuerza máxima.','La proporción de repeticiones no equivale a proporción de fuerza máxima.'],
      ['mass','Una ganancia cuantificable de masa muscular.','No se midió ese componente corporal.'],
      ['cardio','Una medición directa de VO₂máx.','La tarea de repeticiones no es una medición directa de consumo de oxígeno.']
    ],['endurance'],'La capacidad evaluada depende de la tarea y de cómo se mide. Más repeticiones no equivale automáticamente a mayor fuerza máxima en la misma proporción.','Fuerza y resistencia muscular son relacionadas, pero distintas.','Al programar, distingue la carga de la cantidad de repeticiones y del volumen total.'),
  caseDef('l2-flex-carolina',2,'flex',['Carolina',38,'Reevaluación de rango de hombro.','Saber si el rango realmente mejoró.'],
    '¿Qué debes revisar antes de afirmar progreso?',
    'El segundo ángulo registrado es mayor, pero cambió el evaluador y se permitió una compensación del tronco que antes se controlaba. La postura no fue equivalente.',[
      ['technique','La técnica, postura y compensaciones: el cambio puede reflejar una medición distinta, no solo mayor rango articular.','Las compensaciones pueden aumentar la lectura sin un cambio equivalente de la articulación.'],
      ['stretch','Aumentar de inmediato el rango de los estiramientos por el número más alto.','No se ha establecido que la comparación sea válida ni que ese rango sea tolerado.'],
      ['universal','Concluir que mejoró la flexibilidad de todo su cuerpo.','Un movimiento de hombro no representa todas las articulaciones.'],
      ['exact','Atribuir toda la diferencia al programa, sin revisar la técnica.','Omite un factor de confusión explícito.']
    ],['technique'],'Controlar compensaciones y estandarizar posiciones mejora la interpretación de la goniometría. El cambio de evaluador también exige considerar variabilidad y procedimiento.','Más grados no siempre significa más movilidad real de esa articulación.','La progresión del rango necesita tolerancia y mediciones interpretables.'),
  caseDef('l2-flex-ricardo',2,'flex',['Ricardo',54,'Movimiento de hombro limitado por dolor.','Entender qué significa el rango observado.'],
    '¿Qué interpretación es más prudente?',
    'La evaluación registra un rango menor en el hombro que duele. La maniobra se detuvo al aparecer dolor. No hay todavía una valoración completa de la causa.',[
      ['context','El rango observado está influido por dolor y contexto; requiere interpretación clínica, no atribuirlo solo a falta de flexibilidad.','El dolor puede limitar la prueba y no permite deducir una causa única.'],
      ['diagnose','Diagnosticar una lesión específica solo por ese ángulo.','Un ángulo y dolor no bastan para ese diagnóstico.'],
      ['force','Repetir forzando para eliminar el efecto del dolor.','Forzar no corrige la interpretación y puede ser inapropiado.'],
      ['ignore','Omitir el dolor del registro porque solo importa el ángulo.','El dolor es relevante para interpretar y adaptar.']
    ],['context'],'Se distingue el dato del rango de la causa del límite. Registrar síntomas, técnica y antecedentes permite orientar una evaluación apropiada sin diagnosticar por una sola cifra.','El dolor cambia la interpretación, no debe borrarse del expediente.','El tipo y la progresión de movilidad deben responder a tolerancia y valoración del caso.'),

  caseDef('l3-cardio-esteban',3,'cardio',['Esteban',57,'Quiere iniciar ejercicio; reporta presión torácica reciente con esfuerzo.','Conocer cómo proceder antes de las pruebas.'],
    '¿Qué acciones integrarías antes de continuar?',
    'Durante el cribado cuenta episodios recientes de presión torácica al subir escaleras. Ahora no tiene dolor. Todavía no se han realizado pruebas. Selecciona todas las acciones pertinentes.',[
      ['defer','Posponer las pruebas de esfuerzo y la prescripción exigente hasta la valoración clínica apropiada.','Los síntomas con esfuerzo requieren evaluación antes de imponer nuevas exigencias.'],
      ['document','Documentar síntomas, circunstancias, antecedentes y medicación relevante.','Es información esencial para una valoración y coordinación adecuadas.'],
      ['clinical','Gestionar valoración clínica; si aparecen síntomas actuales de alarma, priorizar atención urgente.','La respuesta depende de la situación, con seguridad como prioridad.'],
      ['max','Aplicar una prueba máxima para averiguar si el síntoma es importante.','No debe provocarse esfuerzo máximo para resolver este hallazgo sin evaluación apropiada.'],
      ['age','Asignar intensidad solo con una fórmula por edad.','Una fórmula no resuelve los síntomas ni sustituye evaluación.']
    ],['defer','document','clinical'],'En este caso, seguridad precede a las cuatro pruebas. No se establece un diagnóstico. La valoración médica no es universal para todos: aquí existe un síntoma concreto que la hace pertinente.','A veces la mejor decisión de evaluación es no iniciar todavía una prueba de esfuerzo.','La intensidad y progresión no se definen antes de aclarar un hallazgo de seguridad.'),
  caseDef('l3-cardio-adriana',3,'cardio',['Adriana',60,'Condición estable y betabloqueador; evaluación individual apropiada.','Acordar una dosis aeróbica viable y monitorizada.'],
    '¿Qué información y decisiones necesitas integrar?',
    'La valoración permite ejercicio apropiado al caso. El pulso está modificado por medicación; la tolerancia fue registrada. Adriana dispone de tres días y prefiere caminar. Aún no hay un plan de seguimiento.',[
      ['intensity','Individualizar la intensidad considerando respuesta, medicación, esfuerzo percibido y síntomas; no perseguir una cifra por edad.','La medicación puede alterar la relación entre carga y pulso.'],
      ['feasible','Acordar frecuencia, tiempo y tipo compatibles con objetivos, disponibilidad y tolerancia.','La dosis debe ser viable y apropiada para la persona.'],
      ['follow','Definir seguimiento y criterios para ajustar volumen y progresión según respuesta.','Sin reevaluación, no se justifica cómo cambiar la dosis.'],
      ['stopmeds','Suspender el betabloqueador para usar una fórmula estándar.','No se cambia medicación prescrita desde este juego.'],
      ['generic','Copiar la intensidad y progresión de una persona sin medicación.','La misma fórmula no garantiza una dosis individualizada.']
    ],['intensity','feasible','follow'],'La evaluación informa FITT-VP y se integra con la viabilidad y las respuestas. Las decisiones clínicas y la medicación se coordinan con el profesional responsable; el juego no fija una dosis concreta.','Individualizar significa integrar salud, respuesta y vida cotidiana.','Frecuencia, Intensidad, Tiempo, Tipo, Volumen y Progresión trabajan como un conjunto.'),
  caseDef('l3-body-teresa',3,'body',['Teresa',72,'Perdió peso tras cambios alimentarios; ahora refiere menos fuerza y fatiga.','Mejorar salud y función, no solo bajar kilogramos.'],
    '¿Qué plan de evaluación es más completo?',
    'Teresa celebra un peso menor, pero informa dificultad nueva en tareas cotidianas. No tienes aún composición, evaluación muscular, tolerancia ni una valoración de la fatiga. Selecciona todas las acciones pertinentes.',[
      ['muscle','Evaluar composición con un método apropiado e interpretar junto con fuerza y desempeño funcional.','Menor peso no informa qué tejidos cambiaron ni cómo funciona la persona.'],
      ['health','Explorar antecedentes, síntomas, medicación y necesidad de valoración clínica o nutricional pertinente.','La fatiga y la pérdida de función necesitan contexto y valoración apropiada.'],
      ['fitness','Completar los demás núcleos con pruebas seguras y pertinentes, considerando tolerancia y objetivos.','La composición no reemplaza capacidad cardiorrespiratoria, fuerza y flexibilidad.'],
      ['goals','Revisar metas y seguimiento para priorizar función y ajustar FITT-VP según resultados y respuesta.','El plan debe responder al objetivo y a la evolución, no solo a un peso meta.'],
      ['fatloss','Aumentar la exigencia para perder más peso sin explorar la fatiga.','Ignora señales relevantes y asume que todo descenso es beneficioso.']
    ],['muscle','health','fitness','goals'],'El descenso de peso no se interpreta automáticamente como mejora de todos los componentes. Función, síntomas, tejidos y contexto necesitan integrarse. No se diagnostica sarcopenia ni otra condición desde este caso.','Un objetivo de salud no puede reducirse al número de la balanza.','El tipo, la intensidad y el volumen deben apoyar función y salud con seguimiento apropiado.'),
  caseDef('l3-body-daniela',3,'body',['Daniela',26,'Deportista recreativa; composición estimada en condiciones cambiantes.','Ajustar objetivos sin perder rendimiento.'],
    '¿Qué decisiones sí están sustentadas por la evaluación?',
    'Dos bioimpedancias se hicieron con hidratación distinta. También faltan resultados de capacidad aeróbica y fuerza, y no se acordaron metas compatibles con su actividad. Quiere una rutina nueva hoy.',[
      ['repeat','Revisar comparabilidad y obtener una estimación interpretable antes de atribuir cambios a grasa o músculo.','Las condiciones cambiantes limitan las conclusiones del seguimiento.'],
      ['integrate','Completar la evaluación pertinente y acordar metas; no asignar la dosis solo por una estimación de grasa.','FITT-VP necesita condición física, salud, respuesta y contexto.'],
      ['extreme','Fijar una pérdida rápida de peso por la cifra aislada.','No hay base para ese objetivo ni contexto suficiente.'],
      ['universal','Copiar un volumen de entrenamiento estándar sin revisar tolerancia.','El volumen debe individualizarse.'],
      ['exact','Aceptar la diferencia como cambio exacto de tejido porque el equipo es el mismo.','Las condiciones también importan.']
    ],['repeat','integrate'],'Primero se revisa la calidad del dato y se completa lo que falta. No se requiere un valor específico de grasa para cada persona ni se impone un objetivo por apariencia.','Una cifra incierta no fundamenta una dosis precisa.','La composición puede orientar metas; no decide sola intensidad, volumen o progresión.'),
  caseDef('l3-strength-gabriel',3,'strength',['Gabriel',66,'Sin entrenamiento con cargas; quiere mejorar tareas cotidianas.','Ganar función y fuerza de miembros inferiores.'],
    '¿Qué acciones prepararían una prescripción de fuerza?',
    'Solo se midió prensión. Gabriel quiere subir escaleras y levantarse con más facilidad; reporta molestias ocasionales de rodilla que aún deben explorarse. Selecciona todas las acciones pertinentes.',[
      ['specific','Explorar síntomas y evaluar los grupos y tareas pertinentes, con técnica y pruebas apropiadas.','La mano no describe toda la fuerza y la molestia debe contextualizarse.'],
      ['dose','Familiarizar ejercicios y ajustar carga, series y repeticiones a la ejecución y tolerancia evaluadas.','La dosis de fuerza necesita más que el valor de prensión.'],
      ['review','Planear seguimiento y progresión de carga o volumen según respuesta, sin forzar dolor.','La progresión requiere evidencia de tolerancia y adaptación.'],
      ['same','Usar el número del dinamómetro como carga de sentadilla.','Un dato local no equivale a la carga de otro movimiento.'],
      ['max','Hacer una 1RM de entrada sin familiarización ni explorar las molestias.','Omite preparación y contexto relevante.']
    ],['specific','dose','review'],'La evaluación muscular se ajusta al objetivo y se integra con síntomas y función. No se diagnostica la rodilla ni se asignan kilogramos desde el juego.','Una prueba local no completa una evaluación para todas las tareas.','Tipo, Intensidad, Volumen y Progresión de fuerza dependen de técnica y tolerancia.'),
  caseDef('l3-strength-valeria',3,'strength',['Valeria',34,'Ha aumentado simultáneamente sesiones, series y cargas.','Mejorar fuerza de forma sostenible.'],
    '¿Qué revisarías antes de seguir aumentando la dosis?',
    'Sus registros de fuerza mejoraron en condiciones comparables, pero ahora reporta fatiga persistente y peor recuperación. El plan subió frecuencia, series y carga a la vez. No hay criterios de progresión.',[
      ['response','Interpretar los resultados junto con fatiga, recuperación y síntomas, explorando si requiere valoración adicional.','Mejorar una prueba no elimina información sobre tolerancia actual.'],
      ['volume','Revisar frecuencia, intensidad y volumen total, no confundir más trabajo con mejor adaptación.','Varias dimensiones de la dosis cambiaron a la vez.'],
      ['progress','Definir ajustes graduales y reevaluación según respuesta en vez de aumentar todas las variables automáticamente.','La progresión se fundamenta en tolerancia y objetivos.'],
      ['ignore','Ignorar la fatiga porque la prueba mejoró.','El rendimiento no es el único indicador relevante.'],
      ['double','Duplicar de nuevo frecuencia, carga y series para acelerar la adaptación.','No se justifica con una recuperación deteriorada.']
    ],['response','volume','progress'],'FITT-VP permite distinguir dimensiones de la dosis. Un mejor resultado de fuerza no justifica progresar automáticamente si la respuesta cotidiana se deteriora.','Progresar no siempre significa aumentar todo.','Frecuencia, Intensidad, Volumen y Progresión deben revisarse como variables distintas.'),
  caseDef('l3-flex-fernando',3,'flex',['Fernando',49,'Trabajo por encima de la cabeza; dolor al elevar un hombro.','Mejorar movimiento tolerado para tareas cotidianas.'],
    '¿Qué acciones integrarías para evaluar y orientar el plan?',
    'En la maniobra aparece dolor y se detiene. Hay diferencia entre lados, pero no una valoración completa. Fernando pide estirar más fuerte para igualarlos.',[
      ['clinical','Registrar dolor, contexto y antecedentes; valorar si necesita evaluación clínica antes de continuar.','El hallazgo requiere interpretación y no un diagnóstico por ángulo.'],
      ['specific','Usar evaluación específica con técnica y límites tolerados, evitando forzar la maniobra dolorosa.','La seguridad y la pertinencia delimitan el procedimiento.'],
      ['adapt','Orientar tipo y progresión de movilidad con hallazgos y tolerancia; reevaluar antes de aumentar rangos.','La prescripción no parte de igualar ambos lados a cualquier costo.'],
      ['force','Empujar más para lograr el mismo ángulo en ambos hombros.','Ignora el dolor y convierte una diferencia en una meta forzada.'],
      ['diagnose','Diagnosticar una lesión específica solo por la asimetría.','Una diferencia no identifica por sí sola la causa.']
    ],['clinical','specific','adapt'],'La flexibilidad se interpreta con síntomas, tareas y condiciones de medición. La meta es un plan pertinente y tolerado, no una cifra simétrica a toda costa.','El rango útil se interpreta con función y tolerancia.','El Tipo y la Progresión deben responder al caso; el tiempo de estiramiento no se impone ignorando dolor.'),
  caseDef('l3-flex-isabel',3,'flex',['Isabel',70,'Refiere rigidez y dos caídas recientes.','Moverse con más confianza en su vida diaria.'],
    '¿Qué sumarías a los cuatro núcleos?',
    'Aún no se conocen las circunstancias de las caídas. Isabel quiere una rutina de estiramientos, pero faltan equilibrio, marcha, antecedentes y respuesta funcional. Selecciona todas las acciones pertinentes.',[
      ['falls','Explorar circunstancias, síntomas, medicación y necesidad de valoración clínica de las caídas.','Las caídas tienen posibles causas que no se resuelven con una prueba de flexibilidad.'],
      ['balance','Agregar equilibrio, marcha y desempeño funcional con pruebas apropiadas al contexto.','Son dimensiones relevantes para su objetivo, además de los cuatro núcleos.'],
      ['range','Evaluar rangos articulares específicos, sin dolor, sin usar una sola prueba para todo el cuerpo.','La flexibilidad requiere especificidad y técnica.'],
      ['integrate','Integrar hallazgos, preferencias, recursos y seguimiento para escoger tipos de ejercicio y progresión.','El plan no se limita a estirar si otros componentes son pertinentes.'],
      ['stretchonly','Prescribir solo estiramientos y omitir la exploración de las caídas.','Reduce el problema a rigidez sin fundamento.']
    ],['falls','balance','range','integrate'],'Los cuatro núcleos son la base de esta clase, no una lista exhaustiva. Se añaden dimensiones y valoración de salud según el caso; el juego no identifica la causa de las caídas.','La complejidad real exige ampliar la evaluación, no solo acumular pruebas.','El Tipo de ejercicio y su Progresión se eligen con función, seguridad y objetivos.'),
];
