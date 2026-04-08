'use client'

import { useState } from 'react'
import { suppliers, paymentHistory, batches } from '@/data/mockData'

const c = {
  vanilla: '#F8F4EE',
  softDune: '#E4DDCC',
  taupe: '#C5B49D',
  umber: '#443A35',
  black: '#252525',
}

function Card({ children, style }) {
  return <div style={{ backgroundColor: '#fff', border: `1px solid ${c.softDune}`, borderRadius: '6px', padding: '24px', ...style }}>{children}</div>
}

function SectionTitle({ children }) {
  return <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: '600', color: c.umber, marginBottom: '14px', letterSpacing: '0.01em' }}>{children}</h3>
}

function InfoRow({ label, value }) {
  return (
    <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', fontFamily: 'var(--font-body)', fontSize: '13px' }}>
      <span style={{ color: c.taupe, width: '140px', flexShrink: 0 }}>{label}</span>
      <span style={{ color: c.black, fontWeight: '500' }}>{value}</span>
    </div>
  )
}

function PaymentTypeBadge({ type }) {
  const isDeposit = type === 'deposit'
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: '3px',
      fontSize: '11px',
      fontWeight: '600',
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
      backgroundColor: isDeposit ? c.softDune : '#eaf4ee',
      color: isDeposit ? c.umber : '#2d6a4f',
    }}>
      {isDeposit ? 'Deposit' : 'Final'}
    </span>
  )
}

