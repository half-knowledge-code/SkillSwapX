import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'

function AdminPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('stats')
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [feedbacks, setFeedbacks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate('/')
      return
    }
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [statsRes, usersRes, feedbacksRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/admin/feedbacks')
      ])
      setStats(statsRes.data.stats)
      setUsers(usersRes.data.users)
      setFeedbacks(feedbacksRes.data.feedbacks)
    } catch (err) {
      console.log(err)
    }
    setLoading(false)
  }

  const banUser = async (id) => {
    if (!window.confirm('Ban karna chahte ho?')) return
    try {
      await api.put(`/admin/users/${id}/ban`)
      fetchData()
    } catch (err) {
      alert('Error!')
    }
  }

  const unbanUser = async (id) => {
    try {
      await api.put(`/admin/users/${id}/unban`)
      fetchData()
    } catch (err) {
      alert('Error!')
    }
  }

  const deleteFeedback = async (id) => {
    if (!window.confirm('Feedback delete karna chahte ho?')) return
    try {
      await api.delete(`/admin/feedbacks/${id}`)
      fetchData()
    } catch (err) {
      alert('Error!')
    }
  }

  if (loading) return (
    <div style={{ paddingTop: '100px', textAlign: 'center', color: 'rgba(26,26,46,0.4)' }}>
      Loading...
    </div>
  )

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh', padding: '100px 60px 60px' }}>

      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: '#e84393', marginBottom: '12px' }}>
          Admin Panel
        </div>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-1.5px' }}>
          ⚙️ Admin Dashboard
        </h1>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '40px' }}>
          {[
            { label: 'Total Users', value: stats.totalUsers, color: '#6c5ce7', icon: '👥' },
            { label: 'Banned Users', value: stats.bannedUsers, color: '#e84393', icon: '🚫' },
            { label: 'Total Exchanges', value: stats.totalExchanges, color: '#00b894', icon: '🔄' },
            { label: 'Accepted', value: stats.acceptedExchanges, color: '#f5c542', icon: '✅' },
            { label: 'Feedbacks', value: stats.totalFeedbacks, color: '#e84393', icon: '⭐' },
          ].map(s => (
            <div key={s.label} style={{
              background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)',
              borderRadius: '16px', padding: '20px', textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>{s.icon}</div>
              <div style={{
                fontFamily: 'Syne, sans-serif', fontSize: '1.8rem',
                fontWeight: 800, color: s.color
              }}>{s.value}</div>
              <div style={{ color: 'rgba(26,26,46,0.4)', fontSize: '0.78rem', marginTop: '4px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '32px', background: '#ffffff', padding: '4px', borderRadius: '12px', width: 'fit-content' }}>
        {[
          { key: 'users', label: `👥 Users (${users.length})` },
          { key: 'feedbacks', label: `⭐ Feedbacks (${feedbacks.length})` },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding: '10px 24px', borderRadius: '10px', border: 'none',
            background: tab === t.key ? 'linear-gradient(135deg, #e84393, #fa9c6d)' : 'transparent',
            color: tab === t.key ? '#fff' : 'rgba(26,26,46,0.4)',
            cursor: 'pointer', fontSize: '0.88rem', fontWeight: 600
          }}>{t.label}</button>
        ))}
      </div>

      {/* Users Tab */}
      {tab === 'users' && (
        <div style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '20px', overflow: 'hidden' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr auto auto auto auto',
            padding: '14px 24px', borderBottom: '1px solid rgba(0,0,0,0.08)',
            color: 'rgba(26,26,46,0.3)', fontSize: '0.75rem', fontWeight: 600,
            textTransform: 'uppercase', letterSpacing: '1px', gap: '16px'
          }}>
            <span>User</span>
            <span>XP</span>
            <span>Rating</span>
            <span>Status</span>
            <span>Action</span>
          </div>

          {users.map(u => (
            <div key={u._id} style={{
              display: 'grid', gridTemplateColumns: '1fr auto auto auto auto',
              padding: '14px 24px', borderBottom: '1px solid rgba(255,255,255,0.04)',
              alignItems: 'center', gap: '16px',
              background: u.isBanned ? 'rgba(250,109,139,0.05)' : 'transparent'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '34px', height: '34px', borderRadius: '50%',
                  background: u.isBanned ? '#333' : 'linear-gradient(135deg, #6c5ce7, #e84393)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Syne, sans-serif', fontWeight: 800, color: 'white', fontSize: '0.85rem'
                }}>{u.name?.charAt(0)}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>
                    {u.name} {u.isAdmin && <span style={{ color: '#e84393', fontSize: '0.72rem' }}>ADMIN</span>}
                  </div>
                  <div style={{ color: 'rgba(240,240,248,0.35)', fontSize: '0.75rem' }}>{u.email}</div>
                </div>
              </div>

              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: '#6c5ce7', fontSize: '0.88rem' }}>
                {u.xp} XP
              </div>

              <div style={{ color: '#f5c542', fontSize: '0.88rem' }}>
                ★ {u.rating || 0}
              </div>

              <div style={{
                padding: '3px 10px', borderRadius: '100px', fontSize: '0.72rem', fontWeight: 600,
                background: u.isBanned ? 'rgba(250,109,139,0.15)' : 'rgba(109,250,189,0.1)',
                color: u.isBanned ? '#e84393' : '#00b894',
                border: `1px solid ${u.isBanned ? 'rgba(250,109,139,0.2)' : 'rgba(109,250,189,0.2)'}`
              }}>
                {u.isBanned ? '🚫 Banned' : '✅ Active'}
              </div>

              {!u.isAdmin && (
                <button onClick={() => u.isBanned ? unbanUser(u._id) : banUser(u._id)} style={{
                  padding: '6px 14px', borderRadius: '8px', border: 'none',
                  background: u.isBanned ? 'rgba(109,250,189,0.1)' : 'rgba(250,109,139,0.1)',
                  color: u.isBanned ? '#00b894' : '#e84393',
                  cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600
                }}>
                  {u.isBanned ? 'Unban' : 'Ban'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Feedbacks Tab */}
      {tab === 'feedbacks' && (
        <div style={{ maxWidth: '800px' }}>
          {feedbacks.map(fb => (
            <div key={fb._id} style={{
              background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)',
              borderRadius: '16px', padding: '20px', marginBottom: '12px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px'
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '8px', fontSize: '0.8rem' }}>
                  <span style={{ color: '#00b894' }}>From: {fb.sender?.name}</span>
                  <span style={{ color: '#e84393' }}>To: {fb.receiver?.name}</span>
                  <span style={{ color: '#f5c542' }}>{'★'.repeat(fb.rating)}</span>
                </div>
                <p style={{ color: 'rgba(240,240,248,0.6)', fontSize: '0.88rem', fontStyle: 'italic' }}>
                  "{fb.comment}"
                </p>
              </div>
              <button onClick={() => deleteFeedback(fb._id)} style={{
                padding: '6px 14px', borderRadius: '8px', border: 'none',
                background: 'rgba(250,109,139,0.1)', color: '#e84393',
                cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600,
                flexShrink: 0
              }}>🗑️ Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminPage
