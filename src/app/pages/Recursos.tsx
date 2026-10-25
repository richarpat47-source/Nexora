import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import clsx from 'clsx'
import { usePersisted } from '../../lib/storage'
import { AlertTriangle, BookOpen, Bot, Check, Library, ShieldCheck } from '../../components/icons'

const glossary = [
  { t: 'Prompt', d: 'La instrucción o mensaje que le escribes a una IA.' },
  { t: 'Alucinación', d: 'Cuando la IA inventa un dato con seguridad. Por eso verificamos lo importante.' },
  { t: 'Ingreso neto', d: 'Lo que realmente recibes después de impuestos y descuentos.' },
  { t: 'Fondo de emergencia', d: 'Ahorro reservado solo para imprevistos, de 3 a 6 meses de gastos.' },
  { t: 'Tasa de interés anual', d: 'El costo (o ganancia) de tu dinero en un año, expresado en porcentaje.' },
  { t: 'Interés compuesto', d: 'Ganar intereses sobre los intereses que ya ganaste.' },
  { t: 'Inflación', d: 'La subida general de precios que hace que tu dinero compre menos con el tiempo.' },
  { t: 'Fondo indexado', d: 'Inversión que replica un índice del mercado, normalmente con comisiones bajas.' },
  { t: 'Liquidez', d: 'Qué tan rápido puedes convertir algo en efectivo sin perder valor.' },
  { t: 'Phishing', d: 'Engaño para robarte datos haciéndose pasar por una empresa o persona de confianza.' },
]

const checklist = [
  'Nunca comparto contraseñas, PIN ni códigos de verificación con una IA',
  'Uso cifras aproximadas, no números de cuenta ni de tarjeta',
  'Verifico datos importantes en fuentes oficiales',
  'Le pido a la IA que revise y cuestione su propia respuesta',
  'Desconfío de ofertas con ganancias garantizadas o urgencia',
  'Confirmo por otro canal cualquier pedido de dinero “urgente”',
]

const assistants = [
  { n: 'ChatGPT', d: 'El más conocido. Versión gratuita disponible.', e: '💬' },
  { n: 'Claude', d: 'Explicaciones claras y cuidadosas, ideal para principiantes.', e: '🧡' },
  { n: 'Gemini', d: 'Integrado con Google y Android.', e: '✨' },
  { n: 'Copilot', d: 'Integrado con Windows y Microsoft 365.', e: '🪟' },
]

const flags = [
  { t: 'Rendimientos garantizados', d: 'Ninguna inversión legítima promete ganancias fijas y altas.' },
  { t: 'Urgencia extrema', d: '“Solo hoy”, “últimos cupos”: buscan que no pienses.' },
  { t: 'Te piden códigos', d: 'Tu banco nunca te pedirá un código que te llegó por SMS.' },
  { t: 'Voz o video de un conocido', d: 'La IA puede clonar voces. Verifica llamando tú al número de siempre.' },
]

export default function Recursos() {
  const [checked, setChecked] = usePersisted<number[]>('checklist', [])
  const [flip, setFlip] = useState<number | null>(null)
  return (
    <div className="space-y-10">
      <div>
        <h1 className="flex items-center gap-3 text-3xl font-extrabold text-white sm:text-4xl">
          <Library className="h-8 w-8 text-mint-300" /> Recursos
        </h1>
        <p className="mt-2 text-slate-400">Tu caja de herramientas para usar IA con confianza y proteger tu dinero.</p>
      </div>

      <section className="card p-6 sm:p-8">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-xl font-extrabold text-white">
            <ShieldCheck className="h-5 w-5 text-mint-300" /> Checklist de seguridad
          </h2>
          <span className="text-sm font-bold text-mint-300">
            {checked.length}/{checklist.length}
          </span>
        </div>
        <div className="space-y-2">
          {checklist.map((c, i) => {
            const on = checked.includes(i)
            return (
              <button
                key={c}
                onClick={() => setChecked((x) => (on ? x.filter((y) => y !== i) : [...x, i]))}
                className={clsx('flex w-full items-center gap-4 rounded-2xl border px-4 py-3.5 text-left transition', on ? 'border-mint-400/40 bg-mint-400/10' : 'border-white/[0.07] bg-white/[0.02] hover:border-white/20')}
              >
                <span className={clsx('grid h-6 w-6 shrink-0 place-items-center rounded-lg border transition', on ? 'border-mint-400 bg-mint-400 text-ink-950' : 'border-white/20')}>{on && <Check className="h-4 w-4" />}</span>
                <span className={clsx('text-sm', on ? 'text-white' : 'text-slate-300')}>{c}</span>
              </button>
            )
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-4 flex items-center gap-2 text-xl font-extrabold text-white">
          <AlertTriangle className="h-5 w-5 text-rose-300" /> Señales de estafa <span className="text-sm font-normal text-slate-500">(toca cada tarjeta)</span>
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {flags.map((f, i) => (
            <button key={f.t} onClick={() => setFlip(flip === i ? null : i)} className="card relative h-40 overflow-hidden p-5 text-left transition hover:border-rose-400/30">
              <AnimatePresence mode="wait" initial={false}>
                {flip === i ? (
                  <motion.p key="b" initial={{ opacity: 0, rotateY: -90 }} animate={{ opacity: 1, rotateY: 0 }} exit={{ opacity: 0, rotateY: 90 }} className="text-sm leading-relaxed text-slate-200">
                    {f.d}
                  </motion.p>
                ) : (
                  <motion.div key="f" initial={{ opacity: 0, rotateY: 90 }} animate={{ opacity: 1, rotateY: 0 }} exit={{ opacity: 0, rotateY: -90 }}>
                    <span className="text-3xl">🚩</span>
                    <div className="mt-3 font-extrabold text-white">{f.t}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 flex items-center gap-2 text-xl font-extrabold text-white">
          <Bot className="h-5 w-5 text-violet-400" /> Asistentes de IA recomendados
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {assistants.map((a) => (
            <div key={a.n} className="card p-5 transition hover:-translate-y-1 hover:border-violet-400/30">
              <span className="text-3xl">{a.e}</span>
              <div className="mt-3 font-extrabold text-white">{a.n}</div>
              <p className="mt-1 text-sm text-slate-400">{a.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="card p-6 sm:p-8">
        <h2 className="mb-5 flex items-center gap-2 text-xl font-extrabold text-white">
          <BookOpen className="h-5 w-5 text-gold-400" /> Glosario sin jerga
        </h2>
        <dl className="grid gap-x-8 gap-y-4 md:grid-cols-2">
          {glossary.map((g) => (
            <div key={g.t} className="border-b border-white/5 pb-4">
              <dt className="font-bold text-white">{g.t}</dt>
              <dd className="mt-1 text-sm text-slate-400">{g.d}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  )
}
