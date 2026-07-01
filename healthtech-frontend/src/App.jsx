/* ══════════════════════════════════════
   App.jsx — Roteamento da aplicação
══════════════════════════════════════ */
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Fila from './pages/Fila'
import Triagens from './pages/Triagens'
import TriagemDetalhe from './pages/TriagemDetalhe'
import Pacientes from './pages/Pacientes'
import NovaTriagem from './pages/NovaTriagem'

function PrivateRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard"       element={<Dashboard />} />
            <Route path="fila"            element={<Fila />} />
            <Route path="triagem"         element={<NovaTriagem />} />
            <Route path="triagens"        element={<Triagens />} />
            <Route path="triagens/:id"    element={<TriagemDetalhe />} />
            <Route path="pacientes"       element={<Pacientes />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
