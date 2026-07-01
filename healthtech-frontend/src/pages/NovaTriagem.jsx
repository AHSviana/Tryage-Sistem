/* ══════════════════════════════════════
   pages/NovaTriagem.jsx
══════════════════════════════════════ */
import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { listarPacientes, criarTriagem } from '../api'
import { Alert, Badge, AiResult } from '../components/ui'
import { RISK_COLORS } from '../utils'
import styles from './NovaTriagem.module.css'

export default function NovaTriagem() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const [pacientes, setPacientes]   = useState([])
  const [pacSel, setPacSel]         = useState(null)
  const [busca, setBusca]           = useState('')
  const [showDropdown, setDropdown] = useState(false)

  const [sintomas, setSintomas]     = useState('')
  const [temperatura, setTemp]      = useState('')
  const [dor, setDor]               = useState(null)
  const [spo2, setSpo2]             = useState('')
  const [fc, setFc]                 = useState('')
  const [pas, setPas]               = useState('')
  const [pad, setPad]               = useState('')
  const [fr, setFr]                 = useState('')

  const [loading, setLoading]   = useState(false)
  const [resultado, setResult]  = useState(null)
  const [alertMsg, setAlert]    = useState({ type: '', text: '' })

  useEffect(() => {
    listarPacientes().then(r => {
      const list = r.dados || []
      setPacientes(list)
      const preId = searchParams.get('pacienteId')
      if (preId) {
        const pac = list.find(p => p.id === preId)
        if (pac) setPacSel(pac)
      }
    })
  }, [])

  const filteredPac = pacientes.filter(p =>
    busca && (p.nome.toLowerCase().includes(busca.toLowerCase()) || p.cpf.includes(busca))
  )

  async function handleSubmit(e) {
    e.preventDefault()
    if (!pacSel)    { setAlert({ type: 'error', text: 'Selecione um paciente.' }); return }
    if (!sintomas)  { setAlert({ type: 'error', text: 'Informe os sintomas.' }); return }
    if (!temperatura || +temperatura < 30 || +temperatura > 45) {
      setAlert({ type: 'error', text: 'Temperatura inválida (30–45°C).' }); return
    }
    setLoading(true)
    setAlert({ type: '', text: '' })
    setResult(null)
    try {
      const res = await criarTriagem({
        pacienteId: pacSel.id,
        sintomas,
        temperatura: parseFloat(temperatura),
        saturacaoO2:       spo2 ? parseInt(spo2) : null,
        freqCardiaca:      fc   ? parseInt(fc)   : null,
        pressaoSistolica:  pas  ? parseInt(pas)  : null,
        pressaoDiastolica: pad  ? parseInt(pad)  : null,
        freqRespiratoria:  fr   ? parseInt(fr)   : null,
        escalaDor: dor,
      })
      setResult(res.dados)
      setAlert({ type: 'success', text: 'Triagem realizada com sucesso!' })
    } catch (err) {
      setAlert({ type: 'error', text: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <Alert type="info">
        ✦ O nível de urgência será classificado automaticamente pelo <strong>Gemini AI</strong> usando o Protocolo de Manchester.
      </Alert>

      <form onSubmit={handleSubmit}>
        {/* 1. Paciente */}
        <div className={styles.card}>
          <div className={styles.cardTitle}>1. Selecionar Paciente</div>
          <div className={styles.pacSearch}>
            <input
              className={styles.input}
              placeholder="Buscar por nome ou CPF..."
              value={busca}
              onChange={e => { setBusca(e.target.value); setDropdown(true) }}
              onFocus={() => setDropdown(true)}
              disabled={!!pacSel}
            />
            {showDropdown && filteredPac.length > 0 && !pacSel && (
              <div className={styles.dropdown}>
                {filteredPac.slice(0, 6).map(p => (
                  <div key={p.id} className={styles.dropItem} onMouseDown={() => { setPacSel(p); setBusca(''); setDropdown(false) }}>
                    <div>{p.nome}</div>
                    <div className={styles.dropCpf}>{p.cpf}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {pacSel && (
            <div className={styles.pacSelected}>
              <span>✓ {pacSel.nome} — {pacSel.cpf}</span>
              <button type="button" className={styles.btnTrocar} onClick={() => { setPacSel(null); setBusca('') }}>Trocar</button>
            </div>
          )}
        </div>

        {/* 2. Sintomas */}
        <div className={styles.card}>
          <div className={styles.cardTitle}>2. Sintomas</div>
          <div className={styles.field}>
            <label>Descrição dos Sintomas *</label>
            <textarea className={styles.textarea} value={sintomas} onChange={e => setSintomas(e.target.value)} placeholder="Descreva os sintomas em detalhes..." required />
          </div>
          <div className={styles.field}>
            <label>Escala de Dor (0–10)</label>
            <div className={styles.painScale}>
              {[0,1,2,3,4,5,6,7,8,9,10].map(n => (
                <button
                  key={n} type="button"
                  className={`${styles.painBtn} ${n >= 7 ? styles.painHigh : ''} ${dor === n ? styles.painSel : ''}`}
                  onClick={() => setDor(n)}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Sinais vitais */}
        <div className={styles.card}>
          <div className={styles.cardTitle}>3. Sinais Vitais</div>
          <div className={styles.row2}>
            <div className={styles.field}><label>Temperatura (°C) *</label><input className={styles.input} type="number" step="0.1" value={temperatura} onChange={e => setTemp(e.target.value)} placeholder="36.5" /></div>
            <div className={styles.field}><label>Saturação O₂ (%)</label><input className={styles.input} type="number" value={spo2} onChange={e => setSpo2(e.target.value)} placeholder="98" /></div>
          </div>
          <div className={styles.row3}>
            <div className={styles.field}><label>FC (bpm)</label><input className={styles.input} type="number" value={fc} onChange={e => setFc(e.target.value)} placeholder="80" /></div>
            <div className={styles.field}><label>PA Sistólica</label><input className={styles.input} type="number" value={pas} onChange={e => setPas(e.target.value)} placeholder="120" /></div>
            <div className={styles.field}><label>PA Diastólica</label><input className={styles.input} type="number" value={pad} onChange={e => setPad(e.target.value)} placeholder="80" /></div>
          </div>
          <div className={styles.row2}>
            <div className={styles.field}><label>FR (irpm)</label><input className={styles.input} type="number" value={fr} onChange={e => setFr(e.target.value)} placeholder="16" /></div>
          </div>
        </div>

        {alertMsg.text && <Alert type={alertMsg.type}>{alertMsg.text}</Alert>}

        {/* Resultado */}
        {resultado && (
          <div className={styles.result} style={{ borderColor: RISK_COLORS[resultado.nivelDeRisco] + '40' }}>
            <div className={styles.resultHeader}>
              <div>
                <div className={styles.resultLabel}>Resultado — Gemini AI</div>
                <div className={styles.resultNivel} style={{ color: RISK_COLORS[resultado.nivelDeRisco] }}>
                  {resultado.nivelDeRisco} — {resultado.nivelNome}
                </div>
                <div className={styles.resultDesc}>{resultado.nivelDescricao}</div>
              </div>
              <Badge nivel={resultado.nivelDeRisco} />
            </div>
            <AiResult justificativa={resultado.justificativaIa} recomendacoes={resultado.recomendacoesIa} />
            <div className={styles.resultActions}>
              <button type="button" className={styles.btnOutline} onClick={() => navigate('/fila')}>Ver Fila</button>
              <button type="button" className={styles.btnPrimary} onClick={() => window.location.reload()}>Nova Triagem</button>
            </div>
          </div>
        )}

        {!resultado && (
          <button type="submit" className={styles.btnSubmit} disabled={loading}>
            {loading ? '✦ IA analisando...' : '✦ Classificar com IA'}
          </button>
        )}
      </form>
    </div>
  )
}
