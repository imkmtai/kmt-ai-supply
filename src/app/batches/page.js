'use client'

import { useState } from 'react'
import { batches as importedBatches, products } from '@/data/mockData'

const c = {
  vanilla: '#F8F4EE',
  softDune: '#E4DDCC',
  taupe: '#C5B49D',
  umber: '#443A35',
  black: '#252525',
}

const btnPrimary = {
  backgroundColor: c.umber,
  color: c.vanilla,
  fontFamily: 'var(--font-body)',
  fontSize: '12px',
  fontWeight: '500',
  padding: '8px 16px',
  borderRadius: '4px',
  border: 'none',
  cursor: 'pointer',
}

const btnSecondary = {
  backgroundColor: 'transparent',
  color: c.umber,
  fontFamily: 'var(--font-body)',
  fontSize: '12px',
  fontWeight: '500',
  padding: '8px 16px',
  borderRadius: '4px',
  border: `1px solid ${c.taupe}`,
  cursor: 'pointer',
}

const thStyle = {
  textAlign: 'left',
  padding: '12px 0',
  paddingRight: '16px',
  fontSize: '11px',
  fontWeight: '600',
  color: c.taupe,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  whiteSpace: 'nowrap',
  fontFamily: 'var(--font-body)',
  borderBottom: `1px solid ${c.softDune}`,
}

const tdStyle = {
  padding: '12px 0',
  paddingRight: '16px',
  fontFamily: 'var(--font-body)',
  fontSize: '13.5px',
  fontWeight: '400',
  color: c.black,
  borderBottom: `1px solid ${c.softDune}`,
  verticalAlign: 'top',
}

const labelStyle = {
  fontSize: '11px',
  fontWeight: '600',
  color: c.taupe,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  marginBottom: '6px',
  display: 'block',
  fontFamily: 'var(--font-body)',
}

const inputStyle = {
  width: '100%',
  padding: '9px 12px',
  border: `1px solid ${c.softDune}`,
  borderRadius: '4px',
  fontSize: '13px',
  backgroundColor: '#fff',
  color: c.black,
  fontFamily: 'var(--font-body)',
  outline: 'none',
}

// ─── Product prefix map ────────────────────────────────────────
const PRODUCT_PREFIX = {
  'AR-001': 'SM',
  'AR-002': 'GO',
  'AR-003': 'BL',
  'AR-004': 'HW',
  'AR-005': 'LB',
}

// ─── Extra mock batches for AR-003, AR-004, AR-005 ────────────
const EXTRA_BATCHES = [
  {
    id: 'BATCH-003',
    productId: 'AR-003',
    productName: 'Body Lotion',
    batchNumber: 'BL-2025-001',
    orderDate: '2025-02-15',
    status: 'received',
    totalUnits: 600,
    packagingCost: { perUnit: 1.80, depositPaid: true,  finalPaid: true  },
    liquidCost:    { perUnit: 7.70, depositPaid: true,  finalPaid: true  },
    weightedAvgCost: 9.50,
  },
  {
    id: 'BATCH-004',
    productId: 'AR-004',
    productName: 'Hand Wash',
    batchNumber: 'HW-2025-001',
    orderDate: '2025-04-05',
    status: 'in-transit',
    totalUnits: 400,
    packagingCost: { perUnit: 4.50, depositPaid: true,  finalPaid: false },
    liquidCost:    { perUnit: 17.50, depositPaid: false, finalPaid: false },
    weightedAvgCost: 22.00,
  },
  {
    id: 'BATCH-005',
    productId: 'AR-005',
    productName: 'Lip Balm',
    batchNumber: 'LB-2025-001',
    orderDate: '2025-05-10',
    status: 'pending',
    totalUnits: 800,
    packagingCost: { perUnit: 3.10, depositPaid: false, finalPaid: false },
    liquidCost:    { perUnit: 15.40, depositPaid: false, finalPaid: false },
    weightedAvgCost: 18.50,
  },
]

const allBatches = [...importedBatches, ...EXTRA_BATCHES]

// ─── Helpers ──────────────────────────────────────────────────
function generateBatchNumber(productId) {
  const prefix = PRODUCT_PREFIX[productId]
  if (!prefix) return ''
  const count = allBatches.filter(b => b.productId === productId).length
  const seq = String(count + 1).padStart(3, '0')
  return `${prefix}-2026-${seq}`
}

