'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/', label: 'Dashboard', icon: '▦' },
  { href: '/batches', label: 'Batch Orders', icon: '⊞' },
  { href: '/inventory', label: 'Inventory', icon: '⊟' },
  { href: '/suppliers', label: 'Suppliers', icon: '◈' },
  { href: '/costs', label: 'Cost Analysis', icon: '◎' },
  { href: '/documents', label: 'Documents', icon: '◻' },
  { href: '/settings', label: 'Settings', icon: '◇' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '240px',
      height: '100vh',
      backgroundColor: '#443A35',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 100,
      overflowY: 'auto',
    }}>
      {/* Brand */}
      <div style={{
        padding: '32px 24px 24px',
        borderBottom: '1px solid rgba(197,180,157,0.2)',
      }}>
        <div style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '22px',
          fontWeight: '600',
          color: '#F8F4EE',
          lineHeight: 1.2,
          marginBottom: '5px',
        }}>
          ARDA Supply
        </div>
        <div style={{
          fontSize: '11px',
          color: '#C5B49D',
          fontFamily: 'var(--font-body)',
          fontWeight: '300',
          letterSpacing: '0.02em',
        }}>
          powered by KMT AI
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ padding: '16px 0', flex: 1 }}>
        {navItems.map(item => {
          const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '11px 24px',
                textDecoration: 'none',
                color: isActive ? '#F8F4EE' : 'rgba(248,244,238,0.6)',
                backgroundColor: isActive ? 'rgba(197,180,157,0.18)' : 'transparent',
                borderLeft: isActive ? '2px solid #C5B49D' : '2px solid transparent',
                fontFamily: 'var(--font-body)',
                fontSize: '13.5px',
                fontWeight: isActive ? '500' : '400',
                letterSpacing: '0.01em',
                transition: 'all 0.15s ease',
              }}
            >
              <span style={{ fontSize: '14px', opacity: isActive ? 1 : 0.7 }}>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div style={{
        padding: '20px 24px',
        borderTop: '1px solid rgba(197,180,157,0.2)',
        fontFamily: 'var(--font-body)',
        fontSize: '11px',
        color: 'rgba(197,180,157,0.6)',
        letterSpacing: '0.03em',
      }}>
        ARDA Supply v1.0<br />
        <span style={{ color: 'rgba(197,180,157,0.4)' }}>Mock data mode</span>
      </div>
    </aside>
  )
}
