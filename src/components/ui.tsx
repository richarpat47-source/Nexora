import { motion } from 'motion/react'
import { Link } from 'react-router'
import clsx from 'clsx'
import { Brain, ChainIcon, ScanLine, ShieldCheck, TrendingUp, Wallet } from './icons'
import type { Module } from '../data/modules'
import type { ComponentProps, ReactNode } from 'react'

export function Logo({ className }: { className?: string }) {
  return (
    <span className={clsx('inline-flex items-center gap-2.5 font-extrabold tracking-tight text-white', className)}>
      <svg viewBox="0 0 64 64" className="h-8 w-8" aria-hidden>
        <defs>
          <linearGradient id="logo-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#34d399" />
            <stop offset="1" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        <rect width="64" height="64" rx="16" fill="#0d1424" stroke="rgb(255 255 255 / .1)" />
        <path d="M18 46V18l28 28V18" fill="none" stroke="url(#logo-g)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="text-xl">
        Nexora<span className="text-mint-400">.</span>
      </span>
    </span>
  )
}

/** Aparece al entrar en viewport. */
export function Reveal({ children, delay = 0, className, y = 24 }: { children: ReactNode; delay?: number; className?: string; y?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

type Variant = 'primary' | 'ghost' | 'soft'
const variants: Record<Variant, string> = {
  primary:
    'bg-gradient-to-r from-mint-400 to-mint-500 text-ink-950 shadow-[0_10px_40px_-10px_rgb(52_211_153/0.7)] hover:shadow-[0_14px_50px_-8px_rgb(52_211_153/0.85)] hover:-translate-y-0.5',
  ghost: 'border border-white/15 bg-white/[0.03] text-white hover:bg-white/[0.08] hover:border-white/25',
  soft: 'bg-white/[0.06] text-white hover:bg-white/[0.12]',
}
const base =
  'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint-400/60 disabled:opacity-50 disabled:pointer-events-none'

export function ButtonLink({ to, variant = 'primary', className, ...rest }: ComponentProps<typeof Link> & { variant?: Variant }) {
  return <Link to={to} className={clsx(base, variants[variant], className)} {...rest} />
}

export function Button({ variant = 'primary', className, ...rest }: ComponentProps<'button'> & { variant?: Variant }) {
  return <button className={clsx(base, variants[variant], className)} {...rest} />
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={clsx('inline-flex items-center gap-2 rounded-full border border-mint-400/25 bg-mint-400/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-mint-300', className)}>
      <span className="h-1.5 w-1.5 rounded-full bg-mint-400 shadow-[0_0_10px] shadow-mint-400" />
      {children}
    </span>
  )
}

export function SectionTitle({ eyebrow, title, subtitle, center = true }: { eyebrow?: string; title: ReactNode; subtitle?: ReactNode; center?: boolean }) {
  return (
    <Reveal className={clsx('mb-14 max-w-3xl', center && 'mx-auto text-center')}>
      {eyebrow && <Eyebrow className="mb-5">{eyebrow}</Eyebrow>}
      <h2 className="text-3xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl">{title}</h2>
      {subtitle && <p className="mt-5 text-lg leading-relaxed text-slate-400">{subtitle}</p>}
    </Reveal>
  )
}

export const colorMap: Record<Module['color'], { text: string; bg: string; ring: string; from: string; hex: string }> = {
  mint: { text: 'text-mint-300', bg: 'bg-mint-400/12', ring: 'ring-mint-400/30', from: 'from-mint-400/25', hex: '#34d399' },
  violet: { text: 'text-violet-400', bg: 'bg-violet-500/12', ring: 'ring-violet-400/30', from: 'from-violet-500/25', hex: '#a78bfa' },
  gold: { text: 'text-gold-400', bg: 'bg-gold-400/12', ring: 'ring-gold-400/30', from: 'from-gold-400/25', hex: '#fbbf24' },
  sky: { text: 'text-sky-300', bg: 'bg-sky-400/12', ring: 'ring-sky-400/30', from: 'from-sky-400/25', hex: '#7dd3fc' },
  rose: { text: 'text-rose-300', bg: 'bg-rose-400/12', ring: 'ring-rose-400/30', from: 'from-rose-400/25', hex: '#fda4af' },
  emerald: { text: 'text-emerald-300', bg: 'bg-emerald-400/12', ring: 'ring-emerald-400/30', from: 'from-emerald-400/25', hex: '#6ee7b7' },
}

const moduleIcons = { brain: Brain, scan: ScanLine, wallet: Wallet, shield: ShieldCheck, chain: ChainIcon, trend: TrendingUp }

export function ModuleIcon({ mod, className }: { mod: Module; className?: string }) {
  const Icon = moduleIcons[mod.icon]
  const c = colorMap[mod.color]
  return (
    <span className={clsx('inline-grid place-items-center rounded-2xl ring-1', c.bg, c.ring, c.text, className ?? 'h-12 w-12')}>
      <Icon className="h-1/2 w-1/2" />
    </span>
  )
}

export function ProgressRing({ value, size = 120, stroke = 10, children }: { value: number; size?: number; stroke?: number; children?: ReactNode }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="relative inline-grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={`ring-${size}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#34d399" />
            <stop offset="1" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgb(255 255 255 / .07)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#ring-${size})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - Math.min(1, Math.max(0, value))) }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">{children}</div>
    </div>
  )
}

export function Slider({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  format,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  min: number
  max: number
  step?: number
  format: (v: number) => string
}) {
  const p = ((value - min) / (max - min)) * 100
  return (
    <label className="block">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <span className="text-sm font-medium text-slate-300">{label}</span>
        <span className="font-bold tabular-nums text-white">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full"
        style={{ background: `linear-gradient(90deg, #34d399 ${p}%, rgb(255 255 255 / .1) ${p}%)` }}
      />
    </label>
  )
}

export function NumberField({ label, value, onChange, prefix, suffix, min = 0 }: { label: string; value: number; onChange: (v: number) => void; prefix?: string; suffix?: string; min?: number }) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      <div className="relative">
        {prefix && <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-500">{prefix}</span>}
        <input
          type="number"
          inputMode="decimal"
          min={min}
          value={Number.isFinite(value) ? value : ''}
          onChange={(e) => onChange(e.target.value === '' ? 0 : Number(e.target.value))}
          className={clsx('field tabular-nums', prefix && 'pl-8', suffix && 'pr-10')}
        />
        {suffix && <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-500">{suffix}</span>}
      </div>
    </label>
  )
}

export function Stat({ label, value, hint, tone = 'white' }: { label: string; value: ReactNode; hint?: ReactNode; tone?: 'white' | 'mint' | 'violet' | 'gold' | 'rose' }) {
  const tones = { white: 'text-white', mint: 'text-mint-300', violet: 'text-violet-400', gold: 'text-gold-400', rose: 'text-rose-300' }
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4">
      <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</div>
      <div className={clsx('mt-1.5 text-2xl font-extrabold tabular-nums', tones[tone])}>{value}</div>
      {hint && <div className="mt-1 text-xs text-slate-400">{hint}</div>}
    </div>
  )
}
