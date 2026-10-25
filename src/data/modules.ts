export type ToolId = 'presupuesto' | 'emergencia' | 'interes' | 'deudas' | 'metas' | 'salud'

export interface Quiz {
  question: string
  options: string[]
  answer: number
  explain: string
}

export interface Lesson {
  id: string
  title: string
  minutes: number
  kind: 'lectura' | 'práctica' | 'reto'
  intro: string
  points: string[]
  tip?: string
  prompt?: string
  tool?: ToolId
  quiz?: Quiz
}

export interface Module {
  id: string
  title: string
  tagline: string
  color: 'mint' | 'violet' | 'gold' | 'sky' | 'rose' | 'emerald'
  icon: 'brain' | 'scan' | 'wallet' | 'shield' | 'chain' | 'trend'
  lessons: Lesson[]
}

export const modules: Module[] = [
  {
    id: 'ia-sin-miedo',
    title: 'IA sin miedo',
    tagline: 'Entiende qué es, qué no es y da tu primer paso con confianza.',
    color: 'violet',
    icon: 'brain',
    lessons: [
      {
        id: 'que-es',
        title: '¿Qué es realmente la IA?',
        minutes: 6,
        kind: 'lectura',
        intro:
          'Un asistente de IA como ChatGPT, Claude o Gemini es un programa que aprendió a escribir leyendo muchísimo texto. No piensa como una persona ni tiene intenciones: predice la mejor respuesta según lo que le pides.',
        points: [
          'Es una herramienta, como una calculadora que entiende lenguaje.',
          'Sus respuestas dependen de qué tan claro le pidas las cosas.',
          'Puede equivocarse: tú siempre tienes la última palabra.',
          'No necesitas saber programar para usarla.',
        ],
        tip: 'Piensa en la IA como un asistente muy rápido y muy leído, pero nuevo en tu vida: necesita contexto.',
        quiz: {
          question: '¿Cuál es la mejor forma de ver a un asistente de IA?',
          options: ['Un experto infalible', 'Una herramienta que necesita contexto y supervisión', 'Un programa que solo sirve a programadores'],
          answer: 1,
          explain: 'La IA es poderosa, pero tú decides. Dale contexto y verifica lo importante.',
        },
      },
      {
        id: 'mitos',
        title: 'Los 5 mitos que te frenan',
        minutes: 7,
        kind: 'lectura',
        intro: 'El miedo casi siempre viene de lo desconocido. Desarmemos los mitos más comunes.',
        points: [
          '“Es muy difícil” → Si sabes escribir un mensaje de WhatsApp, sabes usar IA.',
          '“Me va a reemplazar” → Quien aprende a usarla gana ventaja, no la pierde.',
          '“Lo sabe todo” → Se equivoca. Por eso aprendemos a verificar.',
          '“Es peligrosa para mis datos” → Lo es solo si compartes lo que no debes. Aquí aprendes qué no compartir.',
          '“Ya es tarde para mí” → La mayoría de las personas recién está empezando. Estás a tiempo.',
        ],
        quiz: {
          question: '¿Qué habilidad necesitas para empezar a usar IA?',
          options: ['Programar en Python', 'Escribir mensajes claros', 'Tener un título en tecnología'],
          answer: 1,
          explain: 'Escribir con claridad es el 90% del trabajo.',
        },
      },
      {
        id: 'privacidad',
        title: 'Tu escudo de privacidad',
        minutes: 5,
        kind: 'lectura',
        intro: 'Usar IA con tus finanzas es seguro si sigues reglas simples. Esta es tu lista de oro.',
        points: [
          'Nunca compartas contraseñas, PIN, códigos de verificación ni números completos de tarjeta.',
          'Usa cifras redondeadas: “gano unos 1.500” es suficiente.',
          'Nada de documentos de identidad ni números de cuenta.',
          'Si algo te pide datos sensibles “para ayudarte”, desconfía: puede ser una estafa.',
        ],
        tip: 'Regla práctica: comparte con la IA lo mismo que le contarías a un asesor en una primera reunión.',
        quiz: {
          question: '¿Cuál de estos datos SÍ es razonable compartir?',
          options: ['El PIN de tu tarjeta', 'Tu ingreso mensual aproximado', 'El código que te llegó por SMS'],
          answer: 1,
          explain: 'Las cifras aproximadas dan contexto sin exponerte.',
        },
      },
      {
        id: 'primer-prompt',
        title: 'Tu primera conversación',
        minutes: 8,
        kind: 'práctica',
        intro:
          'Un buen mensaje (prompt) tiene 4 partes: quién eres, qué quieres, el contexto y el formato de respuesta. Copia este y pruébalo en tu asistente favorito.',
        points: ['Rol: “Actúa como…”', 'Objetivo: qué necesitas lograr', 'Contexto: tu situación en cifras aproximadas', 'Formato: lista, tabla, pasos'],
        prompt:
          'Actúa como un educador financiero paciente. Soy principiante y me da un poco de miedo usar IA. Explícame en 5 pasos sencillos cómo podría empezar a organizar mi dinero este mes. Usa ejemplos cotidianos y termina con una pregunta para conocerme mejor.',
      },
    ],
  },
  {
    id: 'radiografia',
    title: 'Tu radiografía financiera',
    tagline: 'Descubre dónde estás parado con números claros, sin culpa.',
    color: 'mint',
    icon: 'scan',
    lessons: [
      {
        id: 'ingresos-gastos',
        title: 'Ingresos vs. gastos',
        minutes: 6,
        kind: 'lectura',
        intro: 'Todo plan empieza con una foto honesta: cuánto entra y cuánto sale cada mes.',
        points: [
          'Anota tu ingreso neto (lo que realmente llega a tu cuenta).',
          'Separa gastos fijos (renta, servicios) de variables (comida, salidas).',
          'Revisa los últimos 3 meses, no solo uno.',
          'Los gastos hormiga (cafés, apps, envíos) suelen sumar más de lo que crees.',
        ],
        prompt:
          'Te voy a pasar mis gastos aproximados del mes. Agrúpalos en categorías (vivienda, comida, transporte, deudas, ocio, suscripciones, otros), suma cada una y dime qué porcentaje representa de un ingreso de [TU INGRESO]. Gastos: [PEGA AQUÍ TU LISTA]',
      },
      {
        id: 'salud',
        title: 'Tu puntaje de salud financiera',
        minutes: 5,
        kind: 'práctica',
        intro: 'Medimos tres cosas: cuánto ahorras, cuántos meses aguantarías sin ingresos y qué tanto pesan tus deudas.',
        points: ['Tasa de ahorro ideal: 20% o más.', 'Colchón ideal: 3 a 6 meses de gastos.', 'Deuda total sana: menos de 50% de tu ingreso anual.'],
        tool: 'salud',
      },
      {
        id: 'reto-registro',
        title: 'Reto: 7 días de registro',
        minutes: 4,
        kind: 'reto',
        intro: 'Durante 7 días anota cada gasto. Al final, pídele a la IA que los analice contigo.',
        points: ['Usa las notas del celular o una hoja simple.', 'No juzgues, solo registra.', 'El día 7 usa el prompt de la lección anterior.'],
        tip: 'La claridad reduce la ansiedad. Lo que se mide, se mejora.',
      },
    ],
  },
  {
    id: 'presupuesto',
    title: 'Presupuesto inteligente',
    tagline: 'Un sistema simple para que tu dinero tenga un propósito.',
    color: 'gold',
    icon: 'wallet',
    lessons: [
      {
        id: '503020',
        title: 'La regla 50/30/20',
        minutes: 6,
        kind: 'práctica',
        intro: 'Divide tu ingreso: 50% necesidades, 30% deseos, 20% ahorro y pago de deudas. Es un punto de partida, no una ley.',
        points: ['Si tus necesidades superan el 50%, empieza con 60/20/20.', 'Paga primero tu ahorro: transfiérelo el día de cobro.', 'Ajusta cada mes según tu realidad.'],
        tool: 'presupuesto',
        quiz: {
          question: 'Con un ingreso de 2.000, ¿cuánto va a ahorro según 50/30/20?',
          options: ['200', '400', '600'],
          answer: 1,
          explain: 'El 20% de 2.000 es 400.',
        },
      },
      {
        id: 'ia-presupuesto',
        title: 'Arma tu presupuesto con IA',
        minutes: 8,
        kind: 'práctica',
        intro: 'Deja que la IA haga el trabajo pesado de ordenar números, tú tomas las decisiones.',
        points: ['Dale tu ingreso y gastos aproximados.', 'Pídele una tabla y 3 recortes posibles.', 'Elige tú cuál aplicar.'],
        prompt:
          'Mi ingreso neto mensual es [X]. Mis gastos fijos son: [LISTA]. Mis gastos variables aproximados son: [LISTA]. Créame un presupuesto mensual en formato tabla usando la regla 50/30/20 adaptada a mi realidad, y sugiere 3 recortes concretos que no afecten mi calidad de vida.',
      },
    ],
  },
  {
    id: 'colchon',
    title: 'Fondo de emergencia y metas',
    tagline: 'Duerme tranquilo con un colchón y metas que sí se cumplen.',
    color: 'sky',
    icon: 'shield',
    lessons: [
      {
        id: 'fondo',
        title: 'Tu fondo de emergencia',
        minutes: 6,
        kind: 'práctica',
        intro: 'Es dinero solo para imprevistos: salud, reparaciones, pérdida de empleo. Meta: 3 a 6 meses de gastos esenciales.',
        points: ['Guárdalo separado de tu cuenta de uso diario.', 'Debe estar disponible rápido, no invertido en riesgo.', 'Empieza con una mini meta: 1 mes.'],
        tool: 'emergencia',
      },
      {
        id: 'metas-smart',
        title: 'Metas que se cumplen',
        minutes: 6,
        kind: 'práctica',
        intro: 'Una meta clara tiene monto, fecha y un aporte mensual automático.',
        points: ['Específica: “6.000 para mi colchón”.', 'Con fecha: “en 12 meses”.', 'Automática: transferencia programada.'],
        tool: 'metas',
        prompt: 'Quiero ahorrar [MONTO] para [META] en [MESES] meses. Hoy tengo [AHORRO]. Hazme un plan mes a mes con hitos para celebrar y 3 ideas para ingresos extra realistas.',
      },
    ],
  },
  {
    id: 'deudas',
    title: 'Sal de deudas',
    tagline: 'Estrategias probadas para liberarte más rápido y pagar menos.',
    color: 'rose',
    icon: 'chain',
    lessons: [
      {
        id: 'estrategias',
        title: 'Avalancha vs. bola de nieve',
        minutes: 7,
        kind: 'práctica',
        intro: 'Dos métodos: avalancha (mayor tasa primero, pagas menos intereses) y bola de nieve (menor saldo primero, ganas motivación rápido).',
        points: ['Paga siempre el mínimo de todas.', 'Todo excedente va a la deuda prioritaria.', 'Cuando liquidas una, su pago se suma a la siguiente.'],
        tool: 'deudas',
        quiz: {
          question: '¿Qué método minimiza los intereses totales?',
          options: ['Bola de nieve', 'Avalancha', 'Pagar solo los mínimos'],
          answer: 1,
          explain: 'Atacar primero la tasa más alta reduce el interés total.',
        },
      },
      {
        id: 'negociar',
        title: 'Negocia con la IA de copiloto',
        minutes: 6,
        kind: 'práctica',
        intro: 'Puedes pedir mejores condiciones a tu banco. La IA te ayuda a preparar el guion.',
        points: ['Pregunta por consolidación o reducción de tasa.', 'Ten a mano tu historial de pagos.', 'Pide todo por escrito.'],
        prompt:
          'Ayúdame a preparar una llamada a mi banco para pedir una reducción de la tasa de mi tarjeta de crédito (tasa actual aprox. [X]%). Llevo [N] meses pagando puntual. Dame un guion amable, 3 argumentos y qué responder si me dicen que no.',
      },
    ],
  },
  {
    id: 'crecer',
    title: 'Haz crecer tu dinero',
    tagline: 'El interés compuesto y cómo proteger tu dinero de estafas.',
    color: 'emerald',
    icon: 'trend',
    lessons: [
      {
        id: 'compuesto',
        title: 'La magia del interés compuesto',
        minutes: 6,
        kind: 'práctica',
        intro: 'Cuando tus ganancias generan nuevas ganancias, el tiempo se vuelve tu mejor aliado.',
        points: ['Empezar temprano vale más que aportar mucho.', 'La constancia mensual es la clave.', 'Las comisiones altas se comen tu rendimiento.'],
        tool: 'interes',
      },
      {
        id: 'estafas',
        title: 'Detecta estafas (también con IA)',
        minutes: 6,
        kind: 'lectura',
        intro: 'Las estafas usan cada vez más IA. Estas señales te protegen.',
        points: [
          'Rendimientos “garantizados” muy altos = alerta roja.',
          'Presión para decidir ya.',
          'Te piden códigos, contraseñas o pagos por adelantado.',
          'Voces o videos de conocidos pidiendo dinero urgente: verifica por otro canal.',
        ],
        prompt: 'Recibí esta oferta de inversión: [PEGA EL MENSAJE]. Analízala como experto en fraudes y dime qué señales de alerta ves y qué preguntas debería hacer antes de confiar.',
        quiz: {
          question: 'Te prometen 20% mensual garantizado. ¿Qué haces?',
          options: ['Invierto rápido antes de que se acabe', 'Desconfío: es una señal típica de estafa', 'Le paso mis datos para que me registre'],
          answer: 1,
          explain: 'Ninguna inversión legítima garantiza rendimientos así.',
        },
      },
      {
        id: 'plan-final',
        title: 'Reto final: tu plan completo',
        minutes: 10,
        kind: 'reto',
        intro: 'Junta todo lo aprendido en tu plan financiero personal y descárgalo.',
        points: ['Completa tu perfil.', 'Revisa tu presupuesto, colchón y deudas.', 'Genera e imprime tu plan.'],
        tip: 'Repasa tu plan cada mes. Un plan vivo vale más que uno perfecto.',
      },
    ],
  },
]

export const allLessonIds = modules.flatMap((m) => m.lessons.map((l) => `${m.id}/${l.id}`))
export const totalMinutes = modules.reduce((a, m) => a + m.lessons.reduce((b, l) => b + l.minutes, 0), 0)

export function findLesson(moduleId: string, lessonId: string) {
  const mod = modules.find((m) => m.id === moduleId)
  const idx = mod?.lessons.findIndex((l) => l.id === lessonId) ?? -1
  if (!mod || idx < 0) return null
  const flat = modules.flatMap((m) => m.lessons.map((l) => ({ m, l })))
  const pos = flat.findIndex((x) => x.m.id === moduleId && x.l.id === lessonId)
  return { mod, lesson: mod.lessons[idx], prev: flat[pos - 1] ?? null, next: flat[pos + 1] ?? null }
}
