/* ══════════════════════════════════════
   components/ui.jsx — Componentes visuais reutilizáveis
   Badge, StatusBadge, Spinner, Alert, Modal, Button, Card
══════════════════════════════════════ */
import { RISK_COLORS, RISK_LABELS, STATUS_LABELS } from '../utils'
import styles from './ui.module.css'

// ── Badge de urgência Manchester ─────────────────────
export function Badge({ nivel }) {
  return (
    <span className={`${styles.badge} ${styles['badge_' + nivel]}`}>
      <span className={`${styles.dot} ${styles['dot_' + nivel]}`} />
      {nivel}
    </span>
  )
}

// ── Badge de status da triagem ───────────────────────
export function StatusBadge({ status }) {
  const labels = STATUS_LABELS
  return (
    <span className={`${styles.statusBadge} ${styles['status_' + status]}`}>
      {labels[status] || status}
    </span>
  )
}

// ── Spinner de loading ───────────────────────────────
export function Spinner({ text = '' }) {
  return (
    <div className={styles.pageLoader}>
      <div className={styles.spinner} />
      {text && <span>{text}</span>}
    </div>
  )
}

// ── Alert ────────────────────────────────────────────
export function Alert({ type = 'info', children }) {
  return (
    <div className={`${styles.alert} ${styles['alert_' + type]}`}>
      {children}
    </div>
  )
}

// ── Card ─────────────────────────────────────────────
export function Card({ children, className = '', style }) {
  return (
    <div className={`${styles.card} ${className}`} style={style}>
      {children}
    </div>
  )
}

// ── Modal ────────────────────────────────────────────
export function Modal({ title, subtitle, onClose, children, size = 'md' }) {
  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`${styles.modal} ${size === 'lg' ? styles.modalLg : ''}`}>
        <div className={styles.modalHeader}>
          <div>
            <div className={styles.modalTitle}>{title}</div>
            {subtitle && <div className={styles.modalSubtitle}>{subtitle}</div>}
          </div>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>
        <div className={styles.modalBody}>{children}</div>
      </div>
    </div>
  )
}

// ── Vitals Grid ──────────────────────────────────────
export function VitalsGrid({ triagem }) {
  const vitals = [
    { icon: '🌡️', value: triagem.temperatura ?? '—', unit: '°C',   label: 'Temperatura' },
    { icon: '💓', value: triagem.freqCardiaca ?? '—',  unit: 'bpm',  label: 'Freq. Cardíaca' },
    { icon: '🫁', value: triagem.saturacaoO2 ?? '—',   unit: '%',    label: 'SpO₂' },
    { icon: '🩺', value: triagem.pressaoSistolica ? `${triagem.pressaoSistolica}/${triagem.pressaoDiastolica}` : '—', unit: 'mmHg', label: 'Pressão Arterial' },
    { icon: '💨', value: triagem.freqRespiratoria ?? '—', unit: 'irpm', label: 'Freq. Respiratória' },
    { icon: '😣', value: triagem.escalaDor ?? '—',     unit: '/10',  label: 'Escala de Dor' },
  ]

  return (
    <div className={styles.vitalsGrid}>
      {vitals.map((v) => (
        <div key={v.label} className={styles.vitalCard}>
          <div className={styles.vitalIcon}>{v.icon}</div>
          <div className={styles.vitalValue}>{v.value}</div>
          <div className={styles.vitalUnit}>{v.unit}</div>
          <div className={styles.vitalLabel}>{v.label}</div>
        </div>
      ))}
    </div>
  )
}

// ── AI Result Block ──────────────────────────────────
export function AiResult({ justificativa, recomendacoes }) {
  if (!justificativa) return null
  return (
    <div className={styles.aiResult}>
      <div className={styles.aiHeader}>
        <span className={styles.aiChip}>✦ Gemini AI</span>
        <span className={styles.aiSubtitle}>Análise automática — Protocolo de Manchester</span>
      </div>
      <div className={styles.aiSection}>
        <div className={styles.aiSectionTitle}>Justificativa Clínica</div>
        <div className={styles.aiSectionText}>{justificativa}</div>
      </div>
      {recomendacoes && (
        <div className={styles.aiSection}>
          <div className={styles.aiSectionTitle}>Recomendações para a Equipe</div>
          <div className={styles.aiSectionText}>{recomendacoes}</div>
        </div>
      )}
    </div>
  )
}
