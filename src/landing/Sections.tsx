import { useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useTransform } from 'motion/react'
import clsx from 'clsx'
import { Button, ButtonLink, Logo, ModuleIcon, Reveal, SectionTitle, colorMap } from '../components/ui'
import { BudgetTool, CompoundTool, DebtTool } from '../components/tools'
import { modules, totalMinutes } from '../data/modules'
import {
  ArrowRight,
  Bot,
  Calculator,
  Check,
  ChevronDown,
  Clock,
  Gauge,
  GraduationCap,
  HeartHandshake,
  Layers,
  Lightbulb,
  Lock,
  Mail,
  MousePointerClick,
  Quote,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  Wand2,
} from '../components/icons'

/* ---------- Marquee ---------- */
const topics = ['Presupuesto', 'ChatGPT', 'Fondo de emergencia', 'Claude', 'Salir de deudas', 'Gemini', 'Interés compuesto', 'Prompts', 'Metas de ahorro', 'Evitar estafas', 'Inversión básica', 'Privacidad']
export function Marquee() {
  return (
    <div className="relative overflow-hidden border-y border-white/[0.06] bg-ink-850/60 py-5">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-ink-900 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-ink-900 to-transparent" />
      <div className="flex w-max animate-marquee gap-10">
        {[...topics, ...topics].map((t, i) => (
          <span key={i} className="flex items-center gap-3 whitespace-nowrap text-sm font-semibold text-slate-400">
            <Sparkles className="h-4 w-4 text-mint-400/70" /> {t}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ---------- Stats ---------- */
export function Stats() {
  const items = [
    { v: `${modules.length}`, l: 'Módulos guiados', i: Layers },
    { v: `${Math.round(totalMinutes)}′`, l: 'De contenido práctico', i: Clock },
    { v: '6', l: 'Herramientas reales', i: Calculator },
    { v: '0', l: 'Conocimientos previos', i: GraduationCap },
  ]
  return (
    <section className="mx-auto max-w-6xl px-5 py-20">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {items.map((x, i) => (
          <Reveal key={x.l} delay={i * 0.08}>
            <div className="card group p-6 text-center transition hover:-translate-y-1 hover:border-mint-400/30">
              <x.i className="mx-auto h-6 w-6 text-mint-300 transition group-hover:scale-110" />
              <div className="mt-3 text-4xl font-extrabold text-white sm:text-5xl">{x.v}</div>
              <div className="mt-1 text-sm text-slate-400">{x.l}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/* ---------- Problema: antes / después ---------- */
export function Problem() {
  const [after, setAfter] = useState(false)
  const before = [
    '“La IA es para programadores, no para mí.”',
    'Llega fin de mes y no sabes en qué se fue el dinero.',
    'Las deudas crecen y no sabes cuál pagar primero.',
    'Te da pena preguntar y miedo a que te estafen.',
  ]
  const afterL = [
    'Usas la IA como copiloto en 5 minutos al día.',
    'Cada peso tiene un propósito claro con tu presupuesto.',
    'Tienes un plan de deudas con fecha de libertad.',
    'Sabes qué compartir, qué no, y detectas estafas.',
  ]
  return (
    <section className="relative mx-auto max-w-6xl px-5 py-24">
      <SectionTitle
        eyebrow="El problema"
        title={
          <>
            El miedo te está costando <span className="font-serif font-normal italic text-gradient">dinero</span>
          </>
        }
        subtitle="La IA ya puede ayudarte a organizar tus finanzas, pero la mayoría no la usa por miedo, desconfianza o porque nadie se lo explicó bien."
      />
      <Reveal className="mx-auto max-w-4xl">
        <div className="mb-8 flex justify-center">
          <div className="glass relative flex rounded-full p-1.5">
            <motion.span layout className={clsx('absolute inset-y-1.5 w-[calc(50%-6px)] rounded-full', after ? 'left-1/2 bg-mint-400' : 'left-1.5 bg-rose-400/90')} />
            <button onClick={() => setAfter(false)} className={clsx('relative z-10 w-40 rounded-full py-2.5 text-sm font-bold transition', !after ? 'text-ink-950' : 'text-slate-300')}>
              😰 Sin Nexora
            </button>
            <button onClick={() => setAfter(true)} className={clsx('relative z-10 w-40 rounded-full py-2.5 text-sm font-bold transition', after ? 'text-ink-950' : 'text-slate-300')}>
              😎 Con Nexora
            </button>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <AnimatePresence mode="wait">
            {(after ? afterL : before).map((t, i) => (
              <motion.div
                key={(after ? 'a' : 'b') + i}
                initial={{ opacity: 0, rotateX: -60, y: 10 }}
                animate={{ opacity: 1, rotateX: 0, y: 0 }}
                exit={{ opacity: 0, rotateX: 60 }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
                className={clsx('card flex items-start gap-4 p-5', after ? 'border-mint-400/25' : 'border-rose-400/20')}
              >
                <span className={clsx('grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-bold', after ? 'bg-mint-400/15 text-mint-300' : 'bg-rose-400/15 text-rose-300')}>
                  {after ? <Check className="h-4 w-4" /> : '✕'}
                </span>
                <p className="pt-1.5 text-slate-200">{t}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </Reveal>
    </section>
  )
}

/* ---------- Beneficios (bento) ---------- */
function BentoCard({ className, children }: { className?: string; children: React.ReactNode }) {
  const [pos, setPos] = useState({ x: 50, y: 50 })
  return (
    <div
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        setPos({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 })
      }}
      className={clsx('card group relative h-full overflow-hidden p-7 transition duration-300 hover:border-white/20', className)}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100"
        style={{ background: `radial-gradient(400px circle at ${pos.x}% ${pos.y}%, rgb(52 211 153 / .12), transparent 40%)` }}
      />
      <div className="relative">{children}</div>
    </div>
  )
}

export function Benefits() {
  return (
    <section id="beneficios" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-24">
      <SectionTitle
        eyebrow="Beneficios"
        title={
          <>
            Todo lo que necesitas, <span className="font-serif font-normal italic text-gradient">nada que te abrume</span>
          </>
        }
        subtitle="Aprendes haciendo: cada lección termina con algo concreto aplicado a tu propio dinero."
      />
      <div className="grid gap-4 md:grid-cols-6">
        <Reveal className="md:col-span-4">
          <BentoCard>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="flex-1">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-violet-500/15 text-violet-400 ring-1 ring-violet-400/30">
                  <Bot className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-2xl font-extrabold text-white">Copiloto de IA en modo principiante</h3>
                <p className="mt-2 text-slate-400">Prompts listos para copiar en ChatGPT, Claude o Gemini. Sin jerga, con ejemplos de tu vida diaria.</p>
              </div>
              <div className="w-full space-y-2 rounded-2xl bg-ink-900/70 p-4 font-mono text-xs text-slate-300 ring-1 ring-white/5 sm:w-64">
                <div className="text-violet-400">› prompt</div>
                <div>Actúa como educador financiero paciente. Explícame en 5 pasos…</div>
                <div className="flex items-center gap-1 text-mint-300">
                  <Check className="h-3.5 w-3.5" /> copiado
                </div>
              </div>
            </div>
          </BentoCard>
        </Reveal>
        <Reveal className="md:col-span-2" delay={0.08}>
          <BentoCard>
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-mint-400/15 text-mint-300 ring-1 ring-mint-400/30">
              <ShieldCheck className="h-6 w-6" />
            </span>
            <h3 className="mt-5 text-xl font-extrabold text-white">Escudo de privacidad</h3>
            <p className="mt-2 text-sm text-slate-400">Aprende qué compartir y qué jamás. Tus datos quedan en tu dispositivo.</p>
          </BentoCard>
        </Reveal>
        <Reveal className="md:col-span-2" delay={0.1}>
          <BentoCard>
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gold-400/15 text-gold-400 ring-1 ring-gold-400/30">
              <Calculator className="h-6 w-6" />
            </span>
            <h3 className="mt-5 text-xl font-extrabold text-white">Herramientas reales</h3>
            <p className="mt-2 text-sm text-slate-400">Presupuesto, deudas, metas, fondo de emergencia e interés compuesto con tus números.</p>
          </BentoCard>
        </Reveal>
        <Reveal className="md:col-span-2" delay={0.14}>
          <BentoCard>
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-sky-400/15 text-sky-300 ring-1 ring-sky-400/30">
              <MousePointerClick className="h-6 w-6" />
            </span>
            <h3 className="mt-5 text-xl font-extrabold text-white">100% interactivo</h3>
            <p className="mt-2 text-sm text-slate-400">Quizzes, retos y simuladores. Nada de videos eternos.</p>
          </BentoCard>
        </Reveal>
        <Reveal className="md:col-span-2" delay={0.18}>
          <BentoCard>
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-rose-400/15 text-rose-300 ring-1 ring-rose-400/30">
              <Trophy className="h-6 w-6" />
            </span>
            <h3 className="mt-5 text-xl font-extrabold text-white">Progreso que motiva</h3>
            <p className="mt-2 text-sm text-slate-400">Avance visual, logros y tu plan financiero descargable al final.</p>
          </BentoCard>
        </Reveal>
      </div>
    </section>
  )
}

/* ---------- Cómo funciona ---------- */
export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] })
  const h = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
  const steps = [
    { i: Gauge, t: 'Mide tu miedo y tu punto de partida', d: 'Un diagnóstico de 2 minutos ajusta la ruta a tu nivel de confianza y tu situación.' },
    { i: Lightbulb, t: 'Aprende en micro-lecciones', d: 'Lecciones de 5 a 10 minutos con ejemplos, quizzes y prompts para practicar con IA.' },
    { i: Wand2, t: 'Aplícalo con herramientas reales', d: 'Cada concepto se convierte en números concretos: tu presupuesto, tu colchón, tus deudas.' },
    { i: Target, t: 'Descarga tu plan financiero', d: 'Un plan personal, claro y accionable que puedes revisar cada mes.' },
  ]
  return (
    <section id="como-funciona" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-24">
      <SectionTitle
        eyebrow="Cómo funciona"
        title={
          <>
            De <span className="font-serif font-normal italic text-rose-300">“me da miedo”</span> a <span className="font-serif font-normal italic text-gradient">“tengo un plan”</span>
          </>
        }
      />
      <div ref={ref} className="relative mx-auto max-w-3xl">
        <div className="absolute bottom-6 left-7 top-6 w-px bg-white/10" />
        <motion.div style={{ height: h }} className="absolute left-7 top-6 w-px bg-gradient-to-b from-mint-400 to-violet-500" />
        <div className="space-y-6">
          {steps.map((s, i) => (
            <Reveal key={s.t} delay={i * 0.05}>
              <div className="relative flex gap-6">
                <div className="relative z-10 grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-white/10 bg-ink-800 text-mint-300 shadow-lg">
                  <s.i className="h-6 w-6" />
                </div>
                <div className="card flex-1 p-6">
                  <div className="text-xs font-bold uppercase tracking-widest text-mint-400">Paso {i + 1}</div>
                  <h3 className="mt-1 text-xl font-extrabold text-white">{s.t}</h3>
                  <p className="mt-2 text-slate-400">{s.d}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------- Termómetro del miedo (quiz) ---------- */
const fearQs = [
  { q: '¿Has usado alguna vez ChatGPT, Claude o Gemini?', a: ['Nunca', 'Una o dos veces', 'A veces', 'Seguido'] },
  { q: '¿Qué tanto te preocupa compartir información con una IA?', a: ['Muchísimo', 'Bastante', 'Un poco', 'Nada'] },
  { q: '¿Sabes cuánto gastaste el mes pasado?', a: ['Ni idea', 'Más o menos', 'Casi exacto', 'Al centavo'] },
  { q: '¿Tienes un plan para tus deudas o ahorros?', a: ['No', 'En mi cabeza', 'Algo anotado', 'Sí, escrito'] },
]
export function FearQuiz() {
  const [step, setStep] = useState(0)
  const [score, setScore] = useState(0)
  const done = step >= fearQs.length
  const max = fearQs.length * 3
  const confidence = Math.round((score / max) * 100)
  const result =
    confidence < 35
      ? { e: '🌱', t: 'Explorador cauteloso', d: 'Empezamos desde cero, con calma y muchas prácticas guiadas. Tu primer módulo: “IA sin miedo”.' }
      : confidence < 70
        ? { e: '🚀', t: 'Aprendiz en despegue', d: 'Ya tienes bases. Te llevamos directo a tu radiografía financiera y presupuesto con IA.' }
        : { e: '🦾', t: 'Listo para acelerar', d: 'Vas por buen camino. Enfócate en deudas, metas e interés compuesto para multiplicar resultados.' }
  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <Reveal>
        <div className="card relative overflow-hidden p-8 sm:p-12">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-mint-400/15 blur-3xl" />
          <div className="relative grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:items-center">
            <div>
              <span className="text-5xl">🌡️</span>
              <h2 className="mt-4 text-3xl font-extrabold text-white sm:text-4xl">Termómetro del miedo</h2>
              <p className="mt-3 text-slate-400">4 preguntas, 30 segundos. Descubre tu perfil y la ruta ideal para ti.</p>
              <div className="mt-6 flex gap-1.5">
                {fearQs.map((_, i) => (
                  <span key={i} className={clsx('h-1.5 flex-1 rounded-full transition', i < step ? 'bg-mint-400' : 'bg-white/10')} />
                ))}
              </div>
            </div>
            <div className="min-h-[260px]">
              <AnimatePresence mode="wait">
                {!done ? (
                  <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                    <div className="text-xs font-bold uppercase tracking-widest text-mint-400">
                      Pregunta {step + 1} de {fearQs.length}
                    </div>
                    <h3 className="mt-2 text-xl font-bold text-white">{fearQs[step].q}</h3>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      {fearQs[step].a.map((a, i) => (
                        <button
                          key={a}
                          onClick={() => {
                            setScore((s) => s + i)
                            setStep((s) => s + 1)
                          }}
                          className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-left font-semibold text-slate-200 transition hover:-translate-y-0.5 hover:border-mint-400/50 hover:bg-mint-400/10"
                        >
                          {a}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="r" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center lg:text-left">
                    <div className="text-6xl">{result.e}</div>
                    <div className="mt-3 text-sm text-slate-400">Tu nivel de confianza: {confidence}%</div>
                    <h3 className="mt-1 text-2xl font-extrabold text-gradient">{result.t}</h3>
                    <p className="mt-3 text-slate-300">{result.d}</p>
                    <div className="mt-6 flex flex-wrap justify-center gap-3 lg:justify-start">
                      <ButtonLink to="/app">
                        Empezar mi ruta <ArrowRight className="h-4 w-4" />
                      </ButtonLink>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setStep(0)
                          setScore(0)
                        }}
                      >
                        <RotateCcw className="h-4 w-4" /> Repetir
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

/* ---------- Demo en vivo ---------- */
export function Demo() {
  const tabs = [
    { id: 'p', label: 'Presupuesto 50/30/20', C: BudgetTool },
    { id: 'i', label: 'Interés compuesto', C: CompoundTool },
    { id: 'd', label: 'Plan de deudas', C: DebtTool },
  ]
  const [tab, setTab] = useState('p')
  const Current = tabs.find((t) => t.id === tab)!.C
  return (
    <section id="demo" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-24">
      <SectionTitle
        eyebrow="Pruébalo ahora"
        title={
          <>
            Herramientas reales, <span className="font-serif font-normal italic text-gradient">no promesas</span>
          </>
        }
        subtitle="Mueve los controles y mira cómo cambia tu panorama en tiempo real. Esto es solo una muestra de lo que hay dentro."
      />
      <Reveal>
        <div className="card p-4 sm:p-8">
          <div className="mb-8 flex gap-2 overflow-x-auto pb-1">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={clsx('relative shrink-0 rounded-full px-5 py-2.5 text-sm font-bold transition', tab === t.id ? 'text-ink-950' : 'text-slate-300 hover:text-white')}
              >
                {tab === t.id && <motion.span layoutId="demo-tab" className="absolute inset-0 rounded-full bg-mint-400" />}
                <span className="relative">{t.label}</span>
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
              <Current />
            </motion.div>
          </AnimatePresence>
        </div>
      </Reveal>
    </section>
  )
}

/* ---------- Programa / módulos ---------- */
export function Modules() {
  const [open, setOpen] = useState<string | null>(modules[0].id)
  return (
    <section id="modulos" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-24">
      <SectionTitle
        eyebrow="El programa"
        title={
          <>
            {modules.length} módulos para pasar del miedo <span className="font-serif font-normal italic text-gradient">a la acción</span>
          </>
        }
        subtitle="Una ruta clara, en orden, que puedes hacer a tu ritmo."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        {modules.map((m, i) => {
          const isOpen = open === m.id
          const c = colorMap[m.color]
          return (
            <Reveal key={m.id} delay={(i % 2) * 0.08}>
              <div className={clsx('card overflow-hidden transition', isOpen && 'border-white/20')}>
                <button onClick={() => setOpen(isOpen ? null : m.id)} className="flex w-full items-center gap-4 p-5 text-left">
                  <ModuleIcon mod={m} />
                  <div className="min-w-0 flex-1">
                    <div className={clsx('text-xs font-bold uppercase tracking-widest', c.text)}>Módulo {i + 1}</div>
                    <div className="text-lg font-extrabold text-white">{m.title}</div>
                    <div className="truncate text-sm text-slate-400">{m.tagline}</div>
                  </div>
                  <ChevronDown className={clsx('h-5 w-5 shrink-0 text-slate-400 transition', isOpen && 'rotate-180')} />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.ul initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                      <div className="space-y-1 border-t border-white/5 px-5 pb-5 pt-3">
                        {m.lessons.map((l) => (
                          <li key={l.id} className="flex items-center gap-3 rounded-xl px-2 py-2 text-sm">
                            <Lock className="h-3.5 w-3.5 text-slate-500" />
                            <span className="flex-1 text-slate-200">{l.title}</span>
                            <span className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] capitalize text-slate-400">{l.kind}</span>
                            <span className="text-xs tabular-nums text-slate-500">{l.minutes} min</span>
                          </li>
                        ))}
                      </div>
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}

/* ---------- Testimonios ---------- */
// TODO(contenido): reemplazar por testimonios reales con autorización antes de lanzar.
const testimonials = [
  { n: 'Testimonio de ejemplo', r: 'Emprendedora, 42', e: '👩🏽', t: 'Pensaba que la IA no era para mí. En una semana armé mi presupuesto y ya tengo mi primer mes de colchón.' },
  { n: 'Testimonio de ejemplo', r: 'Docente, 51', e: '👨🏻‍🦳', t: 'El simulador de deudas me abrió los ojos. Cambié a avalancha y voy a terminar 8 meses antes.' },
  { n: 'Testimonio de ejemplo', r: 'Diseñadora, 29', e: '👩🏻', t: 'Los prompts listos son oro. Ahora uso Claude para revisar mis gastos cada domingo.' },
  { n: 'Testimonio de ejemplo', r: 'Chofer, 37', e: '🧔🏾', t: 'Lo mejor fue aprender qué datos NO compartir. Me siento seguro usando la IA.' },
]
export function Testimonials() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-24">
      <SectionTitle
        eyebrow="Historias"
        title={
          <>
            Personas reales, <span className="font-serif font-normal italic text-gradient">miedos reales</span>
          </>
        }
      />
      <div className="grid gap-4 md:grid-cols-2">
        {testimonials.map((x, i) => (
          <Reveal key={i} delay={(i % 2) * 0.08}>
            <figure className="card h-full p-7 transition hover:-translate-y-1 hover:border-white/20">
              <Quote className="h-8 w-8 text-mint-400/60" />
              <blockquote className="mt-4 text-lg leading-relaxed text-slate-200">“{x.t}”</blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-ink-600 to-ink-700 text-xl">{x.e}</span>
                <div>
                  <div className="font-bold text-white">{x.n}</div>
                  <div className="text-sm text-slate-400">{x.r}</div>
                </div>
                <div className="ml-auto text-gold-400">★★★★★</div>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/* ---------- Precios ---------- */
// TODO(negocio): precios provisionales, validar antes de lanzar.
export function Pricing() {
  const [yearly, setYearly] = useState(true)
  const plans = [
    { n: 'Explorador', p: 0, d: 'Para dar tu primer paso sin compromiso.', f: ['Módulo “IA sin miedo” completo', 'Termómetro del miedo', '2 herramientas financieras', 'Biblioteca básica de prompts'], cta: 'Empezar gratis' },
    {
      n: 'Constructor',
      p: yearly ? 7 : 9,
      d: 'Todo para construir tu plan financiero completo.',
      f: ['Los 6 módulos y retos', 'Las 6 herramientas reales', 'Biblioteca completa de prompts', 'Plan financiero descargable', 'Nuevas lecciones cada mes'],
      cta: 'Quiero mi plan',
      hot: true,
    },
    { n: 'Mentoría', p: yearly ? 24 : 29, d: 'Acompañamiento humano + IA para ir más rápido.', f: ['Todo lo de Constructor', 'Sesión grupal mensual en vivo', 'Revisión de tu plan', 'Comunidad privada'], cta: 'Hablar con el equipo' },
  ]
  return (
    <section id="precios" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-24">
      <SectionTitle
        eyebrow="Precios"
        title={
          <>
            Invierte menos que <span className="font-serif font-normal italic text-gradient">un café al mes</span>
          </>
        }
        subtitle="Empieza gratis. Mejora cuando estés listo."
      />
      <div className="mb-10 flex items-center justify-center gap-3 text-sm font-semibold">
        <span className={clsx(!yearly ? 'text-white' : 'text-slate-500')}>Mensual</span>
        <button onClick={() => setYearly((y) => !y)} className="relative h-8 w-14 rounded-full bg-white/10 p-1" aria-label="Cambiar facturación">
          <motion.span layout className={clsx('block h-6 w-6 rounded-full bg-mint-400', yearly && 'ml-auto')} />
        </button>
        <span className={clsx(yearly ? 'text-white' : 'text-slate-500')}>
          Anual <span className="ml-1 rounded-full bg-mint-400/15 px-2 py-0.5 text-xs text-mint-300">-20%</span>
        </span>
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        {plans.map((p, i) => (
          <Reveal key={p.n} delay={i * 0.08}>
            <div className={clsx('relative flex h-full flex-col rounded-3xl p-[1px]', p.hot ? 'bg-gradient-to-b from-mint-400 via-violet-500/60 to-transparent' : 'bg-white/[0.08]')}>
              <div className="flex h-full flex-col rounded-[calc(1.5rem-1px)] bg-ink-800 p-7">
                {p.hot && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-mint-400 px-4 py-1 text-xs font-extrabold text-ink-950">Más elegido</span>}
                <div className="text-lg font-extrabold text-white">{p.n}</div>
                <p className="mt-1 text-sm text-slate-400">{p.d}</p>
                <div className="my-6 flex items-end gap-1">
                  <motion.span key={p.p} initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-5xl font-extrabold text-white">
                    ${p.p}
                  </motion.span>
                  <span className="mb-2 text-sm text-slate-400">/mes</span>
                </div>
                <ul className="mb-8 flex-1 space-y-3">
                  {p.f.map((f) => (
                    <li key={f} className="flex gap-3 text-sm text-slate-300">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-mint-400" /> {f}
                    </li>
                  ))}
                </ul>
                <ButtonLink to="/app" variant={p.hot ? 'primary' : 'ghost'} className="w-full">
                  {p.cta}
                </ButtonLink>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      <p className="mt-8 text-center text-sm text-slate-500">
        <ShieldCheck className="mr-1 inline h-4 w-4 text-mint-400" /> Garantía de 14 días. Si no te sirve, te devolvemos tu dinero.
      </p>
    </section>
  )
}

/* ---------- FAQ ---------- */
const faqs = [
  { q: '¿Necesito saber de tecnología o finanzas?', a: 'No. Nexora está diseñado para personas que nunca han usado IA y que quieren ordenar su dinero desde cero. Si sabes enviar un mensaje, puedes hacerlo.' },
  { q: '¿Tengo que darle mis datos bancarios a la IA?', a: 'Nunca. Te enseñamos a trabajar con cifras aproximadas y a no compartir contraseñas, códigos ni números de cuenta. Las herramientas de Nexora guardan tus datos solo en tu dispositivo.' },
  { q: '¿Qué asistente de IA voy a usar?', a: 'El que prefieras: ChatGPT, Claude, Gemini o Copilot. Los prompts funcionan en todos y la mayoría tiene versión gratuita.' },
  { q: '¿Nexora es asesoría financiera?', a: 'No. Es educación financiera práctica. Te damos conocimiento y herramientas para que tomes mejores decisiones; para casos complejos te recomendamos un profesional certificado.' },
  { q: '¿Cuánto tiempo necesito?', a: `El programa completo dura unos ${Math.round(totalMinutes / 60)} horas repartidas en micro-lecciones de 5 a 10 minutos. Puedes ir a tu ritmo.` },
  { q: '¿Puedo cancelar cuando quiera?', a: 'Sí, sin preguntas ni letras pequeñas. Además tienes 14 días de garantía.' },
]
export function FAQ() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section id="faq" className="mx-auto max-w-3xl scroll-mt-24 px-5 py-24">
      <SectionTitle eyebrow="Preguntas frecuentes" title="Resolvemos tus dudas" />
      <div className="space-y-3">
        {faqs.map((f, i) => (
          <Reveal key={f.q} delay={i * 0.04}>
            <div className={clsx('card overflow-hidden transition', open === i && 'border-mint-400/30')}>
              <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between gap-4 p-5 text-left font-bold text-white" aria-expanded={open === i}>
                {f.q}
                <span className={clsx('grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/5 transition', open === i && 'rotate-45 bg-mint-400 text-ink-950')}>+</span>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <p className="px-5 pb-5 leading-relaxed text-slate-400">{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/* ---------- CTA final + footer ---------- */
export function FinalCTA() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  return (
    <section className="mx-auto max-w-6xl px-5 py-24">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-mint-400/90 via-mint-500 to-violet-500 p-10 text-center sm:p-16">
          <div className="grid-bg absolute inset-0 opacity-40" />
          <div className="relative">
            <HeartHandshake className="mx-auto h-12 w-12 text-ink-950" />
            <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-extrabold leading-tight text-ink-950 sm:text-5xl">Tu yo del futuro te va a agradecer este paso</h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-ink-900/80">Empieza hoy gratis. En 10 minutos tendrás tu primer prompt funcionando y tu radiografía financiera.</p>
            {sent ? (
              <p className="mt-8 font-bold text-ink-950">¡Listo! Te escribiremos pronto ✉️</p>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  // TODO(integración): conectar con el proveedor de email marketing.
                  if (email.includes('@')) setSent(true)
                }}
                className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
              >
                <label className="relative flex-1">
                  <span className="sr-only">Correo electrónico</span>
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-900/60" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@correo.com"
                    className="w-full rounded-full bg-white/90 py-3.5 pl-11 pr-4 text-ink-950 outline-none placeholder:text-ink-900/50 focus:ring-4 focus:ring-white/40"
                  />
                </label>
                <button className="rounded-full bg-ink-950 px-6 py-3.5 font-bold text-white transition hover:bg-ink-800">Quiero empezar</button>
              </form>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06]">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-slate-400">Educación financiera con IA para personas que quieren dejar el miedo atrás.</p>
        </div>
        {[
          { t: 'Producto', l: [['Beneficios', '#beneficios'], ['Programa', '#modulos'], ['Precios', '#precios']] },
          { t: 'Recursos', l: [['Pruébalo', '#demo'], ['Preguntas', '#faq'], ['Entrar a la app', '/app']] },
          { t: 'Legal', l: [['Privacidad', '#'], ['Términos', '#'], ['Aviso educativo', '#']] },
        ].map((c) => (
          <div key={c.t}>
            <div className="mb-4 text-sm font-bold text-white">{c.t}</div>
            <ul className="space-y-2.5 text-sm text-slate-400">
              {c.l.map(([l, h]) => (
                <li key={l}>
                  <a href={h} className="transition hover:text-mint-300">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/[0.06] px-5 py-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Nexora. Contenido educativo, no constituye asesoría financiera.
      </div>
    </footer>
  )
}
