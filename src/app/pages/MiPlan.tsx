import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import clsx from 'clsx'
import { Button, NumberField, ProgressRing, Slider, Stat } from '../../components/ui'
import { budget503020, emergencyFund, fmt, healthScore, meses, monthlyForGoal } from '../../lib/finance'
import { useProfile, type Profile } from '../../lib/storage'
import { isArtifact } from '../../lib/env'
import { ArrowRight, Check, ChevronLeft, Printer, Target } from '../../components/icons'

interface Step {
  title: string
  detail: string
  amount?: string
  when: string
}

/** Construye una lista priorizada de acciones a partir del perfil. */
export function buildPlan(p: Profile) {
  const surplus = Math.max(0, p.income - p.expenses)
  const ideal = budget503020(p.income).savings
  const monthlySave = surplus > 0 ? surplus : 0
  const mini = emergencyFund(p.expenses, 1, p.savings, monthlySave)
  const full = emergencyFund(p.expenses, 6, p.savings, monthlySave)
  const steps: Step[] = []

  if (surplus <= 0) {
    steps.push({
      title: 'Equilibra ingresos y gastos',
      detail: `Hoy gastas ${fmt(p.expenses)} y ganas ${fmt(p.income)}. Revisa suscripciones y gastos hormiga con el prompt “Clasifica mis gastos” hasta liberar al menos ${fmt(p.income * 0.1)} al mes.`,
      when: 'Este mes',
    })
  }
  if (mini.remaining > 0) {
    steps.push({
      title: 'Mini fondo de emergencia (1 mes)',
      detail: `Junta ${fmt(mini.target)} en una cuenta separada para imprevistos.`,
      amount: fmt(mini.remaining),
      when: Number.isFinite(mini.monthsToGoal) ? meses(mini.monthsToGoal) : 'Cuando tengas excedente',
    })
  }
  if (p.debt > 0) {
    steps.push({
      title: 'Ataca tus deudas con avalancha',
      detail: 'Paga los mínimos de todas y destina el excedente a la de mayor tasa. Usa el simulador de deudas para ver tu fecha de libertad.',
      amount: fmt(p.debt),
      when: 'Mientras tengas deudas de consumo',
    })
  }
  if (full.remaining > 0) {
    steps.push({
      title: 'Completa tu colchón (6 meses)',
      detail: `Meta total: ${fmt(full.target)}.`,
      amount: fmt(full.remaining),
      when: Number.isFinite(full.monthsToGoal) ? `~${meses(full.monthsToGoal)}` : 'Siguiente fase',
    })
  }
  // Si la meta es el propio colchón, ya está cubierta por los pasos anteriores.
  const goalIsCushion = /emergencia|colch[oó]n/i.test(p.goal)
  if (!goalIsCushion) {
    const goalMonthly = monthlyForGoal(p.goalAmount, p.goalMonths, 0, 4)
    steps.push({
      title: `Meta: ${p.goal || 'tu sueño'}`,
      detail: `Aparta ${fmt(goalMonthly)} al mes durante ${meses(p.goalMonths)} en una cuenta con rendimiento.`,
      amount: fmt(p.goalAmount),
      when: meses(p.goalMonths),
    })
  }
  steps.push({
    title: 'Haz crecer tu dinero',
    detail: 'Con colchón completo y sin deudas caras, aprende sobre fondos indexados de bajo costo y aporta cada mes. Verifica todo con fuentes oficiales.',
    when: 'Largo plazo',
  })
  return { steps, surplus, ideal }
}

const wizard = ['Tú', 'Tus números', 'Tu meta', 'Tu plan']

