import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'

function FeedbackPage() {
  const { user } = useAuth()
  const [exchanges, setExchanges] = useState([])
  const [myFeedbacks, setMyFeedbacks] = useState([])
  const [tab, setTab] = useState('received')
  const [showForm, setShowForm] = useState(false)
  const [selectedExchange, setSelectedExchange] = useState(null)
  const [form, setForm] = useState({ rating: 5, comment: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchData()
  }, [user])

  const fetchData = async () => {
    try {
      const [exchangeRes, feedbackRes] = await Promise.all([
        api.get('/exchanges/my'),
        api.get(`/feedback/${user.id}`)
      ])
      const accepted = [
        ...exchangeRes.data.sent.filter(e => e.status === 'accepted'),
        ...exchangeRes.data.received.filter(e => e.status === 'accepted')
      ]
      setExchanges(accepted)
      setMyFeedbacks(feedbackRes.data.feedbacks)
    } catch (err) {
      console.log(err)
    }
  }

  const submitFeedback = async () => {
    if (!form.comment.trim()) {
      alert('Comment likho!')
      return
    }
    setLoading(true)
    try {
      const receiverId = selectedExchange.sender._id === user.id
        ? selectedExchange.receiver._id
        : selectedExchange.sender._id

      await api.post('/feedback/give', {
        receiverId,
        exchangeId: selectedExchange._id,
        rating: form.rating,
        comment: form.comment
      })
      setSuccess('Feedback diya! 🎉 Identity hidden rahegi!')
      setTimeout(() => {
        setShowForm(false)
        setSuccess('')
        fetchData()
      }, 2000)
    } catch (err) {
      alert(err.response?.data?.message || 'Error!')
    }
    setLoading(false)
  }

  const StarRating = ({ rating, onChange }) => (
    <div style={{ display: 'flex', gap: '8px' }}>
      {[1, 2, 3, 4, 5].map(star => (
        <span key={star} onClick={() => onChange && onChange(star)}
          style={{
            fontSize: '2rem', cursor: onChange ? 'pointer' : 'default',
            color: star <= rating ? '#f5c542' : 'rgba(255,255,255,0.15)',
            transition: 'color 0.2s'
          }}>★</span>
      ))}
    </div>
  )

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh', padding: '100px 60px 60px' }}>

      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: '#6c5ce7', marginBottom: '12px' }}>
          Feedback System
        </div>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-1.5px', marginBottom: '12px' }}>
          Anonymous Feedback 👻
        </h1>
        <p style={{ color: 'rgba(26,26,46,0.5)', fontSize: '1rem' }}>
          Honest feedback — identity 100% hidden!
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '32px', background: '#ffffff', padding: '4px', borderRadius: '12px', width: 'fit-content' }}>
        {[
          { key: 'received', label: `📥 Mujhe Mila (${myFeedbacks.length})` },
          { key: 'give', label: `✍️ Feedback Do (${exchanges.length})` }
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding: '10px 24px', borderRadius: '10px', border: 'none',
            background: tab === t.key ? 'linear-gradient(135deg, #6c5ce7, #9c6dfa)' : 'transparent',
            color: tab === t.key ? '#fff' : 'rgba(26,26,46,0.4)',
            cursor: 'pointer', fontSize: '0.88rem', fontWeight: 600
          }}>{t.label}</button>
        ))}
      </div>

      {/* Received Feedback */}
      {tab === 'received' && (
        <div style={{ maxWidth: '700px' }}>
          {myFeedbacks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: 'rgba(26,26,46,0.3)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>👻</div>
              Abhi koi feedback nahi mila
            </div>
          ) : myFeedbacks.map((fb, i) => (
            <div key={i} style={{
              background: '#ffffff',
              border: '1px solid rgba(0,0,0,0.08)',
              borderRadius: '20px', padding: '28px', marginBottom: '16px',
              position: 'relative', overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                background: 'linear-gradient(90deg, #6c5ce7, #e84393)'
              }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  background: 'rgba(250,109,139,0.1)',
                  border: '1px solid rgba(250,109,139,0.2)',
                  padding: '4px 12px', borderRadius: '100px',
                  fontSize: '0.72rem', color: '#e84393', fontWeight: 600
                }}>👻 Anonymous</div>
                <span style={{ color: 'rgba(26,26,46,0.3)', fontSize: '0.78rem' }}>
                  {new Date(fb.createdAt).toLocaleDateString('en-IN')}
                </span>
              </div>

              <StarRating rating={fb.rating} />

              <p style={{
                color: '#1a1a2e', fontSize: '0.95rem', lineHeight: 1.7,
                fontStyle: 'italic', margin: '16px 0',
                fontWeight: 300
              }}>"{fb.comment}"</p>
            </div>
          ))}
        </div>
      )}

      {/* Give Feedback */}
      {tab === 'give' && (
        <div style={{ maxWidth: '700px' }}>
          {exchanges.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: 'rgba(26,26,46,0.3)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔄</div>
              Koi accepted exchange nahi hai abhi
            </div>
          ) : exchanges.map(ex => {
            const other = ex.sender?._id === user.id ? ex.receiver : ex.sender
            return (
              <div key={ex._id} style={{
                background: '#ffffff',
                border: '1px solid rgba(0,0,0,0.08)',
                borderRadius: '20px', padding: '24px', marginBottom: '16px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6c5ce7, #e84393)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'Syne, sans-serif', fontWeight: 800, color: 'white'
                  }}>{other?.name?.charAt(0)}</div>
                  <div>
                    <div style={{ fontWeight: 600 }}>{other?.name}</div>
                    <div style={{ color: 'rgba(26,26,46,0.4)', fontSize: '0.78rem' }}>
                      {ex.skillOffered} ⇄ {ex.skillWanted}
                    </div>
                  </div>
                </div>
                <button onClick={() => {
                  setSelectedExchange(ex)
                  setForm({ rating: 5, comment: '' })
                  setShowForm(true)
                }} style={{
                  padding: '10px 20px', borderRadius: '10px',
                  background: 'linear-gradient(135deg, #6c5ce7, #9c6dfa)',
                  color: '#fff', border: 'none', cursor: 'pointer',
                  fontSize: '0.88rem', fontWeight: 600
                }}>👻 Feedback Do</button>
              </div>
            )
          })}
        </div>
      )}

      {/* Feedback Modal */}
      {showForm && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'
        }} onClick={() => setShowForm(false)}>
          <div style={{
            background: '#ffffff',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '24px', padding: '36px',
            width: '100%', maxWidth: '500px'
          }} onClick={e => e.stopPropagation()}>

            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              background: 'rgba(250,109,139,0.1)',
              border: '1px solid rgba(250,109,139,0.2)',
              padding: '4px 12px', borderRadius: '100px',
              fontSize: '0.72rem', color: '#e84393', fontWeight: 600,
              marginBottom: '16px'
            }}>👻 Teri identity hidden rahegi!</div>

            <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.3rem', marginBottom: '24px' }}>
              Anonymous Feedback Do
            </h3>

            {success ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#00b894', fontSize: '1.1rem', fontWeight: 600 }}>
                {success}
              </div>
            ) : (
              <>
                {/* Rating */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 500, marginBottom: '12px', display: 'block' }}>
                    Rating
                  </label>
                  <StarRating rating={form.rating} onChange={r => setForm({ ...form, rating: r })} />
                </div>

                {/* Comment */}
                <div style={{ marginBottom: '28px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 500, marginBottom: '8px', display: 'block' }}>
                    Honest Feedback
                  </label>
                  <textarea
                    value={form.comment}
                    onChange={e => setForm({ ...form, comment: e.target.value })}
                    placeholder="Kya achha laga? Kya improve kar sakte hain? Be honest!"
                    rows={4}
                    style={{
                      width: '100%', padding: '12px 16px', borderRadius: '12px',
                      background: '#f0f2ff',
                      border: '1px solid rgba(0,0,0,0.08)',
                      color: '#1a1a2e', fontSize: '0.9rem', outline: 'none',
                      resize: 'none', boxSizing: 'border-box', lineHeight: 1.6
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={() => setShowForm(false)} style={{
                    flex: 1, padding: '12px', borderRadius: '12px',
                    background: 'transparent',
                    border: '1px solid rgba(0,0,0,0.08)',
                    color: 'rgba(240,240,248,0.5)', cursor: 'pointer'
                  }}>Cancel</button>
                  <button onClick={submitFeedback} disabled={loading} style={{
                    flex: 2, padding: '12px', borderRadius: '12px',
                    background: 'linear-gradient(135deg, #6c5ce7, #9c6dfa)',
                    color: '#fff', border: 'none', cursor: 'pointer',
                    fontWeight: 600, opacity: loading ? 0.7 : 1
                  }}>{loading ? 'Submit ho raha hai...' : '👻 Anonymous Submit'}</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default FeedbackPage