import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { useSearchParams } from 'react-router-dom'
import { io } from 'socket.io-client'
import api from '../utils/api'

const socket = io('http://localhost:5000')

function ChatPage() {
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [onlineUsers, setOnlineUsers] = useState([])
  const messagesEndRef = useRef(null)

  useEffect(() => {
    fetchUsers()
    if (user) {
      socket.emit('user_online', user.id)
    }

    socket.on('receive_message', (message) => {
      setMessages(prev => [...prev, message])
    })

    socket.on('message_sent', (message) => {
      setMessages(prev => [...prev, message])
    })

    socket.on('online_users', (users) => {
      setOnlineUsers(users)
    })

    return () => {
      socket.off('receive_message')
      socket.off('message_sent')
      socket.off('online_users')
    }
  }, [user])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (selectedUser) fetchMessages(selectedUser._id)
  }, [selectedUser])

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users')
      setUsers(res.data.users)
    } catch (err) {
      console.log(err)
    }
  }

  const fetchMessages = async (userId) => {
    try {
      const res = await api.get(`/chat/${userId}`)
      setMessages(res.data.messages)
    } catch (err) {
      console.log(err)
    }
  }

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedUser) return
    socket.emit('send_message', {
      senderId: user.id,
      receiverId: selectedUser._id,
      message: newMessage.trim()
    })
    setNewMessage('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div style={{ paddingTop: '80px', height: '100vh', display: 'flex' }}>

      {/* Sidebar — Users List */}
      <div style={{
        width: '300px', background: '#ffffff',
        borderRight: '1px solid rgba(0,0,0,0.08)',
        display: 'flex', flexDirection: 'column', flexShrink: 0
      }}>
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.1rem' }}>
            💬 Messages
          </h2>
        </div>

        <div style={{ overflowY: 'auto', flex: 1 }}>
          {users.map(u => (
            <div key={u._id} onClick={() => setSelectedUser(u)} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '16px 20px', cursor: 'pointer',
              background: selectedUser?._id === u._id ? 'rgba(124,109,250,0.1)' : 'transparent',
              borderLeft: selectedUser?._id === u._id ? '3px solid #6c5ce7' : '3px solid transparent',
              transition: 'all 0.2s'
            }}>
              <div style={{ position: 'relative' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6c5ce7, #e84393)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Syne, sans-serif', fontWeight: 800, color: 'white', fontSize: '1rem'
                }}>
                  {u.name.charAt(0).toUpperCase()}
                </div>
                {onlineUsers.includes(u._id) && (
                  <div style={{
                    position: 'absolute', bottom: 0, right: 0,
                    width: '10px', height: '10px', borderRadius: '50%',
                    background: '#00b894', border: '2px solid #ffffff'
                  }} />
                )}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{u.name}</div>
                <div style={{ color: 'rgba(26,26,46,0.4)', fontSize: '0.75rem' }}>
                  {onlineUsers.includes(u._id) ? '🟢 Online' : '⚫ Offline'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div style={{
              padding: '20px 28px',
              background: '#ffffff',
              borderBottom: '1px solid rgba(0,0,0,0.08)',
              display: 'flex', alignItems: 'center', gap: '12px'
            }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #6c5ce7, #e84393)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Syne, sans-serif', fontWeight: 800, color: 'white'
              }}>
                {selectedUser.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 600 }}>{selectedUser.name}</div>
                <div style={{ fontSize: '0.75rem', color: onlineUsers.includes(selectedUser._id) ? '#00b894' : 'rgba(26,26,46,0.4)' }}>
                  {onlineUsers.includes(selectedUser._id) ? '🟢 Online' : '⚫ Offline'}
                </div>
              </div>
            </div>

            {/* Messages */}
            <div style={{
              flex: 1, overflowY: 'auto', padding: '24px 28px',
              display: 'flex', flexDirection: 'column', gap: '12px'
            }}>
              {messages.length === 0 && (
                <div style={{ textAlign: 'center', color: 'rgba(26,26,46,0.3)', marginTop: '60px' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>💬</div>
                  Pehla message bhejo!
                </div>
              )}
              {messages.map((msg, i) => {
                const isMine = msg.sender === user.id || msg.sender?._id === user.id
                return (
                  <div key={i} style={{
                    display: 'flex',
                    justifyContent: isMine ? 'flex-end' : 'flex-start'
                  }}>
                    <div style={{
                      maxWidth: '65%', padding: '12px 16px', borderRadius: '16px',
                      background: isMine
                        ? 'linear-gradient(135deg, #6c5ce7, #9c6dfa)'
                        : '#f0f2ff',
                      color: '#1a1a2e', fontSize: '0.9rem', lineHeight: 1.5,
                      borderBottomRightRadius: isMine ? '4px' : '16px',
                      borderBottomLeftRadius: isMine ? '16px' : '4px'
                    }}>
                      {msg.message}
                      <div style={{
                        fontSize: '0.68rem', marginTop: '4px',
                        color: isMine ? 'rgba(255,255,255,0.5)' : 'rgba(26,26,46,0.3)',
                        textAlign: 'right'
                      }}>
                        {new Date(msg.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div style={{
              padding: '20px 28px',
              background: '#ffffff',
              borderTop: '1px solid rgba(0,0,0,0.08)',
              display: 'flex', gap: '12px', alignItems: 'center'
            }}>
              <input
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message likho... (Enter se bhejo)"
                style={{
                  flex: 1, padding: '14px 18px', borderRadius: '14px',
                  background: '#f0f2ff',
                  border: '1px solid rgba(0,0,0,0.08)',
                  color: '#1a1a2e', fontSize: '0.95rem', outline: 'none'
                }}
              />
              <button onClick={sendMessage} style={{
                padding: '14px 24px', borderRadius: '14px',
                background: 'linear-gradient(135deg, #6c5ce7, #9c6dfa)',
                color: '#fff', border: 'none', cursor: 'pointer',
                fontSize: '1.1rem'
              }}>➤</button>
            </div>
          </>
        ) : (
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            color: 'rgba(26,26,46,0.3)'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>💬</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 500 }}>Kisi se baat karo</div>
            <div style={{ fontSize: '0.88rem', marginTop: '8px' }}>Left mein user select karo</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatPage