import { useState } from 'react'
import { Link } from 'react-router'
import clsx from 'clsx'
import { ModuleIcon, Reveal, colorMap } from '../../components/ui'
import { modules, totalMinutes } from '../../data/modules'
import { useProgress } from '../../lib/storage'
import { CheckCircle2, Clock, Play, RotateCcw } from '../../components/icons'

export default function Ruta() {
  const { done, reset } = useProgress()
  const [confirming, setConfirming] = useState(false)
  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">Mi ruta de aprendizaje</h1>
          <p className="mt-2 text-slate-400">
            {modules.length} módulos · {modules.reduce((a, m) => a + m.lessons.length, 0)} lecciones · ~{Math.round(totalMinutes / 60)} h en total
          </p>
        </div>
        {done.length > 0 &&
          (confirming ? (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-300">¿Borrar todo tu progreso?</span>
              <button
                onClick={() => {
                  reset()
                  setConfirming(false)
                }}
                className="rounded-full bg-rose-400/90 px-4 py-2 font-bold text-ink-950 hover:bg-rose-300"
              >
                Sí, reiniciar
              </button>
              <button onClick={() => setConfirming(false)} className="rounded-full px-4 py-2 font-semibold text-slate-300 hover:bg-white/5">
                Cancelar
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirming(true)}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-slate-400 hover:bg-white/5 hover:text-white"
            >
              <RotateCcw className="h-4 w-4" /> Reiniciar progreso
            </button>
          ))}
      </div>

      <div className="relative space-y-6">
        <div className="absolute bottom-10 left-[1.9rem] top-10 hidden w-px bg-gradient-to-b from-violet-500/50 via-mint-400/40 to-transparent sm:block" />
        {modules.map((m, mi) => {
          const c = colorMap[m.color]
          const d = m.lessons.filter((l) => done.includes(`${m.id}/${l.id}`)).length
          const complete = d === m.lessons.length
          return (
            <Reveal key={m.id} delay={mi * 0.04}>
              <section className="relative sm:pl-20">
                <div className="absolute left-0 top-6 hidden sm:block">
                  <ModuleIcon mod={m} className="h-[3.8rem] w-[3.8rem] bg-ink-800" />
                </div>
                <div className={clsx('card overflow-hidden', complete && 'border-mint-400/30')}>
                  <div className={clsx('bg-gradient-to-r to-transparent p-6', c.from)}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className={clsx('text-xs font-bold uppercase tracking-widest', c.text)}>Módulo {mi + 1}</div>
                        <h2 className="mt-1 text-2xl font-extrabold text-white">{m.title}</h2>
                        <p className="mt-1 text-slate-300">{m.tagline}</p>
                      </div>
                      <span className={clsx('shrink-0 rounded-full px-3 py-1 text-xs font-bold', complete ? 'bg-mint-400 text-ink-950' : 'bg-white/10 text-slate-300')}>
                        {complete ? '✓ Completo' : `${d}/${m.lessons.length}`}
                      </span>
                    </div>
                  </div>
                  <ul className="divide-y divide-white/5">
                    {m.lessons.map((l, li) => {
                      const id = `${m.id}/${l.id}`
                      const isDone = done.includes(id)
                      return (
                        <li key={l.id}>
                          <Link to={`/app/ruta/${m.id}/${l.id}`} className="group flex items-center gap-4 px-6 py-4 transition hover:bg-white/[0.03]">
                            <span
                              className={clsx(
                                'grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-bold transition',
                                isDone ? 'bg-mint-400 text-ink-950' : 'bg-white/[0.06] text-slate-400 group-hover:bg-white/10 group-hover:text-white',
                              )}
                            >
                              {isDone ? <CheckCircle2 className="h-5 w-5" /> : li + 1}
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className={clsx('font-semibold', isDone ? 'text-slate-400' : 'text-white')}>{l.title}</div>
                              <div className="mt-0.5 flex items-center gap-3 text-xs text-slate-500">
                                <span className="capitalize">{l.kind}</span>
                                <span className="inline-flex items-center gap-1">
                                  <Clock className="h-3 w-3" /> {l.minutes} min
                                </span>
                                {l.tool && <span className="text-mint-400/80">+ herramienta</span>}
                                {l.quiz && <span className="text-violet-400/80">+ quiz</span>}
                              </div>
                            </div>
                            <Play className="h-4 w-4 text-slate-600 transition group-hover:translate-x-1 group-hover:text-mint-300" />
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </section>
            </Reveal>
          )
        })}
      </div>
    </div>
  )
}
