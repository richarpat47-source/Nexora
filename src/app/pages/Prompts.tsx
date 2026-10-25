import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import clsx from 'clsx'
import { CopyButton } from '../../components/CopyButton'
import { prompts, type PromptItem } from '../../data/prompts'
import { MessageSquareText, Search, Wand2 } from '../../components/icons'

const cats = ['Todos', ...Array.from(new Set(prompts.map((p) => p.category)))] as const

/** Constructor guiado: rol + objetivo + contexto + formato. */
function PromptBuilder() {
  const [role, setRole] = useState('un educador financiero paciente')
  const [goal, setGoal] = useState('organizar mi presupuesto mensual')
  const [ctx, setCtx] = useState('gano unos $1.500 al mes y tengo una deuda de tarjeta')
  const [format, setFormat] = useState('una tabla y 3 pasos concretos')
  const [level, setLevel] = useState('principiante')
  const text = `Actúa como ${role}. Mi objetivo es ${goal}. Contexto: ${ctx}. Mi nivel es ${level}, así que evita la jerga. Responde con ${format}. Antes de responder, hazme hasta 2 preguntas si te falta información importante.`
  const fields = [
    { l: '1 · Rol', v: role, s: setRole, ex: ['un educador financiero paciente', 'un coach de ahorro motivador', 'un experto en detectar fraudes'] },
    { l: '2 · Objetivo', v: goal, s: setGoal, ex: ['organizar mi presupuesto mensual', 'salir de mis deudas', 'ahorrar para una meta'] },
    { l: '3 · Contexto', v: ctx, s: setCtx, ex: ['gano unos $1.500 al mes y tengo una deuda de tarjeta', 'soy freelancer con ingresos variables', 'quiero empezar a ahorrar desde cero'] },
    { l: '4 · Formato', v: format, s: setFormat, ex: ['una tabla y 3 pasos concretos', 'una lista corta', 'un plan semana a semana'] },
  ]
  return (
    <div className="card overflow-hidden">
      <div className="border-b border-white/5 bg-gradient-to-r from-violet-500/20 to-transparent p-6">
        <h2 className="flex items-center gap-2 text-xl font-extrabold text-white">
          <Wand2 className="h-5 w-5 text-violet-400" /> Constructor de prompts
        </h2>
        <p className="mt-1 text-sm text-slate-300">Un buen prompt tiene 4 piezas. Elige o escribe cada una.</p>
      </div>
      <div className="grid gap-6 p-6 lg:grid-cols-2">
        <div className="space-y-5">
          {fields.map((f) => (
            <div key={f.l}>
              <span className="label">{f.l}</span>
              <input className="field" value={f.v} onChange={(e) => f.s(e.target.value)} />
              <div className="mt-2 flex flex-wrap gap-1.5">
                {f.ex.map((e) => (
                  <button key={e} onClick={() => f.s(e)} className={clsx('rounded-full px-2.5 py-1 text-xs transition', f.v === e ? 'bg-violet-500/25 text-violet-300' : 'bg-white/5 text-slate-400 hover:text-white')}>
                    {e}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <div>
            <span className="label">Tu nivel</span>
            <div className="flex gap-2">
              {['principiante', 'intermedio'].map((l) => (
                <button key={l} onClick={() => setLevel(l)} className={clsx('rounded-full px-4 py-2 text-sm font-semibold capitalize transition', level === l ? 'bg-mint-400 text-ink-950' : 'bg-white/5 text-slate-300')}>
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center justify-between">
            <span className="label">Tu prompt listo</span>
            <CopyButton text={text} />
          </div>
          <motion.div key={text} initial={{ opacity: 0.6 }} animate={{ opacity: 1 }} className="flex-1 rounded-2xl border border-violet-400/25 bg-ink-900/80 p-5 font-mono text-sm leading-relaxed text-slate-200">
            {text}
          </motion.div>
          <p className="mt-3 text-xs text-slate-500">🔒 Recuerda: nunca incluyas contraseñas, números de cuenta o códigos de verificación.</p>
        </div>
      </div>
    </div>
  )
}

function PromptCard({ p }: { p: PromptItem }) {
  return (
    <motion.div layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} className="card flex flex-col p-5">
      <div className="flex items-center justify-between gap-2">
        <span className="rounded-full bg-mint-400/10 px-2.5 py-1 text-[11px] font-bold text-mint-300">{p.category}</span>
        <span className="text-[11px] text-slate-500">{p.level}</span>
      </div>
      <h3 className="mt-3 font-extrabold text-white">{p.title}</h3>
      <p className="mt-2 flex-1 font-mono text-[13px] leading-relaxed text-slate-400">{p.text}</p>
      <CopyButton text={p.text} className="mt-4 self-start" />
    </motion.div>
  )
}

export default function Prompts() {
  const [cat, setCat] = useState<string>('Todos')
  const [q, setQ] = useState('')
  const list = useMemo(
    () => prompts.filter((p) => (cat === 'Todos' || p.category === cat) && (p.title + p.text).toLowerCase().includes(q.toLowerCase())),
    [cat, q],
  )
  return (
    <div className="space-y-8">
      <div>
        <h1 className="flex items-center gap-3 text-3xl font-extrabold text-white sm:text-4xl">
          <MessageSquareText className="h-8 w-8 text-violet-400" /> Laboratorio de prompts
        </h1>
        <p className="mt-2 text-slate-400">Copia, pega en tu asistente de IA favorito y personaliza lo que está entre [corchetes].</p>
      </div>
      <PromptBuilder />
      <div>
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {cats.map((c) => (
              <button key={c} onClick={() => setCat(c)} className={clsx('shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition', cat === c ? 'bg-white text-ink-950' : 'bg-white/5 text-slate-300 hover:bg-white/10')}>
                {c}
              </button>
            ))}
          </div>
          <label className="relative md:w-64">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input className="field pl-10" placeholder="Buscar prompt…" value={q} onChange={(e) => setQ(e.target.value)} />
          </label>
        </div>
        <motion.div layout className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {list.map((p) => (
              <PromptCard key={p.id} p={p} />
            ))}
          </AnimatePresence>
        </motion.div>
        {list.length === 0 && <p className="py-10 text-center text-slate-500">No hay prompts con ese filtro.</p>}
      </div>
    </div>
  )
}
