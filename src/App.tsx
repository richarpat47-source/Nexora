import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, MemoryRouter, Navigate, Route, Routes, useLocation } from 'react-router'
import { isArtifact } from './lib/env'
import Landing from './landing/Landing'

const AppLayout = lazy(() => import('./app/AppLayout'))
const Dashboard = lazy(() => import('./app/pages/Dashboard'))
const Ruta = lazy(() => import('./app/pages/Ruta'))
const Leccion = lazy(() => import('./app/pages/Leccion'))
const Herramientas = lazy(() => import('./app/pages/Herramientas'))
const Prompts = lazy(() => import('./app/pages/Prompts'))
const MiPlan = lazy(() => import('./app/pages/MiPlan'))
const Recursos = lazy(() => import('./app/pages/Recursos'))

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    if (!window.location.hash) window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function Loader() {
  return (
    <div className="grid min-h-screen place-items-center">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-mint-400" />
    </div>
  )
}

// El visor de Artifacts no expone la URL, así que ahí las rutas viven en memoria.
const Router = isArtifact ? MemoryRouter : BrowserRouter

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="ruta" element={<Ruta />} />
            <Route path="ruta/:moduleId/:lessonId" element={<Leccion />} />
            <Route path="herramientas" element={<Herramientas />} />
            <Route path="herramientas/:toolId" element={<Herramientas />} />
            <Route path="prompts" element={<Prompts />} />
            <Route path="plan" element={<MiPlan />} />
            <Route path="recursos" element={<Recursos />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  )
}
