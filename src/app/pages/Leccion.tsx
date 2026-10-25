import { useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router'
import { AnimatePresence, motion } from 'motion/react'
import clsx from 'clsx'
import { Button, ModuleIcon, colorMap } from '../../components/ui'
import { toolsMeta } from '../../components/tools'
import { CopyButton } from '../../components/CopyButton'
import { findLesson, type Quiz } from '../../data/modules'
import { useProgress } from '../../lib/storage'
import { ArrowRight, Check, CheckCircle2, ChevronLeft, ChevronRight, Clock, Lightbulb, MessageSquareText, Sparkles, Wrench } from '../../components/icons'

function QuizBlock({ quiz, onPass }: { quiz: Quiz; onPass: () => void }) {
  const [pick, setPick] = useState<number | null>(null)
  const correct = pick === quiz.answer
  return (
    <div className="card p-6">
      <div className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-violet-400">
        <Sparkles className="h-4 w-4" /> Comprueba lo aprendido
      </div>
      <h3 className="text-lg font-bold text-white">{quiz.question}</h3>
      <div className="mt-4 grid gap-2">
        {quiz.options.map((o, i) => {
          const chosen = pick === i
          return (
            <button
              key={o}
              disabled={pick !== null && correct}
              onClick={() => {
                setPick(i)
                if (i === quiz.answer) onPass()
              }}
              className={clsx(
                'flex items-center justify-between rounded-2xl border px-5 py-3.5 text-left font-medium transition',
                chosen && i === quiz.answer && 'border-mint-400 bg-mint-400/15 text-white',
                chosen && i !== quiz.answer && 'animate-[shake_.3s] border-rose-400/60 bg-rose-400/10 text-white',
                !chosen && 'border-white/10 bg-white/[0.03] text-slate-200 hover:border-white/25',
              )}
            >
              {o}
              {chosen && (i === quiz.answer ? <Check className="h-5 w-5 text-mint-300" /> : <span className="text-rose-300">✕</span>)}
            </button>
          )
        })}
      </div>
      <AnimatePresence>
        {pick !== null && (
          <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className={clsx('mt-4 text-sm', correct ? 'text-mint-300' : 'text-rose-300')}>
            {correct ? `¡Correcto! ${quiz.explain}` : 'Casi. Inténtalo de nuevo 💪'}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Leccion() {
  const { moduleId = '', lessonId = '' } = useParams()
  const found = findLesson(moduleId, lessonId)
  const { done, complete } = useProgress()
  const navigate = useNavigate()
  const [quizPassed, setQuizPassed] = useState(false)
  const [celebrate, setCelebrate] = useState(false)

  if (!found) return <Navigate to="/app/ruta" replace />
  const { mod, lesson, prev, next } = found
  const id = `${mod.id}/${lesson.id}`
  const isDone = done.includes(id)
  const c = colorMap[mod.color]
  const canComplete = !lesson.quiz || quizPassed || isDone
  const Tool = lesson.tool ? toolsMeta[lesson.tool].Comp : null

  const finish = () => {
    complete(id)
    setCelebrate(true)
    setTimeout(() => {
      setCelebrate(false)
      if (next) navigate(`/app/ruta/${next.m.id}/${next.l.id}`)
      else navigate('/app/plan')
    }, 1300)
  }

  return (
    <div className="mx-auto max-w-4xl" key={id}>
      <Link to="/app/ruta" className="mb-6 inline-flex items-center gap-1 text-sm font-semibold text-slate-400 hover:text-white">
        <ChevronLeft className="h-4 w-4" /> Mi ruta
      </Link>

      <header className="card relative overflow-hidden p-7 sm:p-10">
        <div className={clsx('absolute inset-0 bg-gradient-to-br to-transparent opacity-80', c.from)} />
        <div className="relative">
          <div className="flex items-center gap-3">
            <ModuleIcon mod={mod} />
            <div>
              <div className={clsx('text-xs font-bold uppercase tracking-widest', c.text)}>{mod.title}</div>
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <span className="capitalize">{lesson.kind}</span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> {lesson.minutes} min
                </span>
              </div>
            </div>
            {isDone && (
              <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-mint-400 px-3 py-1 text-xs font-bold text-ink-950">
                <Check className="h-3.5 w-3.5" /> Completada
              </span>
            )}
          </div>
          <h1 className="mt-6 text-3xl font-extrabold leading-tight text-white sm:text-4xl">{lesson.title}</h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-300">{lesson.intro}</p>
        </div>
      </header>

      <div className="mt-6 space-y-6">
        <ul className="grid gap-3 sm:grid-cols-2">
          {lesson.points.map((p, i) => (
            <motion.li key={p} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.06 }} className="card flex gap-3 p-5">
              <span className={clsx('grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-extrabold', c.bg, c.text)}>{i + 1}</span>
              <span className="text-slate-200">{p}</span>
            </motion.li>
          ))}
        </ul>

        {lesson.tip && (
          <div className="flex gap-4 rounded-3xl border border-gold-400/25 bg-gold-400/[0.07] p-5">
            <Lightbulb className="h-6 w-6 shrink-0 text-gold-400" />
            <p className="text-slate-200">{lesson.tip}</p>
          </div>
        )}

        {lesson.prompt && (
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/5 px-5 py-3">
              <span className="flex items-center gap-2 text-sm font-bold text-violet-400">
                <MessageSquareText className="h-4 w-4" /> Prompt para practicar
              </span>
              <CopyButton text={lesson.prompt} />
            </div>
            <p className="whitespace-pre-wrap p-5 font-mono text-sm leading-relaxed text-slate-200">{lesson.prompt}</p>
            <p className="px-5 pb-5 text-xs text-slate-500">Pégalo en ChatGPT, Claude o Gemini. Cambia lo que está entre [CORCHETES] por tus datos aproximados.</p>
          </div>
        )}

        {Tool && lesson.tool && (
          <div className="card p-6">
            <div className="mb-6 flex items-center gap-2 text-sm font-bold text-mint-300">
              <Wrench className="h-4 w-4" /> Aplícalo: {toolsMeta[lesson.tool].title}
            </div>
            <Tool />
          </div>
        )}

        {lesson.quiz && <QuizBlock quiz={lesson.quiz} onPass={() => setQuizPassed(true)} />}

        <div className="flex flex-col-reverse items-stretch justify-between gap-3 pt-4 sm:flex-row sm:items-center">
          {prev ? (
            <Link to={`/app/ruta/${prev.m.id}/${prev.l.id}`} className="inline-flex items-center gap-1 rounded-full px-4 py-3 text-sm font-semibold text-slate-400 hover:bg-white/5 hover:text-white">
              <ChevronLeft className="h-4 w-4" /> {prev.l.title}
            </Link>
          ) : (
            <span />
          )}
          {isDone ? (
            next ? (
              <Link to={`/app/ruta/${next.m.id}/${next.l.id}`} className="inline-flex items-center justify-center gap-1 rounded-full bg-white/[0.06] px-6 py-3 text-sm font-bold text-white hover:bg-white/10">
                Siguiente: {next.l.title} <ChevronRight className="h-4 w-4" />
              </Link>
            ) : (
              <Link to="/app/plan" className="inline-flex items-center justify-center gap-2 rounded-full bg-mint-400 px-6 py-3 text-sm font-bold text-ink-950">
                Ver mi plan <ArrowRight className="h-4 w-4" />
              </Link>
            )
          ) : (
            <Button onClick={finish} disabled={!canComplete} title={!canComplete ? 'Responde el quiz para continuar' : undefined}>
              <CheckCircle2 className="h-4 w-4" /> {canComplete ? 'Marcar como completada' : 'Responde el quiz para continuar'}
            </Button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {celebrate && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pointer-events-none fixed inset-0 z-[60] grid place-items-center bg-ink-950/60 backdrop-blur-sm">
            {Array.from({ length: 24 }).map((_, i) => (
              <motion.span
                key={i}
                className="absolute text-2xl"
                initial={{ x: 0, y: 0, opacity: 1, scale: 0.5 }}
                animate={{ x: Math.cos((i / 24) * Math.PI * 2) * 260, y: Math.sin((i / 24) * Math.PI * 2) * 260, opacity: 0, scale: 1.2, rotate: 180 }}
                transition={{ duration: 1.1, ease: 'easeOut' }}
              >
                {['🎉', '✨', '💸', '🌟'][i % 4]}
              </motion.span>
            ))}
            <motion.div initial={{ scale: 0.6 }} animate={{ scale: 1 }} className="card px-10 py-8 text-center">
              <div className="text-5xl">🎉</div>
              <div className="mt-3 text-2xl font-extrabold text-white">¡Lección completada!</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
