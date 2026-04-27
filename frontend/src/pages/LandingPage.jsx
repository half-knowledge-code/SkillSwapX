import { Link } from 'react-router-dom'

const skills = ['⚛️ React.js', '🎨 UI Design', '🐍 Python', '📸 Photography', '🎵 Music', '✍️ Copywriting', '🎬 Video Editing', '📊 Data Science']

function LandingPage() {
  return (
    <div style={{ paddingTop: '80px' }}>

      {/* HERO */}
      <section style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center',
        padding: '60px 24px', position: 'relative'
      }}>
        {/* Glow */}
        <div style={{
          position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)',
          width: '600px', height: '300px', pointerEvents: 'none',
          background: 'radial-gradient(ellipse, rgba(124,109,250,0.2) 0%, rgba(250,109,139,0.1) 40%, transparent 70%)'
        }} />

        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'rgba(124,109,250,0.12)',
          border: '1px solid rgba(124,109,250,0.3)',
          padding: '6px 16px', borderRadius: '100px',
          fontSize: '0.8rem', color: '#6c5ce7', fontWeight: 500, marginBottom: '32px'
        }}>
          <span style={{
            width: '6px', height: '6px', borderRadius: '50%',
            background: '#00b894', display: 'inline-block'
          }} />
          Now in Beta — Join 2,800+ learners
        </div>

        {/* Heading */}
        <h1 style={{
          fontSize: 'clamp(2.8rem, 7vw, 5.5rem)', fontWeight: 800,
          fontFamily: 'Syne, sans-serif', lineHeight: 1.05,
          letterSpacing: '-2px', maxWidth: '900px', marginBottom: '24px',
          position: 'relative', zIndex: 1
        }}>
          Exchange Skills.<br />
          <span style={{
            background: 'linear-gradient(135deg, #6c5ce7 0%, #e84393 50%, #00b894 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>Grow Together.</span>
        </h1>

        {/* Subtext */}
        <p style={{
          fontSize: '1.15rem', color: 'rgba(240,240,248,0.5)',
          maxWidth: '520px', lineHeight: 1.7, marginBottom: '44px',
          fontWeight: 300, position: 'relative', zIndex: 1
        }}>
          No money. No barriers. Just people sharing what they know — and learning what they don't.
        </p>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center', zIndex: 1, position: 'relative' }}>
          <Link to="/register" style={{
            padding: '14px 32px', borderRadius: '14px',
            background: 'linear-gradient(135deg, #6c5ce7, #9c6dfa)',
            color: '#fff', fontSize: '1rem', fontWeight: 600,
            textDecoration: 'none'
          }}>Start Exchanging Skills →</Link>

          <Link to="/matching" style={{
            padding: '14px 32px', borderRadius: '14px',
            border: '1px solid rgba(0,0,0,0.08)',
            background: '#ffffff', color: '#1a1a2e',
            fontSize: '1rem', fontWeight: 500, textDecoration: 'none'
          }}>Browse Skills</Link>
        </div>

        {/* Skill Pills */}
        <div style={{
          display: 'flex', gap: '12px', flexWrap: 'wrap',
          justifyContent: 'center', marginTop: '60px', zIndex: 1, position: 'relative'
        }}>
          {skills.map(skill => (
            <div key={skill} style={{
              padding: '8px 16px', borderRadius: '100px',
              border: '1px solid rgba(0,0,0,0.08)',
              background: '#ffffff', fontSize: '0.82rem',
              color: 'rgba(26,26,46,0.6)', fontWeight: 500
            }}>{skill}</div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <div style={{
        display: 'flex', justifyContent: 'center', gap: '64px',
        padding: '48px 60px', flexWrap: 'wrap',
        background: '#ffffff',
        borderTop: '1px solid rgba(0,0,0,0.08)',
        borderBottom: '1px solid rgba(0,0,0,0.08)'
      }}>
        {[
          { num: '2.8K+', label: 'Active Learners' },
          { num: '140+', label: 'Skills Available' },
          { num: '5.2K', label: 'Exchanges Completed' },
          { num: '4.9★', label: 'Avg. Rating' }
        ].map(s => (
          <div key={s.label} style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: 'Syne, sans-serif', fontSize: '2.4rem', fontWeight: 800,
              background: 'linear-gradient(135deg, #6c5ce7, #00b894)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>{s.num}</div>
            <div style={{ fontSize: '0.85rem', color: 'rgba(26,26,46,0.5)', marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* HOW IT WORKS */}
      <section style={{ padding: '100px 60px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: '#6c5ce7', marginBottom: '16px' }}>How It Works</div>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-1.5px', marginBottom: '16px' }}>Simple as 1, 2, 3</h2>
        <p style={{ color: 'rgba(26,26,46,0.5)', fontSize: '1rem', lineHeight: 1.7, maxWidth: '480px', marginBottom: '64px', fontWeight: 300 }}>
          From profile setup to skill exchange — get started in minutes.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
          {[
            { num: '01', icon: '👤', title: 'Build Your Profile', desc: 'List skills you can teach and skills you want to learn.' },
            { num: '02', icon: '🧠', title: 'Get Matched', desc: 'Our algorithm finds people with complementary skills.' },
            { num: '03', icon: '🔄', title: 'Send a Request', desc: 'Propose an exchange — both parties accept before starting.' },
            { num: '04', icon: '💬', title: 'Learn & Chat', desc: 'Use built-in real-time chat to coordinate sessions.' },
            { num: '05', icon: '⭐', title: 'Give Feedback', desc: 'Leave anonymous honest feedback after the exchange.' },
            { num: '06', icon: '🏆', title: 'Build Reputation', desc: 'Earn XP, badges, and rise the leaderboard.' },
          ].map(step => (
            <div key={step.num} style={{
              background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)',
              borderRadius: '20px', padding: '32px', transition: 'all 0.3s'
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(124,109,250,0.3)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)'}
            >
              <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '3rem', fontWeight: 800, color: 'rgba(124,109,250,0.12)', lineHeight: 1, marginBottom: '20px' }}>{step.num}</div>
              <div style={{ fontSize: '1.8rem', marginBottom: '16px' }}>{step.icon}</div>
              <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.1rem', fontWeight: 700, marginBottom: '10px' }}>{step.title}</h3>
              <p style={{ color: 'rgba(26,26,46,0.5)', fontSize: '0.9rem', lineHeight: 1.6, fontWeight: 300 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        textAlign: 'center', padding: '120px 60px', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          width: '500px', height: '250px', pointerEvents: 'none',
          background: 'radial-gradient(ellipse, rgba(124,109,250,0.15) 0%, transparent 70%)'
        }} />
        <h2 style={{
          fontFamily: 'Syne, sans-serif', fontSize: 'clamp(2rem, 5vw, 4rem)',
          fontWeight: 800, letterSpacing: '-2px', marginBottom: '20px', position: 'relative'
        }}>
          Ready to start<br />
          <span style={{
            background: 'linear-gradient(135deg, #6c5ce7, #e84393)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>swapping skills?</span>
        </h2>
        <p style={{ color: 'rgba(26,26,46,0.5)', fontSize: '1.05rem', marginBottom: '44px', position: 'relative' }}>
          Join thousands of learners already exchanging knowledge.
        </p>
        <Link to="/register" style={{
          padding: '14px 40px', borderRadius: '14px',
          background: 'linear-gradient(135deg, #6c5ce7, #9c6dfa)',
          color: '#fff', fontSize: '1rem', fontWeight: 600, textDecoration: 'none',
          position: 'relative'
        }}>Create Free Account →</Link>
      </section>

    </div>
  )
}

export default LandingPage