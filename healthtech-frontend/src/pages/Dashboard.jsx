/* ══════════════════════════════════════
   pages/Dashboard.jsx
══════════════════════════════════════ */
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDashboard, listarFila } from '../api'
import { Badge, Spinner, Alert } from '../components/ui'
import { NIVEL_ORDER, RISK_COLORS, RISK_LABELS, timeAgo } from '../utils'
import styles from './Dashboard.module.css'

export default function Dashboard() {
  const [dash, setDash] = useState(null)
  const [fila, setFila] = useState([])
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    async function load() {
      try {
        const [d, f] = await Promise.all([getDashboard(), listarFila()])
        setDash(d.dados)
        setFila(f.dados || [])
      } catch (err) {
        setError(err.message)
      }
    }
    load()
  }, [])

  if (error) return <Alert type="error">{error}</Alert>
  if (!dash)  return <Spinner text="Carregando dashboard..." />

  const dist = dash.distribuicaoNivelRisco || {}
  const maxDist = Math.max(...Object.values(dist), 1)

  const stats = [
    { label: 'Total Triagens',  value: dash.totalTriagens,        color: 'var(--accent)'  },
    { label: 'Aguardando',      value: dash.aguardandoAtendimento, color: 'var(--amarelo)' },
    { label: 'Em Atendimento',  value: dash.emAtendimento,         color: 'var(--accent)'  },
    { label: 'Pacientes',       value: dash.pacientesCadastrados,  color: 'var(--verde)'   },
  ]

  return (
    <div>
      {/* Stats */}
      <div className={styles.statsGrid}>
        {stats.map((s) => (
          <div key={s.label} className={styles.statCard}>
            <div className={styles.statLabel}>{s.label}</div>
            <div className={styles.statValue} style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className={styles.twoCol}>
        {/* Distribuição */}
        <div className={styles.card}>
          <div className={styles.cardTitle}>Distribuição por Urgência</div>
          <div className={styles.cardSubtitle}>Classificação Manchester — total histórico</div>
          <div className={styles.bars}>
            {NIVEL_ORDER.map((n) => {
              const count = dist[RISK_LABELS[n]] || 0
              const pct   = Math.round((count / maxDist) * 100)
              return (
                <div key={n} className={styles.barRow}>
                  <div className={styles.barLabel} style={{ color: RISK_COLORS[n] }}>{n}</div>
                  <div className={styles.barBg}>
                    <div className={styles.barFill} style={{ width: pct + '%', background: RISK_COLORS[n] }} />
                  </div>
                  <div className={styles.barCount}>{count}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Fila preview */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <div className={styles.cardTitle}>Fila de Urgência</div>
              <div className={styles.cardSubtitle}>Próximos a serem chamados</div>
            </div>
            <button className={styles.btnSm} onClick={() => navigate('/fila')}>Ver tudo</button>
          </div>
          {fila.length === 0 ? (
            <div className={styles.empty}>Nenhum paciente aguardando</div>
          ) : (
            fila.slice(0, 4).map((t, i) => (
              <div key={t.id} className={styles.queueItem} onClick={() => navigate('/triagens/' + t.id)}>
                <div className={styles.rank}>{i + 1}</div>
                <div className={styles.queueInfo}>
                  <div className={styles.queueName}>{t.pacienteNome}</div>
                  <div className={styles.queueSymptoms}>{t.sintomas.slice(0, 55)}...</div>
                </div>
                <div className={styles.queueMeta}>
                  <Badge nivel={t.nivelDeRisco} />
                  <div className={styles.queueTime}>{timeAgo(t.criadoEm)}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
