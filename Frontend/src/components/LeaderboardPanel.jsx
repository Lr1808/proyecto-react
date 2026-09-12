import { useEffect } from 'react'
import { BarChart3, Medal, Trophy, X } from 'lucide-react'
import { Bar, BarChart, Cell, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { demoLeaderboard } from '../lib/gamification'
import { playAppear, playClick } from '../lib/sound'

const medals = { 1: '#c86d51', 2: '#9db0a3', 3: '#8a6b45' }

export default function LeaderboardPanel({ stats, userName, onClose }) {
  const rows = demoLeaderboard(stats, userName)
  useEffect(() => { playAppear() }, [])

  return <div className="modal-backdrop" role="presentation" onClick={onClose}>
    <section className="panel-modal panel-wide" role="dialog" aria-modal="true" aria-labelledby="leaderboard-title" onClick={(event) => event.stopPropagation()}>
      <button className="modal-close" type="button" onClick={() => { playClick(); onClose() }} aria-label="Cerrar ranking"><X size={18} /></button>
      <header className="panel-head">
        <div><span className="eyebrow"><BarChart3 size={13} /> RANKING</span><h2 id="leaderboard-title">Clasificación del campus</h2><p>Se actualiza con cada entrega · el XP decide la posición</p></div>
      </header>
      <div className="lb-chart">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={rows} layout="vertical" margin={{ left: 8, right: 32 }}>
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="name" width={118} tick={{ fill: '#5e6e63', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Bar dataKey="xp" radius={[0, 7, 7, 0]} label={{ position: 'right', fill: '#5e6e63', fontSize: 11 }}>
              {rows.map((row) => <Cell key={row.name} fill={row.me ? '#c86d51' : '#1e3a2b'} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="lb-list">
        {rows.map((row) => <div className={`leaderboard-row ${row.me ? 'lb-me' : ''}`} key={row.name}>
          <span className="lb-rank">{row.rank <= 3 ? <Medal size={15} style={{ color: medals[row.rank] }} /> : row.rank}</span>
          <span className="avatar">{row.name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()}</span>
          <span className="lb-name"><b>{row.name}{row.me ? ' (tú)' : ''}</b><small>{row.level} · racha de {row.streak} días</small></span>
          <strong className="lb-xp">{row.xp} XP</strong>
          {row.rank === 1 && <Trophy size={16} className="lb-crown" />}
        </div>)}
      </div>
      <button className="primary-button full-button" type="button" onClick={() => { playClick(); onClose() }}>Volver al tablero</button>
    </section>
  </div>
}