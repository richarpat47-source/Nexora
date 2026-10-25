import { useMemo, useState } from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { compoundGrowth, fmt } from '../lib/finance'
import { Slider, Stat } from './ui'

const money = (v: number) => fmt(v)

export default function CompoundTool() {
  const [initial, setInitial] = useState(500)
  const [monthly, setMonthly] = useState(100)
  const [rate, setRate] = useState(7)
  const [years, setYears] = useState(15)
  const data = useMemo(() => compoundGrowth(initial, monthly, rate, years), [initial, monthly, rate, years])
  const last = data[data.length - 1]
  const gains = last.balance - last.contributed
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
      <div className="space-y-5">
        <Slider label="Monto inicial" value={initial} min={0} max={20000} step={100} format={money} onChange={setInitial} />
        <Slider label="Aporte mensual" value={monthly} min={0} max={2000} step={10} format={money} onChange={setMonthly} />
        <Slider label="Rendimiento anual estimado" value={rate} min={0} max={15} step={0.5} format={(v) => `${v}%`} onChange={setRate} />
        <Slider label="Años" value={years} min={1} max={40} format={(v) => `${v} años`} onChange={setYears} />
      </div>
      <div>
        <div className="mb-4 grid grid-cols-3 gap-3">
          <Stat label="Total" value={fmt(last.balance)} tone="mint" />
          <Stat label="Aportaste" value={fmt(last.contributed)} />
          <Stat label="Ganancia" value={fmt(gains)} tone="violet" />
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer>
            <AreaChart data={data} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
              <defs>
                <linearGradient id="gBal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#34d399" stopOpacity={0.5} />
                  <stop offset="1" stopColor="#34d399" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gCon" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#8b5cf6" stopOpacity={0.45} />
                  <stop offset="1" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgb(255 255 255 / .05)" vertical={false} />
              <XAxis dataKey="year" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}a`} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} width={56} tickFormatter={(v) => (v >= 1000 ? `${Math.round(v / 1000)}k` : `${v}`)} />
              <Tooltip
                contentStyle={{ background: '#0d1424', border: '1px solid rgb(255 255 255 / .1)', borderRadius: 14, color: '#fff' }}
                formatter={(v, n) => [fmt(Number(v)), n === 'balance' ? 'Total' : 'Aportado']}
                labelFormatter={(l) => `Año ${l}`}
              />
              <Area type="monotone" dataKey="contributed" stroke="#a78bfa" strokeWidth={2} fill="url(#gCon)" />
              <Area type="monotone" dataKey="balance" stroke="#34d399" strokeWidth={2.5} fill="url(#gBal)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-3 text-xs text-slate-500">Simulación educativa con capitalización mensual. Los rendimientos reales varían y no están garantizados.</p>
      </div>
    </div>
  )
}

