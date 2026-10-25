import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router'
import { AnimatePresence, motion } from 'motion/react'
import clsx from 'clsx'
import { Logo } from '../components/ui'
import { allLessonIds } from '../data/modules'
import { useProfile, useProgress } from '../lib/storage'
import { BookOpen, Compass, LayoutDashboard, Library, LogOut, Menu, MessageSquareText, Target, Wrench, X } from '../components/icons'

export const nav = [
  { to: '/app', label: 'Inicio', icon: LayoutDashboard, end: true },
  { to: '/app/ruta', label: 'Mi ruta', icon: Compass },
  { to: '/app/herramientas', label: 'Herramientas', icon: Wrench },
  { to: '/app/prompts', label: 'Laboratorio de prompts', icon: MessageSquareText },
  { to: '/app/plan', label: 'Mi plan', icon: Target },
  { to: '/app/recursos', label: 'Recursos', icon: Library },
]

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { done } = useProgress()
  const [profile] = useProfile()
  const pct = Math.round((done.length / allLessonIds.length) * 100)
  return (
    <div className="flex h-full flex-col">
      <Link to="/" className="px-3 py-2" onClick={onNavigate}>
        <Logo />
      </Link>
      <nav className="mt-8 flex-1 space-y-1">
        {nav.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              clsx(
                'group relative flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition',
                isActive ? 'text-white' : 'text-slate-400 hover:bg-white/[0.04] hover:text-white',
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-2xl border border-mint-400/25 bg-mint-400/10" />}
                <n.icon className={clsx('relative h-5 w-5', isActive ? 'text-mint-300' : '')} />
                <span className="relative">{n.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="card mt-6 p-4">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-mint-400 to-violet-500 font-extrabold text-ink-950">
            {(profile.name || 'Tú').slice(0, 1).toUpperCase()}
          </span>
          <div className="min-w-0">
            <div className="truncate text-sm font-bold text-white">{profile.name || 'Tu perfil'}</div>
            <div className="text-xs text-slate-400">{pct}% del programa</div>
          </div>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
          <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} className="h-full rounded-full bg-gradient-to-r from-mint-400 to-violet-500" />
        </div>
      </div>
      <Link to="/" onClick={onNavigate} className="mt-3 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-500 hover:text-white">
        <LogOut className="h-4 w-4" /> Volver al sitio
      </Link>
    </div>
  )
}

export default function AppLayout() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const current = [...nav].reverse().find((n) => (n.end ? pathname === n.to : pathname.startsWith(n.to)))
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[280px_1fr]">
      <aside className="no-print sticky top-0 hidden h-screen border-r border-white/[0.06] bg-ink-950/40 p-5 backdrop-blur-xl lg:block">
        <Sidebar />
      </aside>

      {/* Móvil */}
      <header className="no-print sticky top-0 z-40 flex items-center justify-between border-b border-white/[0.06] bg-ink-900/80 px-4 py-3 backdrop-blur-xl lg:hidden">
        <Logo />
        <button onClick={() => setOpen(true)} className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/10" aria-label="Abrir menú">
          <Menu className="h-5 w-5" />
        </button>
      </header>
      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden" />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="fixed inset-y-0 left-0 z-50 w-[290px] border-r border-white/10 bg-ink-900 p-5 lg:hidden"
            >
              <button onClick={() => setOpen(false)} className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full hover:bg-white/10" aria-label="Cerrar menú">
                <X className="h-5 w-5" />
              </button>
              <Sidebar onNavigate={() => setOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="min-w-0 px-4 py-8 sm:px-8 lg:px-12 lg:py-10">
        <div className="no-print mb-6 hidden items-center gap-2 text-sm text-slate-500 lg:flex">
          <BookOpen className="h-4 w-4" /> Nexora App <span>/</span> <span className="text-slate-300">{current?.label}</span>
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={pathname} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
