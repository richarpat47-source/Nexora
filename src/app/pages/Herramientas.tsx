import { Link, useParams } from 'react-router'
import { AnimatePresence, motion } from 'motion/react'
import clsx from 'clsx'
import { toolsMeta } from '../../components/tools'
import { Calculator, ChainIcon, Gauge, LineChart, PiggyBank, ShieldCheck, Target } from '../../components/icons'
import type { ToolId } from '../../data/modules'

const icons: Record<ToolId, typeof Gauge> = {
  salud: Gauge,
  presupuesto: Calculator,
  emergencia: ShieldCheck,
  metas: Target,
  deudas: ChainIcon,
  interes: LineChart,
}

export default function Herramientas() {
  const { toolId } = useParams()
  const ids = Object.keys(toolsMeta) as ToolId[]
  const active: ToolId = ids.includes(toolId as ToolId) ? (toolId as ToolId) : 'salud'
  const { Comp, title, desc } = toolsMeta[active]
  const Icon = icons[active]
  return (
    <div>
      <div className="mb-8">
        <h1 className="flex items-center gap-3 text-3xl font-extrabold text-white sm:text-4xl">
          <PiggyBank className="h-8 w-8 text-mint-300" /> Herramientas financieras
        </h1>
        <p className="mt-2 text-slate-400">Tus datos se guardan solo en este dispositivo y alimentan tu plan.</p>
      </div>
      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        {ids.map((id) => {
          const I = icons[id]
          const on = id === active
          return (
            <Link
              key={id}
              to={`/app/herramientas/${id}`}
              className={clsx('relative inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition', on ? 'text-ink-950' : 'text-slate-300 hover:bg-white/5 hover:text-white')}
            >
              {on && <motion.span layoutId="tool-tab" className="absolute inset-0 rounded-full bg-mint-400" />}
              <I className="relative h-4 w-4" />
              <span className="relative">{toolsMeta[id].title}</span>
            </Link>
          )
        })}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={active} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="card p-6 sm:p-8">
          <div className="mb-8 flex items-center gap-4">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-mint-400/15 text-mint-300 ring-1 ring-mint-400/30">
              <Icon className="h-6 w-6" />
            </span>
            <div>
              <h2 className="text-2xl font-extrabold text-white">{title}</h2>
              <p className="text-slate-400">{desc}</p>
            </div>
          </div>
          <Comp />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
