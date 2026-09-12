import { useEffect, useState } from 'react'
import { Award, CheckCircle2, Download, Lock, X } from 'lucide-react'
import { levelFor, loadStats, saveStats, unlockCertificates } from '../lib/gamification'
import { playClick } from '../lib/sound'

const categoryLabels = { python: 'Python', database: 'Base de datos', react: 'React', git: 'Git', terminal: 'Terminal' }
const categoryColors = { python: '#3e8e5c', database: '#c86d51', react: '#1e3a2b', git: '#b4553c', terminal: '#b4903c' }
const today = () => new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })

export default function CertificateModal({ catalog, solvedMap, userName, onClose }) {
  const domains = unlockCertificates(catalog, solvedMap)
  const [viewing, setViewing] = useState(null)

  useEffect(() => {
    const earned = domains.filter((domain) => domain.passed === domain.total && domain.total > 0).map((domain) => domain.category)
    const current = loadStats()
    const missing = earned.filter((category) => !(current.certificates || []).some((item) => item.category === category))
    if (!missing.length) return
    const next = { ...current, certificates: [...(current.certificates || []), ...missing.map((category) => ({ category, date: today(), diploma: `Completaste ${categoryLabels[category] || category}` }))] }
    saveStats(next)
  }, [domains])

  const earnedCount = domains.filter((domain) => domain.total > 0 && domain.passed === domain.total).length

  if (viewing) {
    const fresh = loadStats()
    const certificate = fresh.certificates?.find((item) => item.category === viewing)
    return <div className="modal-backdrop"><section className="certificate-modal" role="dialog" aria-modal="true"><header><div><span className="eyebrow">LOGRO COMPLETO</span><h2>Certificado de dominio</h2></div><button className="icon-button" type="button" onClick={() => { playClick(); setViewing(null) }} aria-label="Volver a certificados"><X size={18} /></button></header><div className="certificate-page print-target"><div className="cert-badge"><Award size={44} /></div><small className="cert-org">EduEval · Campus de práctica</small><h1>Certificado de logro</h1><p className="cert-body">Otorgado a</p><strong className="cert-name">{userName}</strong><p className="cert-body">por completar el dominio</p><strong className="cert-domain" style={{ color: categoryColors[viewing] }}>{categoryLabels[viewing] || viewing}</strong><p className="cert-body">{certificate?.diploma || `Dominaste la ruta de ${categoryLabels[viewing] || viewing}`}.</p><div className="cert-meta"><span><small>Nivel</small><b>{levelFor(fresh.xp).label}</b></span><span><small>Fecha</small><b>{certificate?.date || today()}</b></span><span><small>XP total</small><b>{fresh.xp} XP</b></span></div><div className="cert-sign"><span className="cert-line" /><small>El equipo EduEval</small></div></div><footer className="certificate-actions"><button className="ghost-button" type="button" onClick={() => { playClick(); setViewing(null) }}>Volver</button><button className="primary-button" type="button" onClick={() => { playClick(); window.print() }}><Download size={15} /> Descargar certificado</button></footer></section></div>
  }

  return <div className="modal-backdrop"><section className="certificate-modal" role="dialog" aria-modal="true"><header><div><span className="eyebrow">TU HISTORIAL</span><h2>Certificados de dominio</h2></div><button className="icon-button" type="button" onClick={() => { playClick(); onClose() }} aria-label="Cerrar certificados"><X size={18} /></button></header><p className="certificate-intro">Completa <b>todos los ejercicios</b> de una categoría para desbloquear tu certificado. Los dominios aprobados aparecen aquí y puedes descargarlos cuando quieras.</p>{earnedCount === 0 && <div className="certificate-empty"><Lock size={22} /><p>Todavía no tienes certificados. Avanza por una ruta completa para ganar tu primera certificación.</p></div>}<div className="certificate-list">{domains.filter((domain) => domain.total > 0).map((domain) => { const earned = domain.passed === domain.total; return <article className="cert-card" key={domain.category}><span className="cert-card-icon" style={{ background: `${categoryColors[domain.category] || '#6366f1'}22`, color: categoryColors[domain.category] || '#6366f1' }}>{earned ? <Award size={20} /> : <Lock size={19} />}</span><div className="cert-card-main"><strong>{categoryLabels[domain.category] || domain.category}</strong><div className="cert-progress"><span style={{ width: `${domain.total ? Math.round((domain.passed / domain.total) * 100) : 0}%` }} /></div><small>{domain.passed} / {domain.total} dominados{earned && <em><CheckCircle2 size={13} /> Listo para descargar</em>}</small></div>{earned && <button className="gami-button" type="button" onClick={() => { playClick(); setViewing(domain.category) }}><Download size={13} /> Ver</button>}</article> })}</div><footer className="certificate-actions"><button className="ghost-button" type="button" onClick={() => { playClick(); onClose() }}>Cerrar</button></footer></section></div>
}