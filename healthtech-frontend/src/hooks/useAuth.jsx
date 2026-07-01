/* ══════════════════════════════════════
   hooks/useAuth.jsx — Contexto de autenticação
══════════════════════════════════════ */
import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('ht_user')
    return stored ? JSON.parse(stored) : null
  })

  function signIn(userData) {
    localStorage.setItem('ht_token', userData.token)
    localStorage.setItem('ht_user', JSON.stringify(userData))
    setUser(userData)
  }

  function signOut() {
    localStorage.removeItem('ht_token')
    localStorage.removeItem('ht_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
