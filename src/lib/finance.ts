// Cálculos financieros puros. Sin dependencias de UI para poder testearlos.

const numberFmt = new Intl.NumberFormat('es-MX', { maximumFractionDigits: 0 })

/** Formato monetario neutro para LatAm: $1,500 */
export const fmt = (n: number) => {
  const v = Number.isFinite(n) ? Math.round(n) : 0
  return `${v < 0 ? '-' : ''}$${numberFmt.format(Math.abs(v))}`
}

/** "1 mes" / "3 meses" */
export const meses = (n: number) => `${n} ${n === 1 ? 'mes' : 'meses'}`

export const pct = (n: number) => `${Math.round(n * 10) / 10}%`

/** Regla 50/30/20 sobre el ingreso neto mensual. */
export function budget503020(income: number) {
  const i = Math.max(0, income)
  return { needs: i * 0.5, wants: i * 0.3, savings: i * 0.2 }
}

/** Meta de fondo de emergencia según meses de gastos esenciales. */
export function emergencyFund(monthlyExpenses: number, months: number, saved: number, monthlySaving: number) {
  const target = Math.max(0, monthlyExpenses) * Math.max(0, months)
  const remaining = Math.max(0, target - Math.max(0, saved))
  const monthsToGoal = remaining === 0 ? 0 : monthlySaving > 0 ? Math.ceil(remaining / monthlySaving) : Infinity
  const progress = target === 0 ? 0 : Math.min(1, Math.max(0, saved) / target)
  return { target, remaining, monthsToGoal, progress }
}

export interface GrowthPoint {
  year: number
  contributed: number
  balance: number
}

/**
 * Interés compuesto con aportes mensuales, capitalización mensual.
 * Devuelve un punto por año (incluido el año 0).
 */
export function compoundGrowth(initial: number, monthly: number, annualRatePct: number, years: number): GrowthPoint[] {
  const r = annualRatePct / 100 / 12
  const points: GrowthPoint[] = [{ year: 0, contributed: initial, balance: initial }]
  let balance = initial
  let contributed = initial
  for (let m = 1; m <= Math.round(years * 12); m++) {
    balance = balance * (1 + r) + monthly
    contributed += monthly
    if (m % 12 === 0) points.push({ year: m / 12, contributed, balance })
  }
  return points
}

export interface Debt {
  id: string
  name: string
  balance: number
  ratePct: number
  minPayment: number
}

export type DebtStrategy = 'avalanche' | 'snowball'

export interface PayoffResult {
  months: number
  totalInterest: number
  order: string[]
  /** true si el pago no alcanza para cubrir los intereses (nunca se paga). */
  impossible: boolean
}

/**
 * Simula el pago de deudas. Avalancha = mayor tasa primero, bola de nieve = menor saldo primero.
 * El presupuesto mensual cubre todos los mínimos y el excedente va a la deuda prioritaria.
 */
export function payoffPlan(debts: Debt[], monthlyBudget: number, strategy: DebtStrategy): PayoffResult {
  const ds = debts
    .filter((d) => d.balance > 0)
    .map((d) => ({ ...d }))
  const order: string[] = []
  if (ds.length === 0) return { months: 0, totalInterest: 0, order, impossible: false }

  const sortFn =
    strategy === 'avalanche'
      ? (a: Debt, b: Debt) => b.ratePct - a.ratePct || a.balance - b.balance
      : (a: Debt, b: Debt) => a.balance - b.balance || b.ratePct - a.ratePct

  let months = 0
  let totalInterest = 0
  const MAX = 600

  while (ds.some((d) => d.balance > 0.005) && months < MAX) {
    months++
    // Intereses del mes
    for (const d of ds) {
      if (d.balance <= 0) continue
      const interest = d.balance * (d.ratePct / 100 / 12)
      d.balance += interest
      totalInterest += interest
    }
    let available = monthlyBudget
    // Mínimos
    for (const d of ds) {
      if (d.balance <= 0) continue
      const pay = Math.min(d.minPayment, d.balance, available)
      d.balance -= pay
      available -= pay
    }
    // Excedente en orden de prioridad
    const active = ds.filter((d) => d.balance > 0).sort(sortFn)
    for (const d of active) {
      if (available <= 0) break
      const pay = Math.min(available, d.balance)
      d.balance -= pay
      available -= pay
    }
    for (const d of ds) {
      if (d.balance <= 0.005 && !order.includes(d.name)) {
        d.balance = 0
        order.push(d.name)
      }
    }
  }

  const impossible = months >= MAX
  return { months, totalInterest, order, impossible }
}

/** Ahorro mensual necesario para alcanzar una meta en N meses con rendimiento anual opcional. */
export function monthlyForGoal(goal: number, months: number, saved = 0, annualRatePct = 0) {
  if (months <= 0) return Math.max(0, goal - saved)
  const r = annualRatePct / 100 / 12
  const fvSaved = saved * Math.pow(1 + r, months)
  const remaining = goal - fvSaved
  if (remaining <= 0) return 0
  if (r === 0) return remaining / months
  return (remaining * r) / (Math.pow(1 + r, months) - 1)
}

/** Puntaje de salud financiera de 0 a 100 a partir de indicadores simples. */
export function healthScore(input: {
  income: number
  expenses: number
  savings: number
  debt: number
}) {
  const { income, expenses, savings, debt } = input
  if (income <= 0) return { score: 0, savingsRate: 0, cushionMonths: 0, debtToIncome: 0 }
  const savingsRate = Math.max(0, (income - expenses) / income)
  const cushionMonths = expenses > 0 ? savings / expenses : 0
  const debtToIncome = debt / (income * 12)
  const s1 = Math.min(1, savingsRate / 0.2) * 40
  const s2 = Math.min(1, cushionMonths / 6) * 35
  const s3 = Math.max(0, 1 - debtToIncome / 0.5) * 25
  return {
    score: Math.round(s1 + s2 + s3),
    savingsRate: savingsRate * 100,
    cushionMonths,
    debtToIncome: debtToIncome * 100,
  }
}
