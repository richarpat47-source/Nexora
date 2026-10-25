import { lazy, Suspense, useState } from 'react'
import { motion } from 'motion/react'
import clsx from 'clsx'
import { budget503020, emergencyFund, fmt, healthScore, meses, monthlyForGoal, payoffPlan, type Debt, type DebtStrategy } from '../lib/finance'
import { useProfile } from '../lib/storage'
import { NumberField, ProgressRing, Slider, Stat } from './ui'
import { Plus, Trash2 } from './icons'
import type { ToolId } from '../data/modules'

export const money = (v: number) => fmt(v)

// Recharts es pesado: se carga solo cuando se muestra el simulador.
const LazyCompound = lazy(() => import('./CompoundTool'))
export function CompoundTool() {
  return (
    <Suspense fallback={<div className="grid h-80 place-items-center text-sm text-slate-500">Cargando simulador…</div>}>
      <LazyCompound />
    </Suspense>
  )
}

/* ---------- 50/30/20 ---------- */
export function BudgetTool() {
  const [profile, setProfile] = useProfile()
  const income = profile.income
  const b = budget503020(income)
  const parts = [
    { key: 'Necesidades', v: b.needs, p: 50, color: '#34d399', desc: 'Vivienda, comida, servicios, transporte' },
    { key: 'Deseos', v: b.wants, p: 30, color: '#a78bfa', desc: 'Salidas, compras, suscripciones' },
    { key: 'Ahorro y deudas', v: b.savings, p: 20, color: '#fbbf24', desc: 'Fondo, metas, pagos extra' },
  ]
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
      <div className="space-y-6">
        <Slider label="Ingreso neto mensual" value={income} min={300} max={10000} step={50} format={money} onChange={(v) => setProfile({ ...profile, income: v })} />
        <div className="flex h-5 overflow-hidden rounded-full">
          {parts.map((x) => (
            <motion.div key={x.key} layout style={{ width: `${x.p}%`, background: x.color }} />
          ))}
        </div>
        <p className="text-sm text-slate-400">
          Consejo: transfiere tu {fmt(b.savings)} de ahorro el mismo día que cobras. Lo que no ves, no lo gastas.
        </p>
      </div>
      <div className="grid gap-3">
        {parts.map((x) => (
          <div key={x.key} className="flex items-center gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl text-sm font-extrabold text-ink-950" style={{ background: x.color }}>
              {x.p}%
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-white">{x.key}</div>
              <div className="truncate text-xs text-slate-400">{x.desc}</div>
            </div>
            <motion.div key={x.v} initial={{ opacity: 0.4, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xl font-extrabold tabular-nums text-white">
              {fmt(x.v)}
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ---------- Fondo de emergencia ---------- */
export function EmergencyTool() {
  const [profile, setProfile] = useProfile()
  const [months, setMonths] = useState(6)
  const [monthly, setMonthly] = useState(200)
  const r = emergencyFund(profile.expenses, months, profile.savings, monthly)
  return (
    <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_1fr]">
      <div className="space-y-6">
        <Slider label="Gastos esenciales al mes" value={profile.expenses} min={200} max={8000} step={50} format={money} onChange={(v) => setProfile({ ...profile, expenses: v })} />
        <Slider label="Meses de cobertura" value={months} min={1} max={12} format={meses} onChange={setMonths} />
        <Slider label="Ya tengo ahorrado" value={profile.savings} min={0} max={30000} step={100} format={money} onChange={(v) => setProfile({ ...profile, savings: v })} />
        <Slider label="Puedo apartar al mes" value={monthly} min={0} max={3000} step={25} format={money} onChange={setMonthly} />
      </div>
      <div className="flex flex-col items-center gap-5 text-center">
        <ProgressRing value={r.progress} size={190} stroke={14}>
          <div>
            <div className="text-4xl font-extrabold text-white">{Math.round(r.progress * 100)}%</div>
            <div className="text-xs text-slate-400">de tu colchón</div>
          </div>
        </ProgressRing>
        <div className="grid w-full grid-cols-2 gap-3">
          <Stat label="Meta" value={fmt(r.target)} tone="mint" />
          <Stat
            label="Lo logras en"
            value={r.monthsToGoal === 0 ? '¡Listo!' : Number.isFinite(r.monthsToGoal) ? `${r.monthsToGoal} m` : '—'}
            hint={!Number.isFinite(r.monthsToGoal) ? 'Aparta algo cada mes' : undefined}
            tone="violet"
          />
        </div>
      </div>
    </div>
  )
}

/* ---------- Deudas ---------- */
let uid = 0
const newId = () => `d${Date.now()}${uid++}`

export function DebtTool() {
  const [debts, setDebts] = useState<Debt[]>([
    { id: 'a', name: 'Tarjeta de crédito', balance: 2500, ratePct: 32, minPayment: 80 },
    { id: 'b', name: 'Préstamo personal', balance: 4000, ratePct: 14, minPayment: 150 },
    { id: 'c', name: 'Tienda / cuotas', balance: 600, ratePct: 22, minPayment: 40 },
  ])
  const minSum = debts.reduce((a, d) => a + d.minPayment, 0)
  const [budget, setBudget] = useState(450)
  const effectiveBudget = Math.max(budget, minSum)
  const results = (['avalanche', 'snowball'] as DebtStrategy[]).map((s) => ({ s, r: payoffPlan(debts, effectiveBudget, s) }))
  const best = results.reduce((a, b) => (b.r.totalInterest < a.r.totalInterest ? b : a))

  const update = (id: string, patch: Partial<Debt>) => setDebts((ds) => ds.map((d) => (d.id === id ? { ...d, ...patch } : d)))

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {debts.map((d) => (
          <div key={d.id} className="grid grid-cols-2 gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4 sm:grid-cols-[1.6fr_1fr_0.8fr_1fr_auto] sm:items-end">
            <label className="col-span-2 block sm:col-span-1">
              <span className="label">Deuda</span>
              <input className="field" value={d.name} onChange={(e) => update(d.id, { name: e.target.value })} />
            </label>
            <NumberField label="Saldo" prefix="$" value={d.balance} onChange={(v) => update(d.id, { balance: v })} />
            <NumberField label="Tasa anual" suffix="%" value={d.ratePct} onChange={(v) => update(d.id, { ratePct: v })} />
            <NumberField label="Mínimo" prefix="$" value={d.minPayment} onChange={(v) => update(d.id, { minPayment: v })} />
            <button
              onClick={() => setDebts((ds) => ds.filter((x) => x.id !== d.id))}
              className="grid h-10 w-10 place-items-center self-end rounded-xl text-slate-400 transition hover:bg-rose-400/10 hover:text-rose-300"
              aria-label={`Eliminar ${d.name}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        <button
          onClick={() => setDebts((ds) => [...ds, { id: newId(), name: 'Nueva deuda', balance: 1000, ratePct: 20, minPayment: 50 }])}
          className="inline-flex items-center gap-2 rounded-full border border-dashed border-white/20 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-mint-400/50 hover:text-mint-300"
        >
          <Plus className="h-4 w-4" /> Agregar deuda
        </button>
      </div>

      <Slider label="Presupuesto mensual para deudas" value={budget} min={50} max={3000} step={10} format={money} onChange={setBudget} />
      {budget < minSum && <p className="text-sm text-gold-400">Tu presupuesto es menor que la suma de mínimos ({fmt(minSum)}). Calculamos con los mínimos.</p>}

      <div className="grid gap-4 md:grid-cols-2">
        {results.map(({ s, r }) => {
          const isBest = s === best.s && results[0].r.totalInterest !== results[1].r.totalInterest
          return (
            <div key={s} className={clsx('relative rounded-2xl border p-5', isBest ? 'border-mint-400/50 bg-mint-400/[0.06]' : 'border-white/[0.07] bg-white/[0.03]')}>
              {isBest && <span className="absolute -top-3 right-4 rounded-full bg-mint-400 px-3 py-0.5 text-xs font-bold text-ink-950">Ahorras más</span>}
              <div className="text-lg font-extrabold text-white">{s === 'avalanche' ? '🏔️ Avalancha' : '⛄ Bola de nieve'}</div>
              <div className="text-xs text-slate-400">{s === 'avalanche' ? 'Mayor tasa primero' : 'Menor saldo primero'}</div>
              {r.impossible ? (
                <p className="mt-4 text-sm text-rose-300">Con este pago la deuda no baja. Sube el presupuesto o negocia la tasa.</p>
              ) : (
                <>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <Stat label="Libre en" value={meses(r.months)} tone="mint" />
                    <Stat label="Intereses" value={fmt(r.totalInterest)} tone="rose" />
                  </div>
                  <ol className="mt-4 space-y-1 text-sm text-slate-300">
                    {r.order.map((n, i) => (
                      <li key={n + i}>
                        <span className="mr-2 inline-grid h-5 w-5 place-items-center rounded-full bg-white/10 text-[11px] font-bold">{i + 1}</span>
                        {n}
                      </li>
                    ))}
                  </ol>
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ---------- Metas ---------- */
export function GoalTool() {
  const [profile, setProfile] = useProfile()
  const [rate, setRate] = useState(4)
  const need = monthlyForGoal(profile.goalAmount, profile.goalMonths, 0, rate)
  const share = profile.income > 0 ? (need / profile.income) * 100 : 0
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-5">
        <label className="block">
          <span className="label">¿Para qué ahorras?</span>
          <input className="field" value={profile.goal} onChange={(e) => setProfile({ ...profile, goal: e.target.value })} />
        </label>
        <Slider label="Monto de la meta" value={profile.goalAmount} min={100} max={50000} step={100} format={money} onChange={(v) => setProfile({ ...profile, goalAmount: v })} />
        <Slider label="Plazo" value={profile.goalMonths} min={1} max={120} format={meses} onChange={(v) => setProfile({ ...profile, goalMonths: v })} />
        <Slider label="Rendimiento anual de la cuenta" value={rate} min={0} max={10} step={0.5} format={(v) => `${v}%`} onChange={setRate} />
      </div>
      <div className="flex flex-col justify-center gap-4">
        <div className="rounded-3xl border border-mint-400/30 bg-gradient-to-br from-mint-400/15 to-violet-500/10 p-6 text-center">
          <div className="text-sm text-slate-300">Para “{profile.goal || 'tu meta'}” necesitas apartar</div>
          <motion.div key={Math.round(need)} initial={{ scale: 0.9, opacity: 0.5 }} animate={{ scale: 1, opacity: 1 }} className="my-2 text-5xl font-extrabold text-white">
            {fmt(need)}
          </motion.div>
          <div className="text-sm text-slate-400">al mes durante {meses(profile.goalMonths)}</div>
        </div>
        <Stat
          label="Peso en tu ingreso"
          value={`${Math.round(share)}%`}
          hint={share > 30 ? 'Es mucho: alarga el plazo o baja el monto.' : share > 20 ? 'Exigente, pero posible.' : 'Totalmente alcanzable.'}
          tone={share > 30 ? 'rose' : share > 20 ? 'gold' : 'mint'}
        />
      </div>
    </div>
  )
}

/* ---------- Salud financiera ---------- */
export function HealthTool() {
  const [p, setP] = useProfile()
  const h = healthScore(p)
  const label = h.score >= 80 ? 'Excelente' : h.score >= 60 ? 'Bien encaminado' : h.score >= 40 ? 'En construcción' : 'Momento de actuar'
  const rows = [
    { k: 'Tasa de ahorro', v: `${Math.round(h.savingsRate)}%`, ok: h.savingsRate >= 20, goal: 'Meta: 20%' },
    { k: 'Colchón', v: `${h.cushionMonths.toFixed(1)} meses`, ok: h.cushionMonths >= 3, goal: 'Meta: 3–6 meses' },
    { k: 'Deuda / ingreso anual', v: `${Math.round(h.debtToIncome)}%`, ok: h.debtToIncome < 50, goal: 'Meta: < 50%' },
  ]
  return (
    <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_1fr]">
      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField label="Ingreso mensual" prefix="$" value={p.income} onChange={(v) => setP({ ...p, income: v })} />
        <NumberField label="Gastos mensuales" prefix="$" value={p.expenses} onChange={(v) => setP({ ...p, expenses: v })} />
        <NumberField label="Ahorros totales" prefix="$" value={p.savings} onChange={(v) => setP({ ...p, savings: v })} />
        <NumberField label="Deudas totales" prefix="$" value={p.debt} onChange={(v) => setP({ ...p, debt: v })} />
      </div>
      <div className="flex flex-col items-center gap-4">
        <ProgressRing value={h.score / 100} size={180} stroke={14}>
          <div>
            <div className="text-5xl font-extrabold text-white">{h.score}</div>
            <div className="text-xs text-slate-400">de 100</div>
          </div>
        </ProgressRing>
        <div className="font-bold text-mint-300">{label}</div>
        <div className="w-full space-y-2">
          {rows.map((r) => (
            <div key={r.k} className="flex items-center justify-between rounded-xl bg-white/[0.04] px-4 py-2.5 text-sm">
              <span className="text-slate-300">
                {r.ok ? '✅' : '⚠️'} {r.k}
              </span>
              <span className="text-right">
                <b className="text-white">{r.v}</b> <span className="text-xs text-slate-500">{r.goal}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export const toolsMeta: Record<ToolId, { title: string; desc: string; Comp: () => React.JSX.Element }> = {
  salud: { title: 'Salud financiera', desc: 'Tu puntaje de 0 a 100 en segundos.', Comp: HealthTool },
  presupuesto: { title: 'Presupuesto 50/30/20', desc: 'Dale un propósito a cada peso.', Comp: BudgetTool },
  emergencia: { title: 'Fondo de emergencia', desc: 'Cuánto necesitas y cuándo lo logras.', Comp: EmergencyTool },
  metas: { title: 'Metas de ahorro', desc: 'Convierte un sueño en un aporte mensual.', Comp: GoalTool },
  deudas: { title: 'Plan de deudas', desc: 'Avalancha vs. bola de nieve, en vivo.', Comp: DebtTool },
  interes: { title: 'Interés compuesto', desc: 'Mira crecer tu dinero con el tiempo.', Comp: CompoundTool },
}
