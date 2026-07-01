/* ══════════════════════════════════════
   pages/Triagens.jsx — Lista de triagens
══════════════════════════════════════ */
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { listarTriagens } from '../api'
import { Badge, StatusBadge, Spinner, Alert } from '../components/ui'
import { formatDateTime } from '../utils'
import styles from './Triagens.module.css'

export default function Triagens() {
  const [list, setList]     = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    listarTriagens()
      .then((r) => { setList(r.dados || []); setFiltered(r.dados || []) })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    setFiltered(
      list.filter(
        (t) =>
          (!search || t.pacienteNome.toLowerCase().includes(search.toLowerCase())) &&
          (!status || t.status === status)
      )
    )
  }, [search, status, list])

  if (loading) return <Spinner text="Carregando triagens..." />
  if (error)   return <Alert type="error">{error}</Alert>

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <div className={styles.title}>Triagens Realizadas</div>
          <div className={styles.subtitle}>{filtered.length} registros</div>
        </div>
        <div className={styles.filters}>
          <input
            className={styles.search}
            placeholder="Buscar paciente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className={styles.select}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">Todos os status</option>
            <option value="AGUARDANDO_ATENDIMENTO">Aguardando</option>
            <option value="EM_ATENDIMENTO">Em Atendimento</option>
            <option value="ATENDIDO">Atendido</option>
            <option value="ALTA">Alta</option>
          </select>
        </div>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Paciente</th>
              <th>Urgência (IA)</th>
              <th>Status</th>
              <th>Temperatura</th>
              <th>Sintomas</th>
              <th>Data/Hora</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className={styles.empty}>Nenhuma triagem encontrada</td></tr>
            ) : filtered.map((t) => (
              <tr key={t.id} className={styles.row} onClick={() => navigate('/triagens/' + t.id)}>
                <td><strong>{t.pacienteNome}</strong></td>
                <td><Badge nivel={t.nivelDeRisco} /></td>
                <td><StatusBadge status={t.status} /></td>
                <td className={styles.mono}>{t.temperatura}°C</td>
                <td className={styles.ellipsis}>{t.sintomas}</td>
                <td className={styles.date}>{formatDateTime(t.criadoEm)}</td>
                <td>
                  <button className={styles.btnView} onClick={(e) => { e.stopPropagation(); navigate('/triagens/' + t.id) }}>
                    Ver
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
