/* ══════════════════════════════════════
   api/index.js — Camada HTTP
   Todas as chamadas ao backend ficam aqui.
   O Vite proxy redireciona /api → :8081
══════════════════════════════════════ */

function getToken() {
  return localStorage.getItem('ht_token') || ''
}

async function request(path, options = {}) {
  const res = await fetch(path, {
    headers: {
      'Content-Type': 'application/json',
      ...(getToken() ? { Authorization: 'Bearer ' + getToken() } : {}),
    },
    ...options,
  })

  const text = await res.text()
  if (!text) throw new Error('Resposta vazia do servidor')

  let json
  try {
    json = JSON.parse(text)
  } catch {
    throw new Error('Resposta inválida: ' + text.slice(0, 120))
  }

  if (!res.ok) throw new Error(json.mensagem || `Erro ${res.status}`)
  return json
}

// ── Auth ────────────────────────────────────────────
export const login = (email, senha) =>
  request('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, senha }) })

// ── Dashboard ───────────────────────────────────────
export const getDashboard = () => request('/api/dashboard')

// ── Pacientes ───────────────────────────────────────
export const listarPacientes = () => request('/api/pacientes')

export const criarPaciente = (data) =>
  request('/api/pacientes', { method: 'POST', body: JSON.stringify(data) })

// ── Triagens ────────────────────────────────────────
export const listarTriagens = () => request('/api/triagens')

export const buscarTriagem = (id) => request('/api/triagens/' + id)

export const criarTriagem = (data) =>
  request('/api/triagens', { method: 'POST', body: JSON.stringify(data) })

export const listarFila = () => request('/api/triagens/fila')

export const listarTriagensPorPaciente = (id) => request('/api/triagens/paciente/' + id)

export const atualizarStatus = (id, status) =>
  request('/api/triagens/' + id + '/status', {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
