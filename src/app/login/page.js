'use client'

import { useState } from 'react'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    if (password === process.env.NEXT_PUBLIC_ACCESS_PASSWORD) {
      document.cookie = 'arda_auth=true; path=/; max-age=86400'
      window.location.href = '/'
    } else {
      setError('Incorrect password')
      setLoading(false)
    }
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: '#F8F4EE',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
    }}>
      <div style={{ width: '320px' }}>
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '28px',
            fontWeight: '500',
            color: '#252525',
            marginBottom: '6px',
          }}>
            ARDA Supply
          </div>
          <div style={{
            fontFamily: 'var(--font-body)',
            fontSize: '11px',
            color: '#C5B49D',
            letterSpacing: '0.02em',
          }}>
            powered by KMT AI
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={e => { setPassword(e.target.value); setError('') }}
            placeholder="Enter password"
            autoFocus
            style={{
              display: 'block',
              width: '100%',
              padding: '10px 14px',
              border: `1px solid ${error ? '#dc3545' : '#E4DDCC'}`,
              borderRadius: '4px',
              fontSize: '13px',
              fontFamily: 'var(--font-body)',
              backgroundColor: '#fff',
              color: '#252525',
              outline: 'none',
              marginBottom: error ? '8px' : '12px',
              boxSizing: 'border-box',
            }}
          />

          {error && (
            <div style={{
              fontFamily: 'var(--font-body)',
              fontSize: '12px',
              color: '#721c24',
              marginBottom: '12px',
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            style={{
              display: 'block',
              width: '100%',
              padding: '10px',
              backgroundColor: '#443A35',
              color: '#F8F4EE',
              fontFamily: 'var(--font-body)',
              fontSize: '13px',
              fontWeight: '500',
              border: 'none',
              borderRadius: '4px',
              cursor: loading || !password ? 'not-allowed' : 'pointer',
              opacity: loading || !password ? 0.55 : 1,
            }}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