function initPayStates() {
  const states = {}
  allBatches.forEach(b => {
    states[b.id] = {
      cairoDep:   b.packagingCost.depositPaid,
      cairoFinal: b.packagingCost.finalPaid,
      deltaDep:   b.liquidCost.depositPaid,
      deltaFinal: b.liquidCost.finalPaid,
    }
  })
  return states
}

function initStatusMap() {
  const map = {}
  allBatches.forEach(b => { map[b.id] = b.status })
  return map
}

const PAYMENT_KEYS = [
  { key: 'cairoDep',   short: 'Cairo Dep',   long: 'Cairo Deposit'  },
  { key: 'cairoFinal', short: 'Cairo Final',  long: 'Cairo Final'    },
  { key: 'deltaDep',   short: 'Delta Dep',    long: 'Delta Deposit'  },
  { key: 'deltaFinal', short: 'Delta Final',  long: 'Delta Final'    },
]

// ─── Payment 2×2 grid ─────────────────────────────────────────
function PaymentGrid({ batchId, batchNumber, payments, onMarkPaid }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', minWidth: '158px' }}>
      {PAYMENT_KEYS.map(({ key, short, long }) =>
        payments[key] ? (
          <span key={key} style={{
            display: 'block', padding: '2px 0', borderRadius: '3px',
            fontSize: '10px', fontWeight: '700', letterSpacing: '0.04em',
            textTransform: 'uppercase', fontFamily: 'var(--font-body)',
            backgroundColor: '#d4edda', color: '#155724',
            textAlign: 'center',
          }}>{short}</span>
        ) : (
          <button key={key} onClick={() => onMarkPaid(batchId, key, long, batchNumber)} style={{
            display: 'block', width: '100%', padding: '2px 0', borderRadius: '3px',
            fontSize: '10px', fontWeight: '700', letterSpacing: '0.04em',
            textTransform: 'uppercase', fontFamily: 'var(--font-body)',
            backgroundColor: '#fff3cd', color: '#856404',
            border: 'none', cursor: 'pointer', textAlign: 'center',
          }}>Mark Paid</button>
        )
      )}
    </div>
  )
}

// ─── Status select styled as pill ─────────────────────────────
const STATUS_STYLES = {
  received:    { backgroundColor: '#d4edda', color: '#155724' },
  'in-transit':{ backgroundColor: '#fff3cd', color: '#856404' },
  pending:     { backgroundColor: c.softDune, color: c.umber },
}

function StatusSelect({ value, onChange }) {
  const s = STATUS_STYLES[value] || STATUS_STYLES.pending
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          ...s,
          fontFamily: 'var(--font-body)',
          fontSize: '10px',
          fontWeight: '700',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          border: 'none',
          borderRadius: '3px',
          padding: '3px 20px 3px 8px',
          cursor: 'pointer',
          outline: 'none',
          appearance: 'none',
          WebkitAppearance: 'none',
        }}
      >
        <option value="pending">Pending</option>
        <option value="in-transit">In Transit</option>
        <option value="received">Received</option>
      </select>
      <span style={{
        position: 'absolute', right: '5px', top: '50%',
        transform: 'translateY(-50%)',
        pointerEvents: 'none', fontSize: '8px', lineHeight: 1,
        color: s.color,
      }}>▾</span>
    </div>
  )
}

// ─── Confirmation modal ───────────────────────────────────────
function ConfirmModal({ modal, onConfirm, onCancel }) {
  if (!modal) return null
  return (
    <>
      <div
        onClick={onCancel}
        style={{
          position: 'fixed', inset: 0,
          backgroundColor: 'rgba(37,37,37,0.22)',
          zIndex: 200,
        }}
      />
      <div style={{
        position: 'fixed',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#fff',
        border: `1px solid ${c.softDune}`,
        borderRadius: '6px',
        padding: '28px 24px 20px',
        zIndex: 300,
        width: '360px',
        fontFamily: 'var(--font-body)',
      }}>
        <div style={{ fontSize: '13.5px', color: c.black, marginBottom: '20px', lineHeight: 1.6 }}>
          Mark <strong>{modal.label}</strong> as paid for batch <strong>{modal.batchNumber}</strong>?
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={onConfirm} style={btnPrimary}>Confirm</button>
          <button onClick={onCancel} style={btnSecondary}>Cancel</button>
        </div>
      </div>
    </>
  )
}

// ─── Empty form ───────────────────────────────────────────────
const emptyForm = {
  productId: '', batchNumber: '', orderDate: '',
  totalUnits: '', packagingPerUnit: '', liquidPerUnit: '', notes: '',
}

