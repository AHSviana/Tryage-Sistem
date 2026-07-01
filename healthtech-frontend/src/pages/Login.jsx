/* ══════════════════════════════════════
   pages/Login.jsx
══════════════════════════════════════ */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { login } from '../api'
import styles from './Login.module.css'

export default function Login() {
  const [email, setEmail] = useState('admin@healthtech.com')
  const [senha, setSenha] = useState('admin123')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { signIn } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await login(email, senha)
      signIn(res.dados)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.screen}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.logoIcon}>♥</div>
          <h1 className={styles.title}>HealthTech Triage</h1>
          <p className={styles.subtitle}>Sistema de Triagem Hospitalar com IA</p>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>E-mail</label>
            <input
              className={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@healthtech.com"
              required
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Senha</label>
            <input
              className={styles.input}
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••"
              required
            />
          </div>
          <button className={styles.btn} type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar no sistema'}
          </button>
        </form>

        <p className={styles.hint}>Credencial padrão: admin@healthtech.com / admin123</p>
      </div>
    </div>
  )
}
