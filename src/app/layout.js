import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import './globals.css'
import Sidebar from '@/components/Sidebar'
import ClientLayout from '@/components/ClientLayout'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-heading',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-body',
})

export const metadata = {
  title: 'ARDA Supply',
  description: 'Inventory and supply chain management for ARDA Rituals',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body style={{
        fontFamily: 'var(--font-body)',
        backgroundColor: '#F8F4EE',
        color: '#252525',
        minHeight: '100vh',
      }}>
        <Sidebar />
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}
