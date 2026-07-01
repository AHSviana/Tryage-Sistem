/* ══════════════════════════════════════
   pages/Pacientes.jsx
══════════════════════════════════════ */
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { listarPacientes, criarPaciente, listarTriagensPorPaciente } from '../api'
import { Spinner, Alert, Modal, Badge, StatusBadge } from '../components/ui'
import { formatDateOnly, formatDateTime, calcAge, formatCpf } from '../utils'
import styles from './Pacientes.module.css'

export default function Pacientes() {
  const [list, setList]         = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch]     = useState('')
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const [showModal, setShowModal]     = useState(false)
  const [historico, setHistorico]     = useState(null)
  const [historicoPac, setHistoricoPac] = useState(null)
  const navigate = useNavigate()

  // Campos do form
  const [form, setForm] = useState({ nome:'', cpf:'', dataNascimento:'', sexo:'', telefone:'', alergias:'', medicamentosEmUso:'', historicoMedico:'' })
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)

  async function load() {
    try {
      const res = await listarPacientes()
      setList(res.dados || [])
      setFiltered(res.dados || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])
  useEffect(() => {
    setFiltered(list.filter(p =>
      !search || p.nome.toLowerCase().includes(search.toLowerCase()) || p.cpf.includes(search)
    ))
  }, [search, list])

  function handleForm(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function salvar(e) {
    e.preventDefault()
    if (!form.nome || !form.cpf || !form.dataNascimento) {
      setFormError('Nome, CPF e data de nascimento são obrigatórios.')
      return
    }
    setSaving(true)
    try {
      await criarPaciente({ ...form, sexo: form.sexo || null, telefone: form.telefone || null, alergias: form.alergias || null, medicamentosEmUso: form.medicamentosEmUso || null, historicoMedico: form.historicoMedico || null })
      setShowModal(false)
      setForm({ nome:'', cpf:'', dataNascimento:'', sexo:'', telefone:'', alergias:'', medicamentosEmUso:'', historicoMedico:'' })
      load()
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function verHistorico(pac) {
    setHistoricoPac(pac)
    setHistorico(null)
    try {
      const res = await listarTriagensPorPaciente(pac.id)
      setHistorico(res.dados || [])
    } catch (err) {
      setHistorico([])
    }
  }

  if (loading) return <Spinner text="Carregando pacientes..." />
  if (error)   return <Alert type="error">{error}</Alert>

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <div className={styles.title}>Pacientes Cadastrados</div>
          <div className={styles.subtitle}>{filtered.length} pacientes</div>
        </div>
        <div className={styles.actions}>
          <input className={styles.search} placeholder="Buscar por nome ou CPF..." value={search} onChange={e => setSearch(e.target.value)} />
          <button className={styles.btnAdd} onClick={() => setShowModal(true)}>+ Novo Paciente</button>
        </div>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead><tr><th>Nome</th><th>CPF</th><th>Nascimento</th><th>Telefone</th><th>Sexo</th><th /></tr></thead>
          <tbody>
            {filtered.length === 0
              ? <tr><td colSpan={6} className={styles.empty}>Nenhum paciente encontrado</td></tr>
              : filtered.map(p => (
                <tr key={p.id}>
                  <td><strong>{p.nome}</strong></td>
                  <td className={styles.mono}>{formatCpf(p.cpf)}</td>
                  <td>{formatDateOnly(p.dataNascimento)} <span className={styles.age}>({calcAge(p.dataNascimento)})</span></td>
                  <td>{p.telefone || '—'}</td>
                  <td>{p.sexo === 'M' ? 'Masculino' : p.sexo === 'F' ? 'Feminino' : '—'}</td>
                  <td className={styles.rowActions}>
                    <button className={styles.btnSm} onClick={() => verHistorico(p)}>Histórico</button>
                    <button className={styles.btnPrimary} onClick={() => navigate('/triagem?pacienteId=' + p.id)}>Triar</button>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>

      {/* Modal cadastro */}
      {showModal && (
        <Modal title="Novo Paciente" onClose={() => setShowModal(false)}>
          {formError && <Alert type="error">{formError}</Alert>}
          <form onSubmit={salvar} className={styles.form}>
            <div className={styles.row2}>
              <div className={styles.field}><label>Nome *</label><input name="nome" value={form.nome} onChange={handleForm} placeholder="João Silva" /></div>
              <div className={styles.field}><label>CPF * (só números)</label><input name="cpf" value={form.cpf} onChange={handleForm} placeholder="12345678901" maxLength={11} /></div>
            </div>
            <div className={styles.row2}>
              <div className={styles.field}><label>Data de Nascimento *</label><input type="date" name="dataNascimento" value={form.dataNascimento} onChange={handleForm} /></div>
              <div className={styles.field}><label>Sexo</label>
                <select name="sexo" value={form.sexo} onChange={handleForm}>
                  <option value="">Selecione</option>
                  <option value="M">Masculino</option>
                  <option value="F">Feminino</option>
                </select>
              </div>
            </div>
            <div className={styles.field}><label>Telefone</label><input name="telefone" value={form.telefone} onChange={handleForm} placeholder="(86) 99999-9999" /></div>
            <div className={styles.field}><label>Alergias</label><textarea name="alergias" value={form.alergias} onChange={handleForm} placeholder="Ex: Dipirona..." /></div>
            <div className={styles.field}><label>Medicamentos em Uso</label><textarea name="medicamentosEmUso" value={form.medicamentosEmUso} onChange={handleForm} placeholder="Ex: Metformina..." /></div>
            <div className={styles.field}><label>Histórico Médico</label><textarea name="historicoMedico" value={form.historicoMedico} onChange={handleForm} placeholder="Ex: Diabetes Tipo 2..." /></div>
            <div className={styles.modalFooter}>
              <button type="button" className={styles.btnCancel} onClick={() => setShowModal(false)}>Cancelar</button>
              <button type="submit" className={styles.btnSave} disabled={saving}>{saving ? 'Salvando...' : 'Salvar Paciente'}</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal histórico */}
      {historicoPac && (
        <Modal title="Histórico de Triagens" subtitle={historicoPac.nome} size="lg" onClose={() => setHistoricoPac(null)}>
          {!historico
            ? <Spinner />
            : historico.length === 0
              ? <div className={styles.empty}>Sem triagens registradas.</div>
              : <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead><tr><th>Data</th><th>Urgência</th><th>Temp.</th><th>Status</th><th>Sintomas</th></tr></thead>
                    <tbody>
                      {historico.map(t => (
                        <tr key={t.id} className={styles.clickRow} onClick={() => { setHistoricoPac(null); navigate('/triagens/' + t.id) }}>
                          <td className={styles.date}>{formatDateTime(t.criadoEm)}</td>
                          <td><Badge nivel={t.nivelDeRisco} /></td>
                          <td className={styles.mono}>{t.temperatura}°C</td>
                          <td><StatusBadge status={t.status} /></td>
                          <td className={styles.ellipsis}>{t.sintomas}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
          }
        </Modal>
      )}
    </div>
  )
}