export default function MiPlan() {
  const [p, setP] = useProfile()
  const [step, setStep] = useState(0)
  const set = (patch: Partial<Profile>) => setP({ ...p, ...patch })
  const plan = buildPlan(p)
  const h = healthScore(p)

  return (
    <div className="mx-auto max-w-4xl">
      <div className="no-print mb-8">
        <h1 className="flex items-center gap-3 text-3xl font-extrabold text-white sm:text-4xl">
          <Target className="h-8 w-8 text-mint-300" /> Mi plan financiero
        </h1>
        <p className="mt-2 text-slate-400">Responde 3 pasos y obtén un plan priorizado{isArtifact ? '.' : ' que puedes imprimir o guardar en PDF.'}</p>
      </div>

      <div className="no-print mb-8 flex items-center gap-2">
        {wizard.map((w, i) => (
          <button key={w} onClick={() => setStep(i)} className="flex flex-1 flex-col items-start gap-2">
            <span className={clsx('h-1.5 w-full rounded-full transition', i <= step ? 'bg-gradient-to-r from-mint-400 to-violet-500' : 'bg-white/10')} />
            <span className={clsx('text-xs font-bold', i === step ? 'text-white' : 'text-slate-500')}>
              {i + 1}. {w}
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
          {step === 0 && (
            <div className="card space-y-6 p-6 sm:p-8">
              <label className="block">
                <span className="label">¿Cómo te llamas?</span>
                <input className="field" value={p.name} onChange={(e) => set({ name: e.target.value })} placeholder="Tu nombre" />
              </label>
              <div>
                <span className="label">¿Qué tanto miedo te da usar IA hoy?</span>
                <div className="grid grid-cols-5 gap-2">
                  {['😌', '🙂', '😐', '😟', '😱'].map((e, i) => (
                    <button
                      key={e}
                      onClick={() => set({ fearLevel: i + 1 })}
                      className={clsx('rounded-2xl border py-4 text-3xl transition', p.fearLevel === i + 1 ? 'scale-105 border-mint-400 bg-mint-400/10' : 'border-white/10 bg-white/[0.02] hover:border-white/25')}
                    >
                      {e}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-sm text-slate-400">
                  {p.fearLevel >= 4 ? 'Tranquilo: empezaremos con el módulo “IA sin miedo”, paso a paso.' : 'Genial, ya tienes una buena base para avanzar rápido.'}
                </p>
              </div>
            </div>
          )}
          {step === 1 && (
            <div className="card grid gap-5 p-6 sm:grid-cols-2 sm:p-8">
              <NumberField label="Ingreso neto mensual" prefix="$" value={p.income} onChange={(v) => set({ income: v })} />
              <NumberField label="Gastos mensuales" prefix="$" value={p.expenses} onChange={(v) => set({ expenses: v })} />
              <NumberField label="Ahorros actuales" prefix="$" value={p.savings} onChange={(v) => set({ savings: v })} />
              <NumberField label="Deudas totales" prefix="$" value={p.debt} onChange={(v) => set({ debt: v })} />
              <p className="text-sm text-slate-500 sm:col-span-2">🔒 Cifras aproximadas bastan. Todo se guarda solo en tu navegador.</p>
            </div>
          )}
          {step === 2 && (
            <div className="card space-y-6 p-6 sm:p-8">
              <label className="block">
                <span className="label">Tu meta principal</span>
                <input className="field" value={p.goal} onChange={(e) => set({ goal: e.target.value })} />
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {['Fondo de emergencia', 'Salir de deudas', 'Viaje', 'Enganche de casa', 'Estudios', 'Emprender'].map((g) => (
                    <button key={g} onClick={() => set({ goal: g })} className={clsx('rounded-full px-3 py-1 text-xs transition', p.goal === g ? 'bg-mint-400 text-ink-950' : 'bg-white/5 text-slate-400 hover:text-white')}>
                      {g}
                    </button>
                  ))}
                </div>
              </label>
              <Slider label="Monto" value={p.goalAmount} min={100} max={50000} step={100} format={(v) => fmt(v)} onChange={(v) => set({ goalAmount: v })} />
              <Slider label="Plazo" value={p.goalMonths} min={1} max={120} format={meses} onChange={(v) => set({ goalMonths: v })} />
            </div>
          )}
          {step === 3 && (
            <div id="plan" className="space-y-6">
              <div className="card flex flex-col items-center gap-6 p-6 sm:flex-row sm:p-8">
                <ProgressRing value={h.score / 100} size={140} stroke={12}>
                  <div>
                    <div className="text-3xl font-extrabold text-white">{h.score}</div>
                    <div className="text-[11px] text-slate-400">salud</div>
                  </div>
                </ProgressRing>
                <div className="flex-1 text-center sm:text-left">
                  <div className="text-sm text-slate-400">Plan financiero de</div>
                  <div className="text-3xl font-extrabold text-white">{p.name || 'Mi plan'}</div>
                  <div className="mt-1 text-sm text-slate-400">Generado el {new Date().toLocaleDateString('es')}</div>
                </div>
                {!isArtifact && (
                  <Button variant="ghost" className="no-print" onClick={() => window.print()}>
                    <Printer className="h-4 w-4" /> Imprimir / PDF
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <Stat label="Ingreso" value={fmt(p.income)} />
                <Stat label="Excedente" value={fmt(plan.surplus)} tone={plan.surplus > 0 ? 'mint' : 'rose'} />
                <Stat label="Ahorro ideal (20%)" value={fmt(plan.ideal)} tone="gold" />
                <Stat label="Tasa de ahorro" value={`${Math.round(h.savingsRate)}%`} tone="violet" />
              </div>
              <ol className="space-y-3">
                {plan.steps.map((s, i) => (
                  <motion.li key={s.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="card flex gap-4 p-5">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-mint-400 to-violet-500 font-extrabold text-ink-950">{i + 1}</span>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h3 className="font-extrabold text-white">{s.title}</h3>
                        <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-xs text-slate-400">{s.when}</span>
                      </div>
                      <p className="mt-1 text-sm text-slate-400">{s.detail}</p>
                      {s.amount && <div className="mt-2 text-sm font-bold text-mint-300">Monto: {s.amount}</div>}
                    </div>
                  </motion.li>
                ))}
              </ol>
              <p className="text-xs text-slate-500">Plan educativo generado con reglas generales. No constituye asesoría financiera personalizada.</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="no-print mt-6 flex justify-between">
        <Button variant="soft" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
          <ChevronLeft className="h-4 w-4" /> Atrás
        </Button>
        {step < 3 ? (
          <Button onClick={() => setStep((s) => s + 1)}>
            {step === 2 ? (
              <>
                Generar mi plan <Check className="h-4 w-4" />
              </>
            ) : (
              <>
                Siguiente <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        ) : (
          <Button variant="ghost" onClick={() => setStep(0)}>
            Editar respuestas
          </Button>
        )}
      </div>
    </div>
  )
}
