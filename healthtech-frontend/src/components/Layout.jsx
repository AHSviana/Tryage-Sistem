/* ══════════════════════════════════════
   components/Layout.jsx — Shell da aplicação
   Sidebar + Topbar + área de conteúdo
══════════════════════════════════════ */
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import styles from './Layout.module.css'

const navItems = [
  { to: '/dashboard',  label: 'Dashboard',          icon: '▦' },
  { to: '/fila',       label: 'Fila de Atendimento', icon: '≡' },
  { to: '/triagem',    label: 'Nova Triagem',         icon: '✚' },
  { to: '/triagens',   label: 'Todas as Triagens',    icon: '◷' },
  { to: '/pacientes',  label: 'Pacientes',            icon: '⁂' },
]

export default function Layout() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const initials = user?.nome
    ?.split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  function handleLogout() {
    signOut()
    navigate('/login')
  }

  return (
    <div className={styles.shell}>
      {/* ── Sidebar ── */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>♥</div>
          <div>
            <div className={styles.logoText}>HealthTech</div>
            <div className={styles.logoSub}>Triagem Hospitalar</div>
          </div>
        </div>

        <nav className={styles.nav}>
          <div className={styles.navSection}>Principal</div>
          {navItems.slice(0, 2).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ''}`
              }
            >
              <span className={styles.navIcon}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}

          <div className={styles.navSection}>Clínico</div>
          {navItems.slice(2).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ''}`
              }
            >
              <span className={styles.navIcon}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userCard}>
            <div className={styles.avatar}>{initials}</div>
            <div className={styles.userInfo}>
              <div className={styles.userName}>{user?.nome}</div>
              <div className={styles.userRole}>{user?.role}</div>
            </div>
            <button className={styles.logoutBtn} onClick={handleLogout} title="Sair">
              ⎋
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className={styles.main}>
        <header className={styles.topbar}>
          <div className={styles.pageTitle} id="page-title">Dashboard</div>
          <div className={styles.topbarRight}>
            <button className={styles.btnOutlineSm} onClick={() => window.location.reload()}>
              ↺ Atualizar
            </button>
            <NavLink to="/triagem" className={styles.btnPrimarySm}>
              + Nova Triagem
            </NavLink>
          </div>
        </header>

        <div className={styles.content}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}
