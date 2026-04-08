'use client'

import { useState } from 'react'
import { batches, products, stockLevels } from '@/data/mockData'

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

function StatusBadge({ status }) {
  const map = {
    received: { bg: '#eaf4ee', color: '#2d6a4f', label: 'Received' },
    'in-transit': { bg: c.softDune, color: c.umber, label: 'In Transit' },
    pending: { bg: '#fff3cd', color: '#856404', label: 'Pending' },
    ok: { bg: '#eaf4ee', color: '#2d6a4f', label: 'OK' },
    low: { bg: '#fff3cd', color: '#856404', label: 'Low Stock' },
    out: { bg: '#f8d7da', color: '#721c24', label: 'Out of Stock' },
  }
  const s = map[status] || map.pending
  return <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: '3px', fontSize: '11px', fontWeight: '600', letterSpacing: '0.06em', textTransform: 'uppercase', backgroundColor: s.bg, color: s.color }}>{s.label}</span>
}

function ReceiveModal({ batch, onClose }) {
  const [units, setUnits] = useState(batch.totalUnits)
  const [date, setDate] = useState(new Date('2026-04-08').toISOString().split('T')[0])
  const [done, setDone] = useState(false)

  const handleReceive = () => {
    setDone(true)
    setTimeout(onClose, 2000)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(37,37,37,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '32px', width: '420px', maxWidth: '90vw', border: `1px solid ${c.softDune}` }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', color: c.umber, marginBottom: '8px' }}>Receive Stock</h3>
        <p style={{ fontSize: '13px', color: c.taupe, marginBottom: '24px', fontFamily: 'var(--font-body)' }}>Batch {batch.batchNumber} · {batch.productName}</p>
        {done ? (
          <div style={{ backgroundColor: '#eaf4ee', border: '1px solid #2d6a4f', borderRadius: '4px', padding: '16px', color: '#2d6a4f', fontSize: '14px', fontFamily: 'var(--font-body)' }}>
            ✓ {units} units received and added to inventory.
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '11px', fontWeight: '500', color: c.taupe, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' }}>Units Received</label>
              <input type="number" min="1" max={batch.totalUnits} value={units} onChange={e => setUnits(e.target.value)} style={{ width: '100%', padding: '9px 12px', border: `1px solid ${c.softDune}`, borderRadius: '4px', fontSize: '13px', fontFamily: 'var(--font-body)' }} />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '11px', fontWeight: '500', color: c.taupe, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' }}>Date Received</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ width: '100%', padding: '9px 12px', border: `1px solid ${c.softDune}`, borderRadius: '4px', fontSize: '13px', fontFamily: 'var(--font-body)' }} />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={handleReceive} style={{ flex: 1, padding: '10px', backgroundColor: c.umber, color: c.vanilla, border: 'none', borderRadius: '4px', fontSize: '13px', fontWeight: '500', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                Confirm Receipt
              </button>
              <button onClick={onClose} style={{ padding: '10px 16px', backgroundColor: 'transparent', color: c.umber, border: `1px solid ${c.taupe}`, borderRadius: '4px', fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function InventoryPage() {
  const [selectedProduct, setSelectedProduct] = useState('all')
  const [receivingBatch, setReceivingBatch] = useState(null)

  const filtered = selectedProduct === 'all' ? products : products.filter(p => p.id === selectedProduct)

  return (
    <div>
      <div style={{ marginBottom: '36px' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '32px', fontWeight: '600', color: c.umber }}>Inventory</h1>
        <p style={{ marginTop: '6px', fontSize: '14px', color: c.taupe }}>FIFO batch tracking · Units remaining per batch · Receive incoming stock</p>
      </div>

      {/* Stock summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: '32px' }}>
        {stockLevels.map(sl => (
          <button key={sl.id} onClick={() => setSelectedProduct(selectedProduct === sl.id ? 'all' : sl.id)} style={{
            backgroundColor: selectedProduct === sl.id ? c.umber : '#fff',
            border: `1px solid ${selectedProduct === sl.id ? c.umber : c.softDune}`,
            borderRadius: '6px',
            padding: '16px',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.15s ease',
          }}>
            <div style={{ fontSize: '10px', color: selectedProduct === sl.id ? c.taupe : c.taupe, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px', fontFamily: 'var(--font-body)' }}>{sl.id}</div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '14px', fontWeight: '600', color: selectedProduct === sl.id ? c.vanilla : c.umber, marginBottom: '8px' }}>{sl.name}</div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: '600', color: selectedProduct === sl.id ? c.vanilla : c.black }}>{sl.totalUnits.toLocaleString()}</div>
            <div style={{ fontSize: '11px', color: selectedProduct === sl.id ? 'rgba(248,244,238,0.6)' : c.taupe, marginTop: '2px', fontFamily: 'var(--font-body)' }}>units</div>
            <div style={{ marginTop: '10px' }}>
              <StatusBadge status={sl.status} />
            </div>
          </button>
        ))}
      </div>

      {/* Batches per product */}
      {filtered.map(product => {
        const productBatches = batches.filter(b => b.productId === product.id)
        const sl = stockLevels.find(s => s.id === product.id)

        return (
          <div key={product.id} style={{ marginBottom: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: '600', color: c.umber }}>
                {product.id} — {product.name}
              </h2>
              <StatusBadge status={sl.status} />
              <span style={{ fontSize: '13px', color: c.taupe, fontFamily: 'var(--font-body)' }}>
                {sl.totalUnits.toLocaleString()} units in stock · Reorder at {product.reorderThreshold}
              </span>
            </div>

            <Card style={{ padding: '0', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-body)', fontSize: '13px' }}>
                <thead>
                  <tr style={{ backgroundColor: c.softDune }}>
                    {['Batch', 'Ordered', 'Received', 'Total Units', 'Units Remaining', 'Units Sold', 'FIFO Status', 'WAC/Unit', 'Batch Status', 'Actions'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '11px 16px', color: c.umber, fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {productBatches.map((b, i) => {
                    const unitsSold = b.status === 'received' ? b.totalUnits - b.unitsRemaining : 0
                    return (
                      <tr key={b.id} style={{ backgroundColor: i % 2 === 0 ? '#fff' : c.vanilla, borderBottom: `1px solid ${c.softDune}` }}>
                        <td style={{ padding: '13px 16px', fontWeight: '600', color: c.umber }}>{b.batchNumber}</td>
                        <td style={{ padding: '13px 16px', color: c.black }}>{b.orderDate}</td>
                        <td style={{ padding: '13px 16px', color: b.receivedDate ? c.black : c.taupe }}>{b.receivedDate || '—'}</td>
                        <td style={{ padding: '13px 16px', color: c.black, fontWeight: '500' }}>{b.totalUnits.toLocaleString()}</td>
                        <td style={{ padding: '13px 16px' }}>
                          {b.status === 'received' ? (
                            <span style={{ fontWeight: '600', color: b.unitsRemaining < 200 ? '#856404' : c.black }}>
                              {b.unitsRemaining.toLocaleString()}
                            </span>
                          ) : <span style={{ color: c.taupe }}>—</span>}
                        </td>
                        <td style={{ padding: '13px 16px', color: c.black }}>{unitsSold > 0 ? unitsSold.toLocaleString() : '—'}</td>
                        <td style={{ padding: '13px 16px' }}>
                          {b.status === 'received' ? (
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              fontSize: '12px',
                              color: b.isFifoActive ? '#2d6a4f' : c.taupe,
                              fontWeight: b.isFifoActive ? '600' : '400',
                            }}>
                              {b.isFifoActive ? '● Active' : '○ Queued'}
                            </span>
                          ) : <span style={{ color: c.taupe, fontSize: '12px' }}>—</span>}
                        </td>
                        <td style={{ padding: '13px 16px', color: c.umber, fontWeight: '600' }}>
                          ${b.weightedAvgCost.toFixed(2)}
                        </td>
                        <td style={{ padding: '13px 16px' }}><StatusBadge status={b.status} /></td>
                        <td style={{ padding: '13px 16px' }}>
                          {b.status === 'in-transit' && (
                            <button onClick={() => setReceivingBatch(b)} style={{
                              padding: '5px 12px',
                              backgroundColor: c.umber,
                              color: c.vanilla,
                              border: 'none',
                              borderRadius: '4px',
                              fontSize: '12px',
                              cursor: 'pointer',
                              fontFamily: 'var(--font-body)',
                              whiteSpace: 'nowrap',
                            }}>
                              Receive
                            </button>
                          )}
                          {b.status === 'received' && (
                            <span style={{ fontSize: '12px', color: c.taupe }}>—</span>
                          )}
                          {b.status === 'pending' && (
                            <span style={{ fontSize: '12px', color: c.taupe }}>Awaiting order</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </Card>
          </div>
        )
      })}

      {receivingBatch && <ReceiveModal batch={receivingBatch} onClose={() => setReceivingBatch(null)} />}
    </div>
  )
}
