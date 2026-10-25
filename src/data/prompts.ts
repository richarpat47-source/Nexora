export interface PromptItem {
  id: string
  category: 'Empezar' | 'Presupuesto' | 'Deudas' | 'Ahorro' | 'Inversión' | 'Seguridad'
  title: string
  level: 'Básico' | 'Intermedio'
  text: string
}

export const prompts: PromptItem[] = [
  {
    id: 'p1',
    category: 'Empezar',
    title: 'Rompe el hielo con la IA',
    level: 'Básico',
    text: 'Actúa como un educador financiero paciente. Soy principiante y me da miedo equivocarme. Hazme 5 preguntas, una por una, para entender mi situación financiera antes de darme cualquier consejo.',
  },
  {
    id: 'p2',
    category: 'Empezar',
    title: 'Explícamelo como a un niño',
    level: 'Básico',
    text: 'Explícame qué es [CONCEPTO: inflación / interés compuesto / fondo indexado] como si tuviera 12 años, con un ejemplo de la vida diaria y una analogía.',
  },
  {
    id: 'p3',
    category: 'Presupuesto',
    title: 'Clasifica mis gastos',
    level: 'Básico',
    text: 'Clasifica estos gastos en categorías y dime el total y porcentaje de cada una sobre un ingreso de [INGRESO]. Señala los 3 gastos hormiga más grandes. Gastos: [LISTA]',
  },
  {
    id: 'p4',
    category: 'Presupuesto',
    title: 'Presupuesto 50/30/20 a mi medida',
    level: 'Intermedio',
    text: 'Con un ingreso neto de [X] y estos gastos fijos [LISTA], crea un presupuesto 50/30/20 en tabla. Si mis necesidades superan el 50%, propón una versión realista y un plan de 3 meses para acercarme al ideal.',
  },
  {
    id: 'p5',
    category: 'Deudas',
    title: 'Plan para salir de deudas',
    level: 'Intermedio',
    text: 'Tengo estas deudas: [NOMBRE – saldo – tasa anual – pago mínimo]. Puedo destinar [MONTO] al mes. Compara los métodos avalancha y bola de nieve, dime cuánto tardaría y cuánto interés pagaría con cada uno.',
  },
  {
    id: 'p6',
    category: 'Deudas',
    title: 'Guion para negociar con el banco',
    level: 'Básico',
    text: 'Escríbeme un guion amable y firme para pedirle a mi banco una reducción de tasa o un plan de pagos. Incluye qué decir si me responden que no.',
  },
  {
    id: 'p7',
    category: 'Ahorro',
    title: 'Meta de ahorro con hitos',
    level: 'Básico',
    text: 'Quiero ahorrar [MONTO] para [META] en [MESES] meses. Dame un plan mes a mes, hitos para celebrar y 5 trucos para no gastarme el ahorro.',
  },
  {
    id: 'p8',
    category: 'Ahorro',
    title: 'Ingresos extra realistas',
    level: 'Intermedio',
    text: 'Tengo estas habilidades: [LISTA] y unas [HORAS] horas libres por semana. Sugiere 5 formas realistas y legales de generar ingresos extra, con inversión inicial, tiempo para el primer pago y riesgos.',
  },
  {
    id: 'p9',
    category: 'Inversión',
    title: 'Entiende antes de invertir',
    level: 'Intermedio',
    text: 'Explícame las diferencias entre cuenta de ahorro, certificado/depósito a plazo y fondo indexado: riesgo, liquidez, rendimiento esperado y para qué tipo de meta conviene cada uno. No me recomiendes productos específicos.',
  },
  {
    id: 'p10',
    category: 'Seguridad',
    title: 'Detector de estafas',
    level: 'Básico',
    text: 'Analiza este mensaje/oferta como experto en fraudes financieros: [PEGA EL TEXTO]. Enumera las señales de alerta y qué debería verificar antes de responder.',
  },
  {
    id: 'p11',
    category: 'Seguridad',
    title: 'Verifica la respuesta de la IA',
    level: 'Intermedio',
    text: 'Revisa tu respuesta anterior. ¿Qué supuestos hiciste? ¿Qué podría estar mal o desactualizado? ¿Qué debería confirmar con una fuente oficial o un profesional?',
  },
]
