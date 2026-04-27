import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'

function MatchingPage() {
  const { user } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState(null)
  const [requestForm, setRequestForm] = useState({ skillOffered: '', skillWanted: '', message: '' })
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users')
      setUsers(res.data.users)
    } catch (err) {
      console.log(err)
    }
    setLoading(false)
  }

  const sendRequest = async () => {
    if (!requestForm.skillOffered || !requestForm.skillWanted) {
      alert('Dono skills select karo!')
      return
    }
    setSending(true)
    try {
      await api.post('/exchanges/send', {
        receiverId: selectedUser._id,
        skillOffered: requestForm.skillOffered,
        skillWanted: requestForm.skillWanted,
        message: requestForm.message
      })
      setSuccess('Request bheji! 🎉')
      setTimeout(() => {
        setSelectedUser(null)
        setSuccess('')
      }, 2000)
    } catch (err) {
      alert(err.response?.data?.message || 'Error!')
    }
    setSending(false)
  }

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.skillsOffered.some(s => s.toLowerCase().includes(search.toLowerCase())) ||
    u.skillsWanted.some(s => s.toLowerCase().includes(search.toLowerCase()))
  )

  const getMatchScore = (otherUser) => {
    if (!user?.skillsOffered || !user?.skillsWanted) return 0
    let score = 0
    otherUser.skillsWanted?.forEach(s => {
      if (user.skillsOffered.includes(s)) score += 50
    })
    otherUser.skillsOffered?.forEach(s => {
      if (user.skillsWanted.includes(s)) score += 50
    })
    return Math.min(score, 99)
  }

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh', padding: '100px 60px 60px' }}>

      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: '#6c5ce7', marginBottom: '12px' }}>
          Skill Matching
        </div>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-1.5px', marginBottom: '12px' }}>
          Find Your Match 🧠
        </h1>
        <p style={{ color: 'rgba(26,26,46,0.5)', fontSize: '1rem' }}>
          Unhe dhundo jinka skill aapke kaam aaye — aur jinhe aap sikha sako!
        </p>
      </div>

      {/* Search */}
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="🔍 Naam ya skill se search karo..."
        style={{
          width: '100%', maxWidth: '500px', padding: '14px 20px',
          borderRadius: '14px', background: '#ffffff',
          border: '1px solid rgba(0,0,0,0.08)',
          color: '#1a1a2e', fontSize: '0.95rem', outline: 'none',
          marginBottom: '40px', boxSizing: 'border-box'
        }}
      />

      {/* Users Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', color: 'rgba(26,26,46,0.4)', padding: '60px' }}>
          Loading matches...
        </div>
      ) : filteredUsers.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'rgba(26,26,46,0.3)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔍</div>
          Koi user nahi mila — zyada log join karein!
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {filteredUsers.map(u => {
            const score = getMatchScore(u)
            return (
              <div key={u._id} style={{
                background: '#ffffff',
                border: score > 0 ? '1px solid rgba(124,109,250,0.3)' : '1px solid rgba(0,0,0,0.08)',
                borderRadius: '20px', padding: '28px',
                transition: 'all 0.3s', position: 'relative'
              }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                {/* Match Score */}
                {score > 0 && (
                  <div style={{
                    position: 'absolute', top: '16px', right: '16px',
                    background: 'linear-gradient(135deg, #6c5ce7, #00b894)',
                    padding: '4px 10px', borderRadius: '100px',
                    fontSize: '0.72rem', fontWeight: 700, color: '#f0f2ff'
                  }}>{score}% Match</div>
                )}

                {/* Avatar */}
                <div style={{
                  width: '52px', height: '52px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6c5ce7, #e84393)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.3rem',
                  color: 'white', marginBottom: '16px'
                }}>
                  {u.name.charAt(0).toUpperCase()}
                </div>

                <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, marginBottom: '4px' }}>{u.name}</h3>
                <p style={{ color: 'rgba(26,26,46,0.4)', fontSize: '0.82rem', marginBottom: '16px' }}>
                  ⭐ {u.xp} XP
                </p>

                {/* Skills Offered */}
                {u.skillsOffered?.length > 0 && (
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '0.72rem', color: 'rgba(26,26,46,0.4)', marginBottom: '6px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
                      Sikha Sakta Hai
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {u.skillsOffered.map(s => (
                        <span key={s} style={{
                          padding: '4px 10px', borderRadius: '8px',
                          background: 'rgba(109,250,189,0.08)',
                          border: '1px solid rgba(109,250,189,0.15)',
                          color: '#00b894', fontSize: '0.75rem'
                        }}>{s}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skills Wanted */}
                {u.skillsWanted?.length > 0 && (
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '0.72rem', color: 'rgba(26,26,46,0.4)', marginBottom: '6px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
                      Seekhna Chahta Hai
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {u.skillsWanted.map(s => (
                        <span key={s} style={{
                          padding: '4px 10px', borderRadius: '8px',
                          background: 'rgba(124,109,250,0.08)',
                          border: '1px solid rgba(124,109,250,0.15)',
                          color: '#6c5ce7', fontSize: '0.75rem'
                        }}>{s}</span>
                      ))}
                    </div>
                  </div>
                )}

                <button onClick={() => {
                  setSelectedUser(u)
                  setRequestForm({ skillOffered: '', skillWanted: '', message: '' })
                }} style={{
                  width: '100%', padding: '12px', borderRadius: '12px',
                  background: 'linear-gradient(135deg, #6c5ce7, #9c6dfa)',
                  color: '#fff', border: 'none', cursor: 'pointer',
                  fontSize: '0.9rem', fontWeight: 600
                }}>
                  Exchange Request Bhejo 🔄
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Request Modal */}
      {selectedUser && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'
        }} onClick={() => setSelectedUser(null)}>
          <div style={{
            background: '#ffffff',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '24px', padding: '36px',
            width: '100%', maxWidth: '500px'
          }} onClick={e => e.stopPropagation()}>

            <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.3rem', marginBottom: '8px' }}>
              🔄 Exchange Request
            </h3>
            <p style={{ color: 'rgba(26,26,46,0.5)', fontSize: '0.88rem', marginBottom: '28px' }}>
              {selectedUser.name} ko request bhejo
            </p>

            {success ? (
              <div style={{
                textAlign: 'center', padding: '40px',
                color: '#00b894', fontSize: '1.2rem', fontWeight: 600
              }}>{success}</div>
            ) : (
              <>
                {/* Skill I Offer */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 500, marginBottom: '8px', display: 'block' }}>
                    Main kya sikhaunga?
                  </label>
                  <select
                    value={requestForm.skillOffered}
                    onChange={e => setRequestForm({ ...requestForm, skillOffered: e.target.value })}
                    style={{
                      width: '100%', padding: '12px 16px', borderRadius: '12px',
                      background: '#f0f2ff', border: '1px solid rgba(0,0,0,0.08)',
                      color: '#1a1a2e', fontSize: '0.9rem', outline: 'none'
                    }}>
                    <option value="">Select karo...</option>
                    {user?.skillsOffered?.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                {/* Skill I Want */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 500, marginBottom: '8px', display: 'block' }}>
                    Main kya seekhunga?
                  </label>
                  <select
                    value={requestForm.skillWanted}
                    onChange={e => setRequestForm({ ...requestForm, skillWanted: e.target.value })}
                    style={{
                      width: '100%', padding: '12px 16px', borderRadius: '12px',
                      background: '#f0f2ff', border: '1px solid rgba(0,0,0,0.08)',
                      color: '#1a1a2e', fontSize: '0.9rem', outline: 'none'
                    }}>
                    <option value="">Select karo...</option>
                    {selectedUser?.skillsOffered?.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                {/* Message */}
                <div style={{ marginBottom: '28px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 500, marginBottom: '8px', display: 'block' }}>
                    Message (optional)
                  </label>
                  <textarea
                    value={requestForm.message}
                    onChange={e => setRequestForm({ ...requestForm, message: e.target.value })}
                    placeholder="Apne baare mein kuch batao..."
                    rows={3}
                    style={{
                      width: '100%', padding: '12px 16px', borderRadius: '12px',
                      background: '#f0f2ff', border: '1px solid rgba(0,0,0,0.08)',
                      color: '#1a1a2e', fontSize: '0.9rem', outline: 'none',
                      resize: 'none', boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={() => setSelectedUser(null)} style={{
                    flex: 1, padding: '12px', borderRadius: '12px',
                    background: 'transparent', border: '1px solid rgba(0,0,0,0.08)',
                    color: 'rgba(220, 19, 19, 0.5)', cursor: 'pointer', fontSize: '0.9rem'
                  }}>Cancel</button>
                  <button onClick={sendRequest} disabled={sending} style={{
                    flex: 2, padding: '12px', borderRadius: '12px',
                    background: 'linear-gradient(135deg, #6c5ce7, #9c6dfa)',
                    color: '#fff', border: 'none', cursor: 'pointer',
                    fontSize: '0.9rem', fontWeight: 600,
                    opacity: sending ? 0.7 : 1
                  }}>{sending ? 'Bhej raha hai...' : 'Request Bhejo 🚀'}</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default MatchingPage