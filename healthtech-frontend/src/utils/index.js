/* ══════════════════════════════════════
   utils/index.js — Helpers de formatação
══════════════════════════════════════ */

export const RISK_COLORS = {
  VERMELHO: 'var(--vermelho)',
  LARANJA:  'var(--laranja)',
  AMARELO:  'var(--amarelo)',
  VERDE:    'var(--verde)',
  AZUL:     'var(--azul)',
}

export const RISK_LABELS = {
  VERMELHO: 'Emergência',
  LARANJA:  'Muito Urgente',
  AMARELO:  'Urgente',
  VERDE:    'Pouco Urgente',
  AZUL:     'Não Urgente',
}

export const STATUS_LABELS = {
  AGUARDANDO_ATENDIMENTO: 'Aguardando',
  EM_ATENDIMENTO:         'Em Atendimento',
  ATENDIDO:               'Atendido',
  TRANSFERIDO:            'Transferido',
  ALTA:                   'Alta',
}

export const NIVEL_ORDER = ['VERMELHO', 'LARANJA', 'AMARELO', 'VERDE', 'AZUL']

export function formatDateTime(d) {
  if (!d) return '—'
  return new Date(d).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
}

export function formatDateOnly(d) {
  if (!d) return '—'
  if (typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d)) {
    const [y, m, dd] = d.split('-')
    return `${dd}/${m}/${y}`
  }
  return new Date(d).toLocaleDateString('pt-BR')
}

export function calcAge(dob) {
  if (!dob) return ''
  const b = new Date(dob)
  const n = new Date()
  let a = n.getFullYear() - b.getFullYear()
  if (n < new Date(n.getFullYear(), b.getMonth(), b.getDate())) a--
  return `${a} anos`
}

export function timeAgo(d) {
  if (!d) return ''
  const diff = (Date.now() - new Date(d)) / 1000
  if (diff < 60)    return 'agora'
  if (diff < 3600)  return `${Math.floor(diff / 60)}min atrás`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h atrás`
  return `${Math.floor(diff / 86400)}d atrás`
}

export function formatCpf(cpf) {
  return cpf?.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') ?? ''
}
