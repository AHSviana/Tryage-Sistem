/* ══════════════════════════════════════
   pages/Fila.jsx — Fila de atendimento
══════════════════════════════════════ */
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { listarFila, atualizarStatus } from '../api'
import { Badge, Spinner, Alert } from '../components/ui'
import { RISK_COLORS, timeAgo } from '../utils'
import styles from './Fila.module.css'

export default function Fila() {
  const [fila, setFila] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState('')
  const navigate = useNavigate()

  async function load() {
    try {
      setLoading(true)
      const res = await listarFila()
      setFila(res.dados || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function chamar(id) {
    try {
      await atualizarStatus(id, 'EM_ATENDIMENTO')
      load()
    } catch (err) {
      alert(err.message)
    }
  }

  if (loading) return <Spinner text="Carregando fila..." />
  if (error)   return <Alert type="error">{error}</Alert>

  return (
    <div>
      <Alert type="info">
        ✦ <strong>IA classificou automaticamente.</strong> Ordem por urgência (Manchester) + tempo de chegada.
      </Alert>

      {fila.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>✓</div>
          <h3>Fila vazia</h3>
          <p>Nenhum paciente aguardando atendimento no momento.</p>
        </div>
      ) : (
        fila.map((t, i) => (
          <div key={t.id} className={styles.item} onClick={() => navigate('/triagens/' + t.id)}>
            <div className={styles.rank} style={{ background: RISK_COLORS[t.nivelDeRisco] }}>
              {i + 1}
            </div>
            <div className={styles.info}>
              <div className={styles.name}>{t.pacienteNome}</div>
              <div className={styles.symptoms}>{t.sintomas.slice(0, 90)}{t.sintomas.length > 90 ? '...' : ''}</div>
              <div className={styles.meta}>
                <Badge nivel={t.nivelDeRisco} />
                <span className={styles.metaText}>
                  Máx. {t.tempoMaxAtendimento === 0 ? 'Imediato' : t.tempoMaxAtendimento + ' min'}
                </span>
                <span className={styles.metaText}>• {timeAgo(t.criadoEm)}</span>
              </div>
            </div>
            <div className={styles.actions}>
              <button
                className={styles.btnCall}
                onClick={(e) => { e.stopPropagation(); chamar(t.id) }}
              >
                Chamar
              </button>
              <button
                className={styles.btnView}
                onClick={(e) => { e.stopPropagation(); navigate('/triagens/' + t.id) }}
              >
                Ver
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
