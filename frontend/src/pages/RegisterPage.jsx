import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(form.name, form.email, form.password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Kuch galat hua!')
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      padding: '24px', background: '#f0f2ff'
    }}>
      <div style={{
        position: 'fixed', top: '30%', left: '50%', transform: 'translateX(-50%)',
        width: '500px', height: '300px', pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(ellipse, rgba(232,67,147,0.08) 0%, transparent 70%)'
      }} />

      <div style={{
        background: '#ffffff',
        border: '1px solid rgba(0,0,0,0.08)',
        borderRadius: '24px', padding: '48px',
        width: '100%', maxWidth: '420px',
        position: 'relative', zIndex: 1,
        boxShadow: '0 20px 60px rgba(108,92,231,0.1)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span style={{
            fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.6rem',
            background: 'linear-gradient(135deg, #6c5ce7, #e84393)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>SkillSwapX</span>
          <p style={{ color: 'rgba(26,26,46,0.5)', fontSize: '0.9rem', marginTop: '8px' }}>
            Community join karo — free hai! 🚀
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(232,67,147,0.08)',
            border: '1px solid rgba(232,67,147,0.2)',
            borderRadius: '10px', padding: '12px 16px',
            color: '#e84393', fontSize: '0.88rem', marginBottom: '20px'
          }}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 500, marginBottom: '8px', display: 'block', color: '#1a1a2e' }}>
              Full Name
            </label>
            <input
              type="text" name="name"
              value={form.name} onChange={handleChange}
              placeholder="Arjun Mehta" required
              style={{
                width: '100%', padding: '12px 16px', borderRadius: '12px',
                background: '#f0f2ff',
                border: '1px solid rgba(0,0,0,0.08)',
                color: '#1a1a2e', fontSize: '0.95rem', outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 500, marginBottom: '8px', display: 'block', color: '#1a1a2e' }}>
              Email
            </label>
            <input
              type="email" name="email"
              value={form.email} onChange={handleChange}
              placeholder="arjun@example.com" required
              style={{
                width: '100%', padding: '12px 16px', borderRadius: '12px',
                background: '#f0f2ff',
                border: '1px solid rgba(0,0,0,0.08)',
                color: '#1a1a2e', fontSize: '0.95rem', outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '28px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 500, marginBottom: '8px', display: 'block', color: '#1a1a2e' }}>
              Password
            </label>
            <input
              type="password" name="password"
              value={form.password} onChange={handleChange}
              placeholder="••••••••" required
              style={{
                width: '100%', padding: '12px 16px', borderRadius: '12px',
                background: '#f0f2ff',
                border: '1px solid rgba(0,0,0,0.08)',
                color: '#1a1a2e', fontSize: '0.95rem', outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '14px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #6c5ce7, #9c6dfa)',
            color: '#fff', fontSize: '1rem', fontWeight: 600,
            border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1
          }}>
            {loading ? 'Creating Account...' : 'Create Account →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.88rem', color: 'rgba(26,26,46,0.45)' }}>
          Already account hai?{' '}
          <Link to="/login" style={{ color: '#6c5ce7', textDecoration: 'none', fontWeight: 600 }}>
            Login karo
          </Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage