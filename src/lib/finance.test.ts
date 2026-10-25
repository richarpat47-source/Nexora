import { describe, expect, it } from 'vitest'
import { budget503020, fmt, compoundGrowth, emergencyFund, healthScore, monthlyForGoal, payoffPlan, type Debt } from './finance'

describe('budget503020', () => {
  it('reparte el ingreso', () => {
    expect(budget503020(2000)).toEqual({ needs: 1000, wants: 600, savings: 400 })
  })
  it('no acepta ingresos negativos', () => {
    expect(budget503020(-10).needs).toBe(0)
  })
})

describe('emergencyFund', () => {
  it('calcula meta, faltante y meses', () => {
    const r = emergencyFund(1000, 6, 1000, 500)
    expect(r.target).toBe(6000)
    expect(r.remaining).toBe(5000)
    expect(r.monthsToGoal).toBe(10)
    expect(r.progress).toBeCloseTo(1 / 6)
  })
  it('sin ahorro mensual nunca llega', () => {
    expect(emergencyFund(1000, 3, 0, 0).monthsToGoal).toBe(Infinity)
  })
  it('meta cumplida', () => {
    expect(emergencyFund(1000, 3, 5000, 0)).toMatchObject({ remaining: 0, monthsToGoal: 0, progress: 1 })
  })
})

describe('compoundGrowth', () => {
  it('sin interés solo suma aportes', () => {
    const pts = compoundGrowth(100, 10, 0, 2)
    expect(pts).toHaveLength(3)
    expect(pts[2].balance).toBeCloseTo(340)
    expect(pts[2].contributed).toBe(340)
  })
  it('con interés supera lo aportado', () => {
    const pts = compoundGrowth(1000, 100, 8, 10)
    const last = pts[pts.length - 1]
    expect(last.balance).toBeGreaterThan(last.contributed)
    // Valor conocido: FV ≈ 1000*(1+r)^120 + 100*((1+r)^120-1)/r con r=0.08/12
    const r = 0.08 / 12
    const fv = 1000 * Math.pow(1 + r, 120) + (100 * (Math.pow(1 + r, 120) - 1)) / r
    expect(last.balance).toBeCloseTo(fv, 4)
  })
})

describe('payoffPlan', () => {
  const debts: Debt[] = [
    { id: 'a', name: 'Tarjeta', balance: 3000, ratePct: 30, minPayment: 90 },
    { id: 'b', name: 'Préstamo', balance: 1000, ratePct: 10, minPayment: 50 },
  ]
  it('avalancha paga menos interés que bola de nieve', () => {
    const av = payoffPlan(debts, 400, 'avalanche')
    const sb = payoffPlan(debts, 400, 'snowball')
    expect(av.impossible).toBe(false)
    expect(sb.impossible).toBe(false)
    expect(av.totalInterest).toBeLessThanOrEqual(sb.totalInterest)
    expect(sb.order[0]).toBe('Préstamo')
  })
  it('detecta pagos insuficientes', () => {
    expect(payoffPlan([{ id: 'x', name: 'X', balance: 10000, ratePct: 36, minPayment: 10 }], 100, 'avalanche').impossible).toBe(true)
  })
  it('sin deudas', () => {
    expect(payoffPlan([], 100, 'snowball').months).toBe(0)
  })
})

describe('monthlyForGoal', () => {
  it('sin rendimiento divide linealmente', () => {
    expect(monthlyForGoal(1200, 12)).toBe(100)
  })
  it('con rendimiento necesita menos', () => {
    expect(monthlyForGoal(1200, 12, 0, 6)).toBeLessThan(100)
  })
  it('meta ya cubierta', () => {
    expect(monthlyForGoal(1000, 12, 2000)).toBe(0)
  })
})

describe('healthScore', () => {
  it('perfil sano puntúa 100', () => {
    expect(healthScore({ income: 1000, expenses: 700, savings: 6000, debt: 0 }).score).toBe(100)
  })
  it('sin ingreso es 0', () => {
    expect(healthScore({ income: 0, expenses: 500, savings: 0, debt: 0 }).score).toBe(0)
  })
})

describe('fmt', () => {
  it('formatea en estilo LatAm', () => {
    expect(fmt(1500)).toBe('$1,500')
    expect(fmt(-2500.4)).toBe('-$2,500')
    expect(fmt(NaN)).toBe('$0')
  })
})
