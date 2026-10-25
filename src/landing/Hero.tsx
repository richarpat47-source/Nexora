import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useScroll, useTransform } from 'motion/react'
import { Link } from 'react-router'
import clsx from 'clsx'
import { ButtonLink, Eyebrow, Logo } from '../components/ui'
import { ArrowRight, Bot, Menu, PiggyBank, Play, ShieldCheck, Sparkles, TrendingUp, X } from '../components/icons'

const links = [
  { href: '#beneficios', label: 'Beneficios' },
  { href: '#como-funciona', label: 'Cómo funciona' },
  { href: '#demo', label: 'Pruébalo' },
  { href: '#modulos', label: 'Programa' },
  { href: '#precios', label: 'Precios' },
  { href: '#faq', label: 'FAQ' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  return (
    <header className={clsx('fixed inset-x-0 top-0 z-50 transition-all duration-300', scrolled ? 'py-3' : 'py-5')}>
      <nav
        className={clsx(
          'mx-auto flex max-w-6xl items-center justify-between rounded-full px-4 py-2.5 transition-all duration-300 sm:px-6',
          scrolled ? 'glass mx-4 shadow-2xl shadow-black/40 sm:mx-auto' : 'bg-transparent',
        )}
      >
        <a href="#top" aria-label="Nexora inicio">
          <Logo />
        </a>
        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="rounded-full px-3.5 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <Link to="/app" className="hidden rounded-full px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white sm:block">
            Entrar
          </Link>
          <ButtonLink to="/app" className="px-4 py-2.5 sm:px-5">
            Empieza gratis
          </ButtonLink>
          <button onClick={() => setOpen((o) => !o)} className="grid h-10 w-10 place-items-center rounded-full text-white hover:bg-white/10 lg:hidden" aria-label="Menú">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass mx-4 mt-2 rounded-3xl p-4 lg:hidden"
          >
            {links.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block rounded-xl px-4 py-3 font-medium text-slate-200 hover:bg-white/5">
                {l.label}
              </a>
            ))}
            <ButtonLink to="/app" className="mt-2 w-full">
              Empieza gratis
            </ButtonLink>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

const chat = [
  { me: true, t: 'Me da miedo usar IA para mis finanzas 😬' },
  { me: false, t: 'Es normal. Vamos paso a paso: nunca te pediré datos sensibles. ¿Cuánto ganas al mes, aproximadamente?' },
  { me: true, t: 'Unos $1,500 y no me alcanza 😩' },
  { me: false, t: 'Con 50/30/20 podrías ahorrar $300 al mes. En 20 meses tendrías tu fondo de emergencia 🎯' },
]

function ChatDemo() {
  const [{ n, cycle }, setState] = useState({ n: 1, cycle: 0 })
  useEffect(() => {
    const t = setInterval(() => setState((s) => (s.n >= chat.length ? { n: 1, cycle: s.cycle + 1 } : { ...s, n: s.n + 1 })), 2600)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="space-y-2.5">
      <AnimatePresence initial={false} mode="popLayout">
        {chat.slice(0, n).map((m, i) => (
          <motion.div
            key={`${cycle}-${i}`}
            exit={{ opacity: 0 }}
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.35 }}
            className={clsx(
              'max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-snug',
              m.me ? 'ml-auto rounded-br-md bg-mint-400 font-medium text-ink-950' : 'rounded-bl-md bg-white/[0.07] text-slate-200',
            )}
          >
            {m.t}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

function HeroVisual() {
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 600], [0, -60])
  const y2 = useTransform(scrollY, [0, 600], [0, 40])
  return (
    <div className="relative mx-auto w-full max-w-[540px]">
      {/* Halo */}
      <div className="absolute -inset-10 -z-10 rounded-full bg-gradient-to-tr from-mint-400/25 via-violet-500/20 to-transparent blur-3xl" />
      <div className="absolute left-1/2 top-1/2 -z-10 h-[460px] w-[460px] -translate-x-1/2 -translate-y-1/2 animate-spin-slow rounded-full border border-dashed border-white/10" />

      {/* Tarjeta principal: asistente */}
      <motion.div style={{ y: y1 }} className="card relative overflow-hidden p-5 shadow-2xl shadow-black/50">
        <div className="mb-4 flex items-center gap-3">
          <div className="relative grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-mint-400 to-violet-500">
            <Bot className="h-5 w-5 text-ink-950" />
            <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-ink-800 bg-mint-400" />
          </div>
          <div>
            <div className="text-sm font-bold text-white">Nexo · tu copiloto IA</div>
            <div className="text-xs text-mint-300">en línea · modo principiante</div>
          </div>
          <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-1 text-[11px] text-slate-300">
            <ShieldCheck className="h-3.5 w-3.5 text-mint-300" /> Privado
          </span>
        </div>
        <div className="h-[290px] overflow-hidden sm:h-[230px]">
          <ChatDemo />
        </div>
      </motion.div>

      {/* Chip: ahorro */}
      <motion.div style={{ y: y2 }} className="absolute -left-4 bottom-[-48px] hidden w-56 sm:-left-12 sm:block">
        <div className="card animate-float p-4 shadow-xl shadow-black/40">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <PiggyBank className="h-4 w-4 text-gold-400" /> Fondo de emergencia
          </div>
          <div className="mt-1 text-2xl font-extrabold text-white">$4,200</div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
            <motion.div initial={{ width: 0 }} animate={{ width: '70%' }} transition={{ duration: 1.6, delay: 0.6 }} className="h-full rounded-full bg-gradient-to-r from-gold-400 to-mint-400" />
          </div>
          <div className="mt-1.5 text-[11px] text-slate-400">70% de tu meta 🎉</div>
        </div>
      </motion.div>

      {/* Chip: crecimiento */}
      <motion.div style={{ y: y1 }} className="absolute -right-2 -top-10 hidden w-48 sm:-right-10 sm:block">
        <div className="card animate-float p-4 shadow-xl shadow-black/40 [animation-delay:1.5s]">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <TrendingUp className="h-4 w-4 text-mint-300" /> Proyección 10 años
          </div>
          <svg viewBox="0 0 160 50" className="mt-2 h-12 w-full">
            <defs>
              <linearGradient id="spark" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#34d399" stopOpacity=".5" />
                <stop offset="1" stopColor="#34d399" stopOpacity="0" />
              </linearGradient>
            </defs>
            <motion.path
              d="M0 45 C30 42 45 38 65 32 S105 18 125 12 S150 4 160 2"
              fill="none"
              stroke="#34d399"
              strokeWidth="2.5"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 0.4 }}
            />
            <path d="M0 45 C30 42 45 38 65 32 S105 18 125 12 S150 4 160 2 V50 H0Z" fill="url(#spark)" />
          </svg>
          <div className="text-lg font-extrabold text-mint-300">+$18.4k</div>
        </div>
      </motion.div>

      {/* Badge: miedo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2 }}
        className="glass absolute -bottom-6 right-2 flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-white shadow-lg sm:right-0"
      >
        😌 Miedo a la IA: <span className="text-mint-300">-82%</span>
      </motion.div>
    </div>
  )
}

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pb-28 pt-36 sm:pt-44">
      <div className="grid-bg pointer-events-none absolute inset-0 -z-10" />
      <div className="mx-auto grid max-w-6xl items-center gap-20 px-5 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
        <div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <Eyebrow>
              <Sparkles className="h-3.5 w-3.5" /> IA + finanzas para principiantes
            </Eyebrow>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="mt-6 text-[2.6rem] font-extrabold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-[4.2rem]"
          >
            Pierde el miedo a la IA.{' '}
            <span className="font-serif text-[1.08em] font-normal italic text-gradient">Gana control</span> de tu dinero.
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }} className="mt-6 max-w-xl text-lg leading-relaxed text-slate-400">
            Nexora te acompaña paso a paso para usar la inteligencia artificial con confianza y construir tu plan financiero personal con lecciones interactivas, herramientas reales y cero tecnicismos.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.7 }} className="mt-9 flex flex-wrap items-center gap-3">
            <ButtonLink to="/app" className="px-7 py-4 text-base">
              Crear mi plan gratis <ArrowRight className="h-4 w-4" />
            </ButtonLink>
            <a href="#demo" className="group inline-flex items-center gap-3 rounded-full px-4 py-3 text-sm font-semibold text-white">
              <span className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/5 transition group-hover:scale-110 group-hover:bg-white/10">
                <Play className="h-4 w-4 fill-white" />
              </span>
              Pruébalo en vivo
            </a>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-10 flex items-center gap-4">
            <div className="flex -space-x-3">
              {['🧑🏽', '👩🏻', '👨🏾', '👩🏽‍🦱', '🧔🏻'].map((e, i) => (
                <span key={i} className="grid h-10 w-10 place-items-center rounded-full border-2 border-ink-900 bg-gradient-to-br from-ink-600 to-ink-700 text-lg">
                  {e}
                </span>
              ))}
            </div>
            <div className="text-sm text-slate-400">
              <div className="text-gold-400">★★★★★</div>
              Pensado para quienes <b className="text-white">nunca</b> han usado IA
            </div>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.25, duration: 0.8 }}>
          <HeroVisual />
        </motion.div>
      </div>
    </section>
  )
}
