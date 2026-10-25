import { Link } from 'react-router'
import { motion } from 'motion/react'
import { ButtonLink, ModuleIcon, ProgressRing, Reveal, Stat, colorMap } from '../../components/ui'
import { allLessonIds, modules } from '../../data/modules'
import { fmt, healthScore } from '../../lib/finance'
import { useProfile, useProgress } from '../../lib/storage'
import { toolsMeta } from '../../components/tools'
import { ArrowRight, Flame, Lightbulb, Play, Sparkles, Trophy } from '../../components/icons'
import type { ToolId } from '../../data/modules'

const tips = [
  'Antes de pedirle algo a la IA, dile quién eres y qué quieres lograr. El contexto lo cambia todo.',
  'Paga tu ahorro primero: programa una transferencia automática el día que cobras.',
  'Si una oferta promete ganancias garantizadas y urgentes, es una alerta roja.',
  'Pídele a la IA que revise su propia respuesta: “¿qué podría estar mal aquí?”.',
  'Un gasto hormiga de $3 diarios son más de $1.000 al año.',
]

export default function Dashboard() {
  const [profile, setProfile] = useProfile()
  const { done } = useProgress()
  const progress = done.length / allLessonIds.length
  const nextId = allLessonIds.find((id) => !done.includes(id))
  const [nm, nl] = nextId?.split('/') ?? []
  const nextMod = modules.find((m) => m.id === nm)
  const nextLesson = nextMod?.lessons.find((l) => l.id === nl)
  const h = healthScore(profile)
  const minutesDone = modules.reduce((a, m) => a + m.lessons.filter((l) => done.includes(`${m.id}/${l.id}`)).reduce((b, l) => b + l.minutes, 0), 0)
  const tip = tips[new Date().getDate() % tips.length]
  const hour = new Date().getHours()
  const greet = hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches'
  const badges = [
    { e: '🌱', t: 'Primer paso', ok: done.length >= 1 },
    { e: '🧠', t: 'IA sin miedo', ok: modules[0].lessons.every((l) => done.includes(`${modules[0].id}/${l.id}`)) },
    { e: '🔥', t: '5 lecciones', ok: done.length >= 5 },
    { e: '🏆', t: 'Programa completo', ok: progress === 1 },
  ]

  return (
    <div className="space-y-8">
      {/* Bienvenida */}
      <Reveal>
        <div className="card relative overflow-hidden p-7 sm:p-10">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-mint-400/15 blur-3xl" />
          <div className="relative flex flex-col gap-8 md:flex-row md:items-center">
            <div className="flex-1">
              <div className="text-sm text-slate-400">{greet} 👋</div>
              <h1 className="mt-1 text-3xl font-extrabold text-white sm:text-4xl">
                {profile.name ? (
                  <>
                    Hola, <span className="text-gradient">{profile.name}</span>
                  </>
                ) : (
                  <>Bienvenido a tu espacio</>
                )}
              </h1>
              {!profile.name && (
                <label className="mt-4 block max-w-xs">
                  <span className="label">¿Cómo te llamas?</span>
                  <input className="field" placeholder="Tu nombre" onBlur={(e) => e.target.value && setProfile({ ...profile, name: e.target.value.trim() })} onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()} />
                </label>
              )}
              <p className="mt-3 max-w-lg text-slate-400">
                {progress === 0 ? 'Tu viaje empieza hoy. Una lección de 6 minutos es todo lo que necesitas para arrancar.' : progress === 1 ? '¡Completaste el programa! Revisa y descarga tu plan.' : 'Vas muy bien. Cada lección te acerca a tu plan completo.'}
              </p>
              {nextMod && nextLesson && (
                <ButtonLink to={`/app/ruta/${nextMod.id}/${nextLesson.id}`} className="mt-6">
                  <Play className="h-4 w-4 fill-current" /> {progress === 0 ? 'Empezar primera lección' : 'Continuar'}
                </ButtonLink>
              )}
            </div>
            <ProgressRing value={progress} size={170} stroke={14}>
              <div>
                <div className="text-4xl font-extrabold text-white">{Math.round(progress * 100)}%</div>
                <div className="text-xs text-slate-400">
                  {done.length}/{allLessonIds.length} lecciones
                </div>
              </div>
            </ProgressRing>
          </div>
        </div>
      </Reveal>

      <div className="grid gap-6 xl:grid-cols-3">
        {/* Siguiente lección */}
        <Reveal className="xl:col-span-2" delay={0.05}>
          <div className="card h-full p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-white">Tu ruta</h2>
              <Link to="/app/ruta" className="text-sm font-semibold text-mint-300 hover:underline">
                Ver todo
              </Link>
            </div>
            <div className="space-y-3">
              {modules.map((m) => {
                const total = m.lessons.length
                const d = m.lessons.filter((l) => done.includes(`${m.id}/${l.id}`)).length
                return (
                  <Link key={m.id} to="/app/ruta" className="group flex items-center gap-4 rounded-2xl p-2 transition hover:bg-white/[0.03]">
                    <ModuleIcon mod={m} className="h-11 w-11" />
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between text-sm">
                        <span className="truncate font-bold text-white">{m.title}</span>
                        <span className="tabular-nums text-slate-400">
                          {d}/{total}
                        </span>
                      </div>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${(d / total) * 100}%` }} className="h-full rounded-full" style={{ background: colorMap[m.color].hex }} />
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </Reveal>

        {/* Salud + tip */}
        <div className="space-y-6">
          <Reveal delay={0.1}>
            <Link to="/app/herramientas/salud" className="card group block p-6 transition hover:border-mint-400/30">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-extrabold text-white">Salud financiera</h2>
                <ArrowRight className="h-4 w-4 text-slate-500 transition group-hover:translate-x-1 group-hover:text-mint-300" />
              </div>
              <div className="mt-4 flex items-center gap-5">
                <ProgressRing value={h.score / 100} size={96} stroke={9}>
                  <span className="text-2xl font-extrabold text-white">{h.score}</span>
                </ProgressRing>
                <div className="space-y-1 text-sm text-slate-400">
                  <div>
                    Ahorro: <b className="text-white">{Math.round(h.savingsRate)}%</b>
                  </div>
                  <div>
                    Colchón: <b className="text-white">{h.cushionMonths.toFixed(1)} meses</b>
                  </div>
                  <div>
                    Deudas: <b className="text-white">{fmt(profile.debt)}</b>
                  </div>
                </div>
              </div>
            </Link>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="card relative overflow-hidden p-6">
              <Lightbulb className="h-6 w-6 text-gold-400" />
              <div className="mt-3 text-xs font-bold uppercase tracking-widest text-gold-400">Tip del día</div>
              <p className="mt-1 text-slate-200">{tip}</p>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Logros */}
      <Reveal delay={0.1}>
        <div className="card p-6">
          <h2 className="mb-5 flex items-center gap-2 text-lg font-extrabold text-white">
            <Trophy className="h-5 w-5 text-gold-400" /> Logros
          </h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {badges.map((b) => (
              <div key={b.t} className={`rounded-2xl border p-4 text-center transition ${b.ok ? 'border-gold-400/40 bg-gold-400/10' : 'border-white/[0.06] bg-white/[0.02] opacity-50 grayscale'}`}>
                <div className="text-3xl">{b.e}</div>
                <div className="mt-2 text-sm font-bold text-white">{b.t}</div>
                <div className="text-xs text-slate-400">{b.ok ? 'Desbloqueado' : 'Bloqueado'}</div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Herramientas rápidas */}
      <Reveal delay={0.1}>
        <h2 className="mb-4 flex items-center gap-2 text-lg font-extrabold text-white">
          <Sparkles className="h-5 w-5 text-mint-300" /> Herramientas rápidas
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {(Object.keys(toolsMeta) as ToolId[]).map((id) => (
            <Link key={id} to={`/app/herramientas/${id}`} className="card group flex items-center justify-between p-5 transition hover:-translate-y-0.5 hover:border-white/20">
              <div>
                <div className="font-bold text-white">{toolsMeta[id].title}</div>
                <div className="text-sm text-slate-400">{toolsMeta[id].desc}</div>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-slate-500 transition group-hover:translate-x-1 group-hover:text-mint-300" />
            </Link>
          ))}
        </div>
      </Reveal>

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat
          label="Tiempo invertido"
          value={
            <span className="inline-flex items-center gap-1">
              <Flame className="h-5 w-5 text-orange-400" /> {minutesDone} min
            </span>
          }
          hint="Aprendiendo sobre tu dinero"
        />
        <Stat label="Ingreso registrado" value={fmt(profile.income)} tone="mint" />
        <Stat label="Meta activa" value={profile.goal || '—'} hint={fmt(profile.goalAmount)} tone="violet" />
      </div>
    </div>
  )
}