function SupplierCard({ supplier }) {
  const history = paymentHistory[supplier.id] || []
  const paid = history.filter(p => p.date !== null)
  const pending = history.filter(p => p.date === null)
  const totalPaid = paid.reduce((s, p) => s + p.amount, 0)

  // Cost history per product
  const supplierBatches = batches.filter(b =>
    b.packagingCost.supplierId === supplier.id || b.liquidCost.supplierId === supplier.id
  )
  const costsByProduct = {}
  supplierBatches.forEach(b => {
    const cost = b.packagingCost.supplierId === supplier.id ? b.packagingCost : b.liquidCost
    if (!costsByProduct[b.productId]) costsByProduct[b.productId] = []
    costsByProduct[b.productId].push({ batchNumber: b.batchNumber, perUnit: cost.perUnit, date: b.orderDate })
  })

  return (
    <div style={{ marginBottom: '36px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
        <div style={{
          width: '48px',
          height: '48px',
          backgroundColor: c.umber,
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-heading)',
          fontSize: '18px',
          fontWeight: '700',
          color: c.vanilla,
        }}>
          {supplier.name.charAt(0)}
        </div>
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: '600', color: c.umber }}>{supplier.name}</h2>
          <span style={{
            display: 'inline-block',
            padding: '2px 10px',
            borderRadius: '3px',
            fontSize: '11px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            backgroundColor: supplier.type === 'packaging' ? c.softDune : '#eef2ff',
            color: supplier.type === 'packaging' ? c.umber : '#4338ca',
            marginTop: '4px',
          }}>
            {supplier.type === 'packaging' ? 'Packaging' : 'Liquid / Filling'}
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
        {/* Profile */}
        <Card>
          <SectionTitle>Profile</SectionTitle>
          <InfoRow label="Contact" value={supplier.contact} />
          <InfoRow label="Email" value={supplier.email} />
          <InfoRow label="Phone" value={supplier.phone} />
          <InfoRow label="Address" value={supplier.address} />
          <InfoRow label="Payment Terms" value={supplier.paymentTerms} />
          <InfoRow label="Currency" value={supplier.currency} />
          <InfoRow label="Lead Time" value={`${supplier.leadTimeDays} days`} />
          <InfoRow label="Rating" value={`${supplier.rating} / 5.0 ★`} />
        </Card>

        {/* Payment Summary */}
        <Card>
          <SectionTitle>Payment Summary</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
            {[
              { label: 'Total Paid', value: `$${totalPaid.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, color: '#2d6a4f' },
              { label: 'Outstanding', value: `$${pending.reduce((s, p) => s + p.amount, 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`, color: '#856404' },
              { label: 'Paid Transactions', value: paid.length.toString(), color: c.umber },
              { label: 'Pending Transactions', value: pending.length.toString(), color: pending.length > 0 ? '#856404' : c.taupe },
            ].map(stat => (
              <div key={stat.label} style={{ backgroundColor: c.vanilla, borderRadius: '4px', padding: '14px' }}>
                <div style={{ fontSize: '11px', color: c.taupe, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px', fontFamily: 'var(--font-body)' }}>{stat.label}</div>
                <div style={{ fontSize: '20px', fontWeight: '600', color: stat.color, fontFamily: 'var(--font-heading)' }}>{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Cost history per product */}
          <SectionTitle>Cost Per Unit by Product</SectionTitle>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-body)', fontSize: '12px' }}>
            <thead>
              <tr>
                {['Product', 'Batch', 'Date', '$/Unit'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '6px 0', color: c.taupe, fontWeight: '500', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: `1px solid ${c.softDune}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(costsByProduct).flatMap(([pid, items]) =>
                items.map((item, j) => (
                  <tr key={`${pid}-${j}`} style={{ borderBottom: `1px solid ${c.softDune}` }}>
                    <td style={{ padding: '7px 0', color: c.black }}>{pid}</td>
                    <td style={{ padding: '7px 0', color: c.umber, fontWeight: '500' }}>{item.batchNumber}</td>
                    <td style={{ padding: '7px 0', color: c.taupe }}>{item.date}</td>
                    <td style={{ padding: '7px 0', fontWeight: '600', color: c.black }}>${item.perUnit.toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Card>
      </div>

      {/* Payment History */}
      <Card style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px 0' }}>
          <SectionTitle>Payment History</SectionTitle>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-body)', fontSize: '13px' }}>
          <thead>
            <tr style={{ backgroundColor: c.softDune }}>
              {['Date', 'Batch', 'Type', 'Amount (USD)', 'Method', 'Reference'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '10px 16px', color: c.umber, fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...history].reverse().map((p, i) => (
              <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#fff' : c.vanilla, borderBottom: `1px solid ${c.softDune}` }}>
                <td style={{ padding: '11px 16px', color: p.date ? c.black : '#856404', fontWeight: p.date ? '400' : '500' }}>{p.date || 'Pending'}</td>
                <td style={{ padding: '11px 16px', color: c.umber, fontWeight: '500' }}>{p.batchNumber}</td>
                <td style={{ padding: '11px 16px' }}><PaymentTypeBadge type={p.type} /></td>
                <td style={{ padding: '11px 16px', fontWeight: '600', color: p.date ? c.black : '#856404' }}>
                  ${p.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
                <td style={{ padding: '11px 16px', color: c.taupe }}>{p.method}</td>
                <td style={{ padding: '11px 16px', color: c.taupe, fontFamily: 'monospace', fontSize: '12px' }}>{p.ref}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <div style={{ height: '1px', backgroundColor: c.softDune, margin: '36px 0' }} />
    </div>
  )
}

export default function SuppliersPage() {
  const [activeId, setActiveId] = useState(suppliers[0].id)
  const activeSupplier = suppliers.find(s => s.id === activeId)

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '32px', fontWeight: '600', color: c.umber }}>Suppliers</h1>
        <p style={{ marginTop: '6px', fontSize: '14px', color: c.taupe }}>Supplier profiles, payment history, and per-unit cost tracking</p>
      </div>

      {/* Supplier selector */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
        {suppliers.map(s => (
          <button
            key={s.id}
            onClick={() => setActiveId(s.id)}
            style={{
              padding: '12px 24px',
              backgroundColor: activeId === s.id ? c.umber : '#fff',
              color: activeId === s.id ? c.vanilla : c.umber,
              border: `1px solid ${activeId === s.id ? c.umber : c.softDune}`,
              borderRadius: '6px',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              textAlign: 'left',
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{ fontSize: '13px', fontWeight: '600' }}>{s.name}</div>
            <div style={{ fontSize: '11px', marginTop: '3px', opacity: 0.7, textTransform: 'capitalize' }}>
              {s.type === 'packaging' ? 'Packaging' : 'Liquid / Filling'}
            </div>
          </button>
        ))}
      </div>

      <SupplierCard supplier={activeSupplier} />
    </div>
  )
}