// ─── Page ─────────────────────────────────────────────────────
export default function BatchesPage() {
  const [showForm, setShowForm]       = useState(false)
  const [form, setForm]               = useState(emptyForm)
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterProduct, setFilterProduct] = useState('all')
  const [submitted, setSubmitted]     = useState(false)
  const [payStates, setPayStates]     = useState(initPayStates)
  const [statusMap, setStatusMap]     = useState(initStatusMap)
  const [confirmModal, setConfirmModal] = useState(null)

  const filtered = allBatches.filter(b => {
    const status = statusMap[b.id]
    if (filterStatus !== 'all' && status !== filterStatus) return false
    if (filterProduct !== 'all' && b.productId !== filterProduct) return false
    return true
  })

  function handleProductChange(productId) {
    setForm(f => ({ ...f, productId, batchNumber: generateBatchNumber(productId) }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => { setSubmitted(false); setShowForm(false); setForm(emptyForm) }, 2500)
  }

  function handleMarkPaid(batchId, key, label, batchNumber) {
    setConfirmModal({ batchId, key, label, batchNumber })
  }

  function handleConfirmPay() {
    const { batchId, key } = confirmModal
    setPayStates(prev => ({ ...prev, [batchId]: { ...prev[batchId], [key]: true } }))
    setConfirmModal(null)
  }

  function handleStatusChange(batchId, newStatus) {
    setStatusMap(prev => ({ ...prev, [batchId]: newStatus }))
  }

  const estWac = form.packagingPerUnit && form.liquidPerUnit
    ? (parseFloat(form.packagingPerUnit) + parseFloat(form.liquidPerUnit)).toFixed(2)
    : null

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', fontWeight: '500', color: '#252525' }}>
          Batch Orders
        </h1>
        <button onClick={() => setShowForm(!showForm)} style={showForm ? btnSecondary : btnPrimary}>
          {showForm ? '✕ Cancel' : '+ New Batch'}
        </button>
      </div>

      {/* New Batch Form */}
      {showForm && (
        <div style={{ border: `1px solid ${c.softDune}`, borderRadius: '4px', padding: '24px', marginBottom: '32px' }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: '500', color: '#252525', marginBottom: '20px' }}>
            New Batch Order
          </div>
          {submitted ? (
            <div style={{ backgroundColor: '#d4edda', border: '1px solid #2d6a4f', borderRadius: '4px', padding: '16px', color: '#155724', fontSize: '13.5px', fontFamily: 'var(--font-body)' }}>
              ✓ Batch order created successfully. (Mock — no data saved)
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={labelStyle}>Product *</label>
                  <select
                    required
                    style={{ ...inputStyle, cursor: 'pointer' }}
                    value={form.productId}
                    onChange={e => handleProductChange(e.target.value)}
                  >
                    <option value="">Select product</option>
                    {products.map(p => <option key={p.id} value={p.id}>{p.id} – {p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Batch Number</label>
                  <input
                    readOnly
                    style={{ ...inputStyle, backgroundColor: c.vanilla, color: form.batchNumber ? c.black : c.taupe, cursor: 'default' }}
                    value={form.batchNumber}
                    placeholder="Auto-generated on product select"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Order Date *</label>
                  <input required type="date" style={inputStyle} value={form.orderDate} onChange={e => setForm(f => ({ ...f, orderDate: e.target.value }))} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={labelStyle}>Total Units *</label>
                  <input required type="number" min="1" style={inputStyle} placeholder="e.g. 1000" value={form.totalUnits} onChange={e => setForm(f => ({ ...f, totalUnits: e.target.value }))} />
                </div>
                <div>
                  <label style={labelStyle}>Cairo Packaging – Per Unit Cost (USD) *</label>
                  <input required type="number" step="0.01" min="0" style={inputStyle} placeholder="e.g. 2.55" value={form.packagingPerUnit} onChange={e => setForm(f => ({ ...f, packagingPerUnit: e.target.value }))} />
                </div>
                <div>
                  <label style={labelStyle}>Delta Manufacturing – Per Unit Cost (USD) *</label>
                  <input required type="number" step="0.01" min="0" style={inputStyle} placeholder="e.g. 8.75" value={form.liquidPerUnit} onChange={e => setForm(f => ({ ...f, liquidPerUnit: e.target.value }))} />
                </div>
              </div>

              {estWac && (
                <div style={{ backgroundColor: c.softDune, borderRadius: '4px', padding: '12px 16px', marginBottom: '20px', fontSize: '13px', fontFamily: 'var(--font-body)', color: c.umber }}>
                  Estimated WAC per unit: <strong>${estWac}</strong>
                  {form.totalUnits && <> · Total batch cost: <strong>${(parseFloat(estWac) * parseFloat(form.totalUnits)).toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong></>}
                </div>
              )}

              <div style={{ marginBottom: '24px' }}>
                <label style={labelStyle}>Notes</label>
                <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '72px' }} placeholder="Any notes about this batch..." value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" style={btnPrimary}>Create Batch</button>
                <button type="button" onClick={() => setShowForm(false)} style={btnSecondary}>Cancel</button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', gap: '24px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: '11px', fontWeight: '600', color: c.taupe, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-body)', marginBottom: '6px' }}>Status</div>
          <div style={{ display: 'flex', gap: '1px' }}>
            {['all', 'received', 'in-transit', 'pending'].map(s => (
              <button key={s} onClick={() => setFilterStatus(s)} style={{
                padding: '6px 14px', fontSize: '12px',
                border: `1px solid ${c.softDune}`,
                backgroundColor: filterStatus === s ? c.umber : '#fff',
                color: filterStatus === s ? c.vanilla : c.black,
                cursor: 'pointer', fontFamily: 'var(--font-body)',
                textTransform: s === 'all' ? 'none' : 'capitalize',
                borderRadius: s === 'all' ? '4px 0 0 4px' : s === 'pending' ? '0 4px 4px 0' : '0',
              }}>{s === 'all' ? 'All' : s.replace('-', ' ')}</button>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '11px', fontWeight: '600', color: c.taupe, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-body)', marginBottom: '6px' }}>Product</div>
          <select style={{ ...inputStyle, width: 'auto', cursor: 'pointer' }} value={filterProduct} onChange={e => setFilterProduct(e.target.value)}>
            <option value="all">All products</option>
            {products.map(p => <option key={p.id} value={p.id}>{p.id} – {p.name}</option>)}
          </select>
        </div>
      </div>

      {/* Batches Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-body)', fontSize: '13.5px' }}>
        <thead>
          <tr>
            {['Batch', 'Product', 'Order Date', 'Units', 'Cairo Pkg', 'Delta Mfg', 'WAC', 'Payments', 'Status'].map(h => (
              <th key={h} style={thStyle}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.map(b => {
            const pays = payStates[b.id] || {}
            const status = statusMap[b.id]
            return (
              <tr key={b.id} style={{ backgroundColor: 'transparent' }}>
                <td style={{ ...tdStyle, fontWeight: '600', color: c.umber }}>{b.batchNumber}</td>
                <td style={tdStyle}>
                  <div style={{ fontSize: '11px', color: c.taupe }}>{b.productId}</div>
                  <div>{b.productName}</div>
                </td>
                <td style={tdStyle}>{b.orderDate}</td>
                <td style={{ ...tdStyle, fontWeight: '600' }}>{b.totalUnits.toLocaleString()}</td>
                <td style={tdStyle}>${b.packagingCost.perUnit.toFixed(2)}/u</td>
                <td style={tdStyle}>${b.liquidCost.perUnit.toFixed(2)}/u</td>
                <td style={{ ...tdStyle, fontWeight: '600', color: '#252525' }}>${b.weightedAvgCost.toFixed(2)}</td>
                <td style={{ ...tdStyle, paddingRight: '20px' }}>
                  <PaymentGrid
                    batchId={b.id}
                    batchNumber={b.batchNumber}
                    payments={pays}
                    onMarkPaid={handleMarkPaid}
                  />
                </td>
                <td style={{ ...tdStyle, paddingRight: '0' }}>
                  <StatusSelect value={status} onChange={newStatus => handleStatusChange(b.id, newStatus)} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {filtered.length === 0 && (
        <div style={{ padding: '32px 0', textAlign: 'center', color: c.taupe, fontFamily: 'var(--font-body)', fontSize: '13.5px' }}>
          No batches match the selected filters.
        </div>
      )}

      {/* Legend */}
      <div style={{ marginTop: '16px', display: 'flex', gap: '20px', fontSize: '11px', color: c.taupe, fontFamily: 'var(--font-body)' }}>
        <span><span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2d6a4f', marginRight: '6px' }} />Paid</span>
        <span><span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#856404', marginRight: '6px' }} />Pending</span>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        modal={confirmModal}
        onConfirm={handleConfirmPay}
        onCancel={() => setConfirmModal(null)}
      />
    </div>
  )
}
