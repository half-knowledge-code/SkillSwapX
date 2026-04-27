import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'

const SUGGESTED_SKILLS = [
  '⚛️ React.js', '🐍 Python', '🎨 UI Design', '📸 Photography',
  '🎵 Music Theory', '✍️ Copywriting', '🎬 Video Editing',
  '📊 Data Science', '🛠 Node.js', '🎮 Game Dev', '📱 Flutter',
  '🔐 Cybersecurity', '☁️ Cloud (AWS)', '🤖 Machine Learning'
]

function DashboardPage() {
  const { user, logout, updateUser } = useAuth()
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('')
  const [skillInput, setSkillInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({ exchanges: 0, messages: 0 })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await api.get('/exchanges/my')
      const accepted = [
        ...res.data.sent.filter(e => e.status === 'accepted'),
        ...res.data.received.filter(e => e.status === 'accepted')
      ]
      setStats({ exchanges: accepted.length, messages: 0 })
    } catch (err) {
      console.log(err)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const openModal = (type) => {
    setModalType(type)
    setShowModal(true)
    setSkillInput('')
  }

  const addSkill = async (skill) => {
    if (!skill.trim()) return
    setLoading(true)
    try {
      const res = await api.post('/users/skills/add', {
        skill: skill.trim(),
        type: modalType
      })
      updateUser(res.data.user)
      setSkillInput('')
    } catch (err) {
      alert(err.response?.data?.message || 'Error!')
    }
    setLoading(false)
  }

  const removeSkill = async (skill, type) => {
    try {
      const res = await api.post('/users/skills/remove', { skill, type })
      updateUser(res.data.user)
    } catch (err) {
      alert('Error removing skill!')
    }
  }

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh', background: '#f0f2ff' }}>

      {/* Header */}
      <div style={{
        background: '#ffffff',
        borderBottom: '1px solid rgba(0,0,0,0.08)',
        padding: '32px 60px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 2px 12px rgba(108,92,231,0.06)'
      }}>
        <div>
          <h1 style={{
            fontFamily: 'Syne, sans-serif', fontSize: '1.8rem',
            fontWeight: 800, letterSpacing: '-1px', color: '#1a1a2e'
          }}>
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p style={{ color: 'rgba(26,26,46,0.5)', marginTop: '4px', fontSize: '0.9rem' }}>
            Aaj kya seekhna hai?
          </p>
        </div>
        <button onClick={handleLogout} style={{
          padding: '10px 20px', borderRadius: '10px',
          border: '1px solid rgba(0,0,0,0.08)',
          background: 'transparent', color: 'rgba(26,26,46,0.5)',
          fontSize: '0.88rem', cursor: 'pointer'
        }}>Logout</button>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px', padding: '40px 60px 0'
      }}>
        {[
          { icon: '⭐', label: 'XP Earned', value: user?.xp || 0, color: '#6c5ce7' },
          { icon: '🔄', label: 'Exchanges', value: stats.exchanges, color: '#00b894' },
          { icon: '💬', label: 'Messages', value: stats.messages, color: '#e84393' },
          { icon: '🏆', label: 'Rank', value: '#—', color: '#f5c542' },
        ].map(stat => (
          <div key={stat.label} style={{
            background: '#ffffff',
            border: '1px solid rgba(0,0,0,0.08)',
            borderRadius: '16px', padding: '24px',
            display: 'flex', alignItems: 'center', gap: '16px',
            boxShadow: '0 2px 12px rgba(108,92,231,0.06)'
          }}>
            <div style={{ fontSize: '2rem' }}>{stat.icon}</div>
            <div>
              <div style={{
                fontFamily: 'Syne, sans-serif', fontSize: '1.6rem',
                fontWeight: 800, color: stat.color
              }}>{stat.value}</div>
              <div style={{ color: 'rgba(26,26,46,0.45)', fontSize: '0.82rem' }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Skills Grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: '24px', padding: '24px 60px'
      }}>

        {/* Skills Offered */}
        <div style={{
          background: '#ffffff',
          border: '1px solid rgba(0,0,0,0.08)',
          borderRadius: '20px', padding: '28px',
          boxShadow: '0 2px 12px rgba(108,92,231,0.06)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: '#1a1a2e' }}>
              🎯 Skills I Can Teach
            </h2>
            <button onClick={() => openModal('offered')} style={{
              padding: '6px 14px', borderRadius: '8px',
              background: 'rgba(108,92,231,0.1)',
              border: '1px solid rgba(108,92,231,0.2)',
              color: '#6c5ce7', fontSize: '0.8rem', cursor: 'pointer'
            }}>+ Add</button>
          </div>

          {user?.skillsOffered?.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {user.skillsOffered.map(skill => (
                <div key={skill} style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '8px 14px', borderRadius: '10px',
                  background: 'rgba(0,184,148,0.08)',
                  border: '1px solid rgba(0,184,148,0.2)',
                  color: '#00b894', fontSize: '0.88rem'
                }}>
                  {skill}
                  <span onClick={() => removeSkill(skill, 'offered')}
                    style={{ cursor: 'pointer', opacity: 0.5, fontSize: '0.75rem' }}>✕</span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: 'center', padding: '40px 20px',
              color: 'rgba(26,26,46,0.25)', fontSize: '0.88rem'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🎯</div>
              Koi skill add nahi ki abhi
            </div>
          )}
        </div>

        {/* Skills Wanted */}
        <div style={{
          background: '#ffffff',
          border: '1px solid rgba(0,0,0,0.08)',
          borderRadius: '20px', padding: '28px',
          boxShadow: '0 2px 12px rgba(108,92,231,0.06)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: '#1a1a2e' }}>
              🌱 Skills I Want to Learn
            </h2>
            <button onClick={() => openModal('wanted')} style={{
              padding: '6px 14px', borderRadius: '8px',
              background: 'rgba(108,92,231,0.1)',
              border: '1px solid rgba(108,92,231,0.2)',
              color: '#6c5ce7', fontSize: '0.8rem', cursor: 'pointer'
            }}>+ Add</button>
          </div>

          {user?.skillsWanted?.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {user.skillsWanted.map(skill => (
                <div key={skill} style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '8px 14px', borderRadius: '10px',
                  background: 'rgba(108,92,231,0.08)',
                  border: '1px solid rgba(108,92,231,0.15)',
                  color: '#6c5ce7', fontSize: '0.88rem'
                }}>
                  {skill}
                  <span onClick={() => removeSkill(skill, 'wanted')}
                    style={{ cursor: 'pointer', opacity: 0.5, fontSize: '0.75rem' }}>✕</span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: 'center', padding: '40px 20px',
              color: 'rgba(26,26,46,0.25)', fontSize: '0.88rem'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🌱</div>
              Koi skill add nahi ki abhi
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div style={{
          background: '#ffffff',
          border: '1px solid rgba(0,0,0,0.08)',
          borderRadius: '20px', padding: '28px',
          gridColumn: 'span 2',
          boxShadow: '0 2px 12px rgba(108,92,231,0.06)'
        }}>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.1rem', marginBottom: '20px', color: '#1a1a2e' }}>
            📊 Recent Activity
          </h2>
          <div style={{
            textAlign: 'center', padding: '40px',
            color: 'rgba(26,26,46,0.25)', fontSize: '0.88rem'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🚀</div>
            Abhi koi activity nahi — pehla skill exchange shuru karo!
            <br /><br />
            <button onClick={() => navigate('/matching')} style={{
              padding: '10px 24px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #6c5ce7, #9c6dfa)',
              color: '#fff', border: 'none', cursor: 'pointer',
              fontSize: '0.9rem', fontWeight: 600
            }}>Find Matches →</button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(26,26,46,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }} onClick={() => setShowModal(false)}>
          <div style={{
            background: '#ffffff',
            border: '1px solid rgba(0,0,0,0.08)',
            borderRadius: '20px', padding: '32px',
            width: '100%', maxWidth: '480px',
            position: 'relative',
            boxShadow: '0 20px 60px rgba(108,92,231,0.15)'
          }} onClick={e => e.stopPropagation()}>

            <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, marginBottom: '20px', color: '#1a1a2e' }}>
              {modalType === 'offered' ? '🎯 Skill Add Karo — Jo Sikha Sako' : '🌱 Skill Add Karo — Jo Seekhna Hai'}
            </h3>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <input
                value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addSkill(skillInput)}
                placeholder="Skill likho ya neeche se choose karo..."
                style={{
                  flex: 1, padding: '12px 16px', borderRadius: '12px',
                  background: '#f0f2ff',
                  border: '1px solid rgba(0,0,0,0.08)',
                  color: '#1a1a2e', fontSize: '0.9rem', outline: 'none'
                }}
              />
              <button onClick={() => addSkill(skillInput)} disabled={loading} style={{
                padding: '12px 20px', borderRadius: '12px',
                background: 'linear-gradient(135deg, #6c5ce7, #9c6dfa)',
                color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600
              }}>Add</button>
            </div>

            <p style={{ color: 'rgba(26,26,46,0.45)', fontSize: '0.8rem', marginBottom: '12px' }}>
              Suggestions:
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {SUGGESTED_SKILLS.map(skill => (
                <button key={skill} onClick={() => addSkill(skill)} style={{
                  padding: '6px 12px', borderRadius: '8px',
                  background: 'rgba(108,92,231,0.08)',
                  border: '1px solid rgba(108,92,231,0.15)',
                  color: '#6c5ce7', fontSize: '0.78rem', cursor: 'pointer'
                }}>{skill}</button>
              ))}
            </div>

            <button onClick={() => setShowModal(false)} style={{
              position: 'absolute', top: '16px', right: '16px',
              background: 'transparent', border: 'none',
              color: 'rgba(26,26,46,0.4)', fontSize: '1.2rem', cursor: 'pointer'
            }}>✕</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardPage