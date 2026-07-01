/* ══════════════════════════════════════
   pages/TriagemDetalhe.jsx
══════════════════════════════════════ */
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { buscarTriagem, atualizarStatus } from '../api'
import { Badge, StatusBadge, Spinner, Alert, VitalsGrid, AiResult } from '../components/ui'
import { RISK_COLORS, STATUS_LABELS, formatDateTime } from '../utils'
import styles from './TriagemDetalhe.module.css'

export default function TriagemDetalhe() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [triagem, setTriagem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState('')
  const [novoStatus, setNovoStatus] = useState('')

  async function load() {
    try {
      setLoading(true)
      const res = await buscarTriagem(id)
      setTriagem(res.dados)
      setNovoStatus(res.dados.status)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [id])

  async function salvarStatus() {
    setSaving(true)
    try {
      await atualizarStatus(id, novoStatus)
      await load()
    } catch (err) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Spinner text="Carregando triagem..." />
  if (error)   return <Alert type="error">{error}</Alert>
  if (!triagem) return null

  return (
    <div className={styles.page}>
      <button className={styles.back} onClick={() => navigate(-1)}>← Voltar</button>

      {/* Header */}
      <div className={styles.header}>
        <div>
          <div className={styles.nivel} style={{ color: RISK_COLORS[triagem.nivelDeRisco] }}>
            {triagem.nivelDeRisco} — {triagem.nivelNome}
          </div>
          <div className={styles.nivelDesc}>{triagem.nivelDescricao}</div>
          <div className={styles.meta}>
            <StatusBadge status={triagem.status} />
            <span className={styles.metaDate}>{formatDateTime(triagem.criadoEm)}</span>
          </div>
        </div>

        {/* Status changer */}
        <div className={styles.statusBox}>
          <div className={styles.statusLabel}>Alterar Status</div>
          <select
            className={styles.select}
            value={novoStatus}
            onChange={(e) => setNovoStatus(e.target.value)}
          >
            <option value="AGUARDANDO_ATENDIMENTO">Aguardando</option>
            <option value="EM_ATENDIMENTO">Em Atendimento</option>
            <option value="ATENDIDO">Atendido</option>
            <option value="ALTA">Alta</option>
          </select>
          <button className={styles.btnSave} onClick={salvarStatus} disabled={saving}>
            {saving ? 'Salvando...' : 'Atualizar'}
          </button>
        </div>
      </div>

      <hr className={styles.divider} />

      {/* Info básica */}
      <div className={styles.grid2}>
        <div>
          <div className={styles.fieldLabel}>Paciente</div>
          <div className={styles.fieldValue}>{triagem.pacienteNome}</div>
        </div>
        <div>
          <div className={styles.fieldLabel}>Triado por</div>
          <div className={styles.fieldValue}>{triagem.triadoPorNome || '—'}</div>
        </div>
      </div>

      <div className={styles.symptomsBlock}>
        <div className={styles.fieldLabel}>Sintomas</div>
        <div className={styles.symptomsText}>{triagem.sintomas}</div>
      </div>

      {/* Sinais vitais */}
      <VitalsGrid triagem={triagem} />

      {/* IA */}
      <AiResult justificativa={triagem.justificativaIa} recomendacoes={triagem.recomendacoesIa} />
    </div>
  )
}
