import { useState, useEffect } from 'react'
import api from '../utils/api'

function ExchangesPage() {
  const [sent, setSent] = useState([])
  const [received, setReceived] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('received')

  useEffect(() => {
    fetchExchanges()
  }, [])

  const fetchExchanges = async () => {
    try {
      const res = await api.get('/exchanges/my')
      setSent(res.data.sent)
      setReceived(res.data.received)
    } catch (err) {
      console.log(err)
    }
    setLoading(false)
  }

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/exchanges/${id}`, { status })
      fetchExchanges()
    } catch (err) {
      alert(err.response?.data?.message || 'Error!')
    }
  }

  const statusColor = {
    pending: { bg: 'rgba(245,197,66,0.1)', border: 'rgba(245,197,66,0.2)', color: '#f5c542' },
    accepted: { bg: 'rgba(109,250,189,0.1)', border: 'rgba(109,250,189,0.2)', color: '#00b894' },
    rejected: { bg: 'rgba(250,109,139,0.1)', border: 'rgba(250,109,139,0.2)', color: '#e84393' }
  }

  const ExchangeCard = ({ exchange, type }) => {
    const other = type === 'sent' ? exchange.receiver : exchange.sender
    const s = statusColor[exchange.status]

    return (
      <div style={{
        background: '#ffffff',
        border: '1px solid rgba(0,0,0,0.08)',
        borderRadius: '20px', padding: '24px',
        marginBottom: '16px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #6c5ce7, #e84393)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Syne, sans-serif', fontWeight: 800, color: 'white'
            }}>
              {other?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{other?.name}</div>
              <div style={{ color: 'rgba(26,26,46,0.4)', fontSize: '0.78rem' }}>
                {new Date(exchange.createdAt).toLocaleDateString('en-IN')}
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div style={{
            padding: '4px 12px', borderRadius: '100px',
            background: s.bg, border: `1px solid ${s.border}`,
            color: s.color, fontSize: '0.75rem', fontWeight: 600
          }}>
            {exchange.status === 'pending' ? '⏳ Pending' :
             exchange.status === 'accepted' ? '✅ Accepted' : '❌ Rejected'}
          </div>
        </div>

        {/* Skills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <span style={{
            padding: '6px 14px', borderRadius: '10px',
            background: 'rgba(109,250,189,0.08)',
            border: '1px solid rgba(109,250,189,0.15)',
            color: '#00b894', fontSize: '0.82rem'
          }}>🎯 {exchange.skillOffered}</span>
          <span style={{ color: 'rgba(26,26,46,0.3)', fontSize: '1.2rem' }}>⇄</span>
          <span style={{
            padding: '6px 14px', borderRadius: '10px',
            background: 'rgba(124,109,250,0.08)',
            border: '1px solid rgba(124,109,250,0.15)',
            color: '#6c5ce7', fontSize: '0.82rem'
          }}>🌱 {exchange.skillWanted}</span>
        </div>

        {/* Message */}
        {exchange.message && (
          <div style={{
            padding: '12px 16px', borderRadius: '12px',
            background: 'rgba(255,255,255,0.03)',
            color: 'rgba(5, 5, 28, 0.5)', fontSize: '0.85rem',
            fontStyle: 'italic', marginBottom: '16px'
          }}>
            "{exchange.message}"
          </div>
        )}

        {/* Accept/Reject Buttons */}
        {type === 'received' && exchange.status === 'pending' && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => updateStatus(exchange._id, 'accepted')} style={{
              flex: 1, padding: '10px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #00b894, #4ddb9d)',
              color: '#f0f2ff', border: 'none', cursor: 'pointer',
              fontSize: '0.88rem', fontWeight: 700
            }}>✅ Accept</button>
            <button onClick={() => updateStatus(exchange._id, 'rejected')} style={{
              flex: 1, padding: '10px', borderRadius: '10px',
              background: 'rgba(250,109,139,0.1)',
              border: '1px solid rgba(250,109,139,0.2)',
              color: '#e84393', cursor: 'pointer',
              fontSize: '0.88rem', fontWeight: 600
            }}>❌ Reject</button>
          </div>
        )}

        {/* Google Meet Link */}
        {exchange.status === 'accepted' && (
          <a
            href="https://meet.google.com/new"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '8px', width: '100%', padding: '10px', borderRadius: '10px',
              background: 'rgba(109,250,189,0.1)',
              border: '1px solid rgba(109,250,189,0.2)',
              color: '#00b894', textDecoration: 'none',
              fontSize: '0.88rem', fontWeight: 600, marginTop: '10px',
              boxSizing: 'border-box'
            }}
          >
            🎥 Google Meet Join Karo
          </a>
        )}
      </div>
    )
  }

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh', padding: '100px 60px 60px' }}>

      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: '#6c5ce7', marginBottom: '12px' }}>
          Exchanges
        </div>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-1.5px' }}>
          Skill Exchanges 🔄
        </h1>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '32px', background: '#ffffff', padding: '4px', borderRadius: '12px', width: 'fit-content' }}>
        {['received', 'sent'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '10px 24px', borderRadius: '10px', border: 'none',
            background: tab === t ? 'linear-gradient(135deg, #6c5ce7, #9c6dfa)' : 'transparent',
            color: tab === t ? '#fff' : 'rgba(26,26,46,0.4)',
            cursor: 'pointer', fontSize: '0.88rem', fontWeight: 600,
            textTransform: 'capitalize'
          }}>
            {t === 'received' ? `📥 Received (${received.length})` : `📤 Sent (${sent.length})`}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ textAlign: 'center', color: 'rgba(26,26,46,0.4)', padding: '60px' }}>
          Loading...
        </div>
      ) : (
        <div style={{ maxWidth: '700px' }}>
          {tab === 'received' && (
            received.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', color: 'rgba(26,26,46,0.3)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📥</div>
                Abhi koi request nahi aayi
              </div>
            ) : received.map(e => <ExchangeCard key={e._id} exchange={e} type="received" />)
          )}
          {tab === 'sent' && (
            sent.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', color: 'rgba(26,26,46,0.3)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📤</div>
                Abhi koi request nahi bheji
              </div>
            ) : sent.map(e => <ExchangeCard key={e._id} exchange={e} type="sent" />)
          )}
        </div>
      )}
    </div>
  )
}

export default ExchangesPage