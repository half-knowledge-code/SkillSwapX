import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '18px 60px',
      background: 'rgba(255,255,255,0.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(0,0,0,0.08)',
      boxShadow: '0 2px 20px rgba(108,92,231,0.08)'
    }}>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <span style={{
          fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.4rem',
          background: 'linear-gradient(135deg, #6c5ce7, #e84393)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>
          SkillSwap<span style={{ WebkitTextFillColor: '#00b894' }}>X</span>
        </span>
      </Link>

      <div style={{ display: 'flex', gap: '28px' }}>
        {user ? (
          <>
            {[
              { name: 'Dashboard', path: '/dashboard' },
              { name: 'Matching', path: '/matching' },
              { name: 'Exchanges', path: '/exchanges' },
              { name: 'Chat', path: '/chat' },
              { name: 'Feedback', path: '/feedback' },
              { name: 'Leaderboard', path: '/leaderboard' },
            ].map(item => (
              <Link key={item.name} to={item.path} style={{
                color: 'rgba(26,26,46,0.55)', textDecoration: 'none',
                fontSize: '0.88rem', fontWeight: 500, transition: 'color 0.2s'
              }}
                onMouseEnter={e => e.target.style.color = '#1a1a2e'}
                onMouseLeave={e => e.target.style.color = 'rgba(26,26,46,0.55)'}
              >{item.name}</Link>
            ))}
            {user?.isAdmin && (
              <Link to="/admin" style={{
                color: '#e84393', textDecoration: 'none',
                fontSize: '0.88rem', fontWeight: 600
              }}>⚙️ Admin</Link>
            )}
          </>
        ) : (
          ['Features', 'Matching', 'Leaderboard'].map(item => (
            <Link key={item} to={`/${item.toLowerCase()}`} style={{
              color: 'rgba(26,26,46,0.55)', textDecoration: 'none',
              fontSize: '0.88rem', fontWeight: 500
            }}>{item}</Link>
          ))
        )}
      </div>

      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #6c5ce7, #e84393)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Syne, sans-serif', fontWeight: 800, color: 'white', fontSize: '0.9rem'
            }}>{user.name?.charAt(0).toUpperCase()}</div>
            <button onClick={handleLogout} style={{
              padding: '8px 16px', borderRadius: '10px',
              border: '1px solid rgba(0,0,0,0.08)',
              background: 'transparent', color: 'rgba(26,26,46,0.5)',
              fontSize: '0.82rem', cursor: 'pointer'
            }}>Logout</button>
          </div>
        ) : (
          <>
            <Link to="/login" style={{
              padding: '9px 20px', borderRadius: '10px',
              border: '1px solid rgba(0,0,0,0.08)',
              background: 'transparent', color: '#1a1a2e',
              fontSize: '0.88rem', fontWeight: 500, textDecoration: 'none'
            }}>Login</Link>
            <Link to="/register" style={{
              padding: '9px 22px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #6c5ce7, #9c6dfa)',
              color: '#fff', fontSize: '0.88rem', fontWeight: 600, textDecoration: 'none'
            }}>Get Started →</Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar