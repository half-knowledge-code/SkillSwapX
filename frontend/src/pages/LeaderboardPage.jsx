import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'

function LeaderboardPage() {
  const { user } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [myRank, setMyRank] = useState(null)

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const fetchLeaderboard = async () => {
    try {
      const res = await api.get('/users/leaderboard')
      setUsers(res.data.users)
      const rank = res.data.users.findIndex(u => u._id === user?.id) + 1
      setMyRank(rank > 0 ? rank : null)
    } catch (err) {
      console.log(err)
    }
    setLoading(false)
  }

  const getBadge = (xp) => {
    if (xp >= 2000) return { icon: '👑', label: 'Legend', color: '#f5c542' }
    if (xp >= 1000) return { icon: '🔥', label: 'Expert', color: '#e84393' }
    if (xp >= 500) return { icon: '⭐', label: 'Pro', color: '#6c5ce7' }
    if (xp >= 100) return { icon: '🌱', label: 'Rising', color: '#00b894' }
    return { icon: '🐣', label: 'Newbie', color: 'rgba(26,26,46,0.4)' }
  }

  const getRankStyle = (index) => {
    if (index === 0) return { color: '#f5c542', icon: '🥇' }
    if (index === 1) return { color: '#b0b8c1', icon: '🥈' }
    if (index === 2) return { color: '#cd7f32', icon: '🥉' }
    return { color: 'rgba(26,26,46,0.4)', icon: `#${index + 1}` }
  }

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh', padding: '100px 60px 60px' }}>

      {/* Header */}
      <div style={{ marginBottom: '40px', textAlign: 'center' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: '#6c5ce7', marginBottom: '12px' }}>
          Hall of Fame
        </div>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '3rem', fontWeight: 800, letterSpacing: '-2px', marginBottom: '12px' }}>
          Leaderboard 🏆
        </h1>
        <p style={{ color: 'rgba(26,26,46,0.5)', fontSize: '1rem' }}>
          Top skill exchangers of SkillSwapX
        </p>
      </div>

      {/* My Rank Card */}
      {myRank && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(124,109,250,0.15), rgba(250,109,139,0.1))',
          border: '1px solid rgba(124,109,250,0.3)',
          borderRadius: '16px', padding: '20px 28px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: '32px', maxWidth: '700px', margin: '0 auto 32px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ fontSize: '1.5rem' }}>🎯</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Tera Rank</div>
              <div style={{ color: 'rgba(26,26,46,0.5)', fontSize: '0.82rem' }}>Keep exchanging to rise!</div>
            </div>
          </div>
          <div style={{
            fontFamily: 'Syne, sans-serif', fontSize: '2rem', fontWeight: 800,
            background: 'linear-gradient(135deg, #6c5ce7, #00b894)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>#{myRank}</div>
        </div>
      )}

      {/* Top 3 Podium */}
      {!loading && users.length >= 3 && (
        <div style={{
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          gap: '16px', marginBottom: '48px', maxWidth: '700px', margin: '0 auto 48px'
        }}>
          {/* 2nd Place */}
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{
              width: '60px', height: '60px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #6c5ce7, #e84393)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Syne, sans-serif', fontWeight: 800, color: 'white',
              fontSize: '1.3rem', margin: '0 auto 8px'
            }}>{users[1]?.name?.charAt(0)}</div>
            <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '4px' }}>{users[1]?.name?.split(' ')[0]}</div>
            <div style={{ color: '#b0b8c1', fontSize: '0.78rem', marginBottom: '8px' }}>{users[1]?.xp} XP</div>
            <div style={{
              background: '#f0f2ff', border: '2px solid #b0b8c1',
              borderRadius: '12px 12px 0 0', padding: '20px 16px',
              fontSize: '2rem'
            }}>🥈</div>
          </div>

          {/* 1st Place */}
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>👑</div>
            <div style={{
              width: '72px', height: '72px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #f5c542, #e84393)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Syne, sans-serif', fontWeight: 800, color: 'white',
              fontSize: '1.6rem', margin: '0 auto 8px',
              boxShadow: '0 0 30px rgba(245,197,66,0.4)'
            }}>{users[0]?.name?.charAt(0)}</div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '4px' }}>{users[0]?.name?.split(' ')[0]}</div>
            <div style={{ color: '#f5c542', fontSize: '0.78rem', marginBottom: '8px' }}>{users[0]?.xp} XP</div>
            <div style={{
              background: '#f0f2ff', border: '2px solid #f5c542',
              borderRadius: '12px 12px 0 0', padding: '32px 16px',
              fontSize: '2rem'
            }}>🥇</div>
          </div>

          {/* 3rd Place */}
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{
              width: '60px', height: '60px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #6c5ce7, #e84393)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Syne, sans-serif', fontWeight: 800, color: 'white',
              fontSize: '1.3rem', margin: '0 auto 8px'
            }}>{users[2]?.name?.charAt(0)}</div>
            <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '4px' }}>{users[2]?.name?.split(' ')[0]}</div>
            <div style={{ color: '#cd7f32', fontSize: '0.78rem', marginBottom: '8px' }}>{users[2]?.xp} XP</div>
            <div style={{
              background: '#f0f2ff', border: '2px solid #cd7f32',
              borderRadius: '12px 12px 0 0', padding: '12px 16px',
              fontSize: '2rem'
            }}>🥉</div>
          </div>
        </div>
      )}

      {/* Full List */}
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <div style={{
          background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)',
          borderRadius: '20px', overflow: 'hidden'
        }}>
          <div style={{
            padding: '16px 24px', borderBottom: '1px solid rgba(0,0,0,0.08)',
            display: 'grid', gridTemplateColumns: '48px 1fr auto auto',
            color: 'rgba(26,26,46,0.3)', fontSize: '0.75rem',
            fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', gap: '12px'
          }}>
            <span>Rank</span>
            <span>User</span>
            <span>Badge</span>
            <span>XP</span>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: 'rgba(26,26,46,0.4)' }}>
              Loading...
            </div>
          ) : (
            users.map((u, index) => {
              const rank = getRankStyle(index)
              const badge = getBadge(u.xp)
              const isMe = u._id === user?.id

              return (
                <div key={u._id} style={{
                  padding: '16px 24px',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  display: 'grid', gridTemplateColumns: '48px 1fr auto auto',
                  alignItems: 'center', gap: '12px',
                  background: isMe ? 'rgba(124,109,250,0.08)' : 'transparent',
                  transition: 'background 0.2s'
                }}
                  onMouseEnter={e => !isMe && (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                  onMouseLeave={e => !isMe && (e.currentTarget.style.background = 'transparent')}
                >
                  {/* Rank */}
                  <div style={{
                    fontFamily: 'Syne, sans-serif', fontWeight: 800,
                    fontSize: index < 3 ? '1.3rem' : '0.95rem',
                    color: rank.color, textAlign: 'center'
                  }}>
                    {rank.icon}
                  </div>

                  {/* User */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '38px', height: '38px', borderRadius: '50%',
                      background: isMe
                        ? 'linear-gradient(135deg, #6c5ce7, #00b894)'
                        : 'linear-gradient(135deg, #6c5ce7, #e84393)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'Syne, sans-serif', fontWeight: 800,
                      color: 'white', fontSize: '0.9rem', flexShrink: 0
                    }}>{u.name?.charAt(0)}</div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                        {u.name} {isMe && <span style={{ color: '#6c5ce7', fontSize: '0.75rem' }}>(You)</span>}
                      </div>
                      <div style={{ color: 'rgba(240,240,248,0.35)', fontSize: '0.75rem' }}>
                        {u.skillsOffered?.slice(0, 2).join(', ')}
                      </div>
                    </div>
                  </div>

                  {/* Badge */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '4px',
                    padding: '4px 10px', borderRadius: '100px',
                    background: `${badge.color}18`,
                    color: badge.color, fontSize: '0.72rem', fontWeight: 600
                  }}>
                    {badge.icon} {badge.label}
                  </div>

                  {/* XP */}
                  <div style={{
                    fontFamily: 'Syne, sans-serif', fontWeight: 700,
                    fontSize: '0.95rem',
                    background: 'linear-gradient(135deg, #6c5ce7, #00b894)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    minWidth: '70px', textAlign: 'right'
                  }}>{u.xp.toLocaleString()} XP</div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

export default LeaderboardPage