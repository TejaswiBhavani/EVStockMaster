import React from 'react'
import { format } from 'date-fns'

const sample = [
  { id: 'p1', date: new Date().toISOString(), region: 'US', title: 'EPA emissions phase-in', impact: 'OEMs/Charging' },
  { id: 'p2', date: new Date(Date.now() + 86400000 * 7).toISOString(), region: 'EU', title: 'Battery subsidy window', impact: 'Batteries/OEMs' },
  { id: 'p3', date: new Date(Date.now() + 86400000 * 21).toISOString(), region: 'CN', title: 'Export tariff review', impact: 'China EVs' },
]

export default function PolicyCalendar() {
  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-semibold heading-gradient">Policy & Regulatory Calendar</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {sample.map(ev => (
          <div key={ev.id} className="rounded-xl border border-gray-200 bg-white/70 dark:bg-dark-700/60 p-4 shadow-sm backdrop-blur-sm">
            <div className="text-sm text-gray-500">{ev.region} • {format(new Date(ev.date), 'PP')}</div>
            <div className="mt-1 font-medium">{ev.title}</div>
            <div className="mt-1 text-sm text-gray-600">Likely impact: {ev.impact}</div>
          </div>
        ))}
      </div>
    </div>
  )
}