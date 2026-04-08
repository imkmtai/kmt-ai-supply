'use client'

import { useState } from 'react'
import { batches, products, suppliers } from '@/data/mockData'

const c = {
  vanilla: '#F8F4EE',
  softDune: '#E4DDCC',
  taupe: '#C5B49D',
  umber: '#443A35',
  black: '#252525',
}

function PageHeader({ title, subtitle }) {
  return (
    <div style={{ marginBottom: '36px' }}>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '32px', fontWeight: '600', color: c.umber }}>{title}</h1>
      {subtitle && <p style={{ marginTop: '6px', fontSize: '14px', color: c.taupe }}>{subtitle}</p>}
    </div>
  )
}

function Card({ children, style }) {
  return (
    <div style={{ backgroundColor: '#fff', border: `1px solid ${c.softDune}`, borderRadius: '6px', padding: '24px', ...style }}>
      {children}
    </div>
  )
}

function SectionTitle({ children }) {
  return <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: '600', color: c.umber, marginBottom: '16px' }}>{children}</h2>
}

function StatusBadge({ status }) {
  const map = {
    received: { bg: '#eaf4ee', color: '#2d6a4f', label: 'Received' },
    'in-transit': { bg: c.softDune, color: c.umber, label: 'In Transit' },
    pending: { bg: '#fff3cd', color: '#856404', label: 'Pending' },
  }
  const s = map[status] || map.pending
  return <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: '3px', fontSize: '11px', fontWeight: '600', letterSpacing: '0.06em', textTransform: 'uppercase', backgroundColor: s.bg, color: s.color }}>{s.label}</span>
}

function PaymentDot({ paid }) {
  return <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: paid ? '#2d6a4f' : '#dc3545', marginRight: '6px' }} />
}

const labelStyle = { fontSize: '11px', fontWeight: '500', color: c.taupe, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px', display: 'block' }
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
const selectStyle = { ...inputStyle, cursor: 'pointer' }

const emptyForm = {
  productId: '',
  batchNumber: '',
  orderDate: '',
  totalUnits: '',
  packagingPerUnit: '',
  liquidPerUnit: '',
  notes: '',
}

export default function BatchesPage() {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterProduct, setFilterProduct] = useState('all')
  const [submitted, setSubmitted] = useState(false)

  const filtered = batches.filter(b => {
    if (filterStatus !== 'all' && b.status !== filterStatus) return false
    if (filterProduct !== 'all' && b.productId !== filterProduct) return false
    return true
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setShowForm(false)
      setForm(emptyForm)
    }, 2500)
  }

  const estWac = form.packagingPerUnit && form.liquidPerUnit
    ? (parseFloat(form.packagingPerUnit) + parseFloat(form.liquidPerUnit)).toFixed(2)
    : null

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '36px' }}>
        <PageHeader title="Batch Orders" subtitle="Create and track production batches across all products" />
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: '10px 20px',
            backgroundColor: showForm ? 'transparent' : c.umber,
            color: showForm ? c.umber : c.vanilla,
            border: `1px solid ${c.umber}`,
            borderRadius: '4px',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
            fontFamily: 'var(--font-body)',
            marginTop: '4px',
            whiteSpace: 'nowrap',
          }}
        >
          {showForm ? '✕ Cancel' : '+ New Batch'}
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <Card style={{ marginBottom: '28px', borderColor: c.taupe }}>
          <SectionTitle>New Batch Order</SectionTitle>
          {submitted ? (
            <div style={{ backgroundColor: '#eaf4ee', border: '1px solid #2d6a4f', borderRadius: '4px', padding: '16px', color: '#2d6a4f', fontSize: '14px', fontFamily: 'var(--font-body)' }}>
              ✓ Batch order created successfully. (Mock — no data saved)
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={labelStyle}>Product *</label>
                  <select required style={selectStyle} value={form.productId} onChange={e => setForm({ ...form, productId: e.target.value })}>
                    <option value="">Select product</option>
                    {products.map(p => <option key={p.id} value={p.id}>{p.id} – {p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Batch Number *</label>
                  <input required style={inputStyle} placeholder="e.g. SM-2025-003" value={form.batchNumber} onChange={e => setForm({ ...form, batchNumber: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>Order Date *</label>
                  <input required type="date" style={inputStyle} value={form.orderDate} onChange={e => setForm({ ...form, orderDate: e.target.value })} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={labelStyle}>Total Units *</label>
                  <input required type="number" min="1" style={inputStyle} placeholder="e.g. 1000" value={form.totalUnits} onChange={e => setForm({ ...form, totalUnits: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>Cairo Packaging – Per Unit Cost (USD) *</label>
                  <input required type="number" step="0.01" min="0" style={inputStyle} placeholder="e.g. 2.55" value={form.packagingPerUnit} onChange={e => setForm({ ...form, packagingPerUnit: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>Delta Manufacturing – Per Unit Cost (USD) *</label>
                  <input required type="number" step="0.01" min="0" style={inputStyle} placeholder="e.g. 8.75" value={form.liquidPerUnit} onChange={e => setForm({ ...form, liquidPerUnit: e.target.value })} />
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
                <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '72px' }} placeholder="Any notes about this batch..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" style={{ padding: '10px 24px', backgroundColor: c.umber, color: c.vanilla, border: 'none', borderRadius: '4px', fontSize: '13px', fontWeight: '500', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                  Create Batch
                </button>
                <button type="button" onClick={() => setShowForm(false)} style={{ padding: '10px 20px', backgroundColor: 'transparent', color: c.umber, border: `1px solid ${c.taupe}`, borderRadius: '4px', fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                  Cancel
                </button>
              </div>
            </form>
          )}
        </Card>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div>
          <label style={{ ...labelStyle, display: 'inline-block' }}>Status</label>
          <div style={{ display: 'flex', gap: '1px', marginTop: '6px' }}>
            {['all', 'received', 'in-transit', 'pending'].map(s => (
              <button key={s} onClick={() => setFilterStatus(s)} style={{
                padding: '6px 14px',
                fontSize: '12px',
                border: `1px solid ${c.softDune}`,
                backgroundColor: filterStatus === s ? c.umber : '#fff',
                color: filterStatus === s ? c.vanilla : c.black,
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
                textTransform: s === 'all' ? 'none' : 'capitalize',
                borderRadius: s === 'all' ? '4px 0 0 4px' : s === 'pending' ? '0 4px 4px 0' : '0',
              }}>{s === 'all' ? 'All' : s.replace('-', ' ')}</button>
            ))}
          </div>
        </div>
        <div>
          <label style={{ ...labelStyle, display: 'inline-block' }}>Product</label>
          <select style={{ ...selectStyle, width: 'auto', marginTop: '6px' }} value={filterProduct} onChange={e => setFilterProduct(e.target.value)}>
            <option value="all">All products</option>
            {products.map(p => <option key={p.id} value={p.id}>{p.id} – {p.name}</option>)}
          </select>
        </div>
      </div>

      {/* Batches Table */}
      <Card style={{ padding: '0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-body)', fontSize: '13px' }}>
          <thead>
            <tr style={{ backgroundColor: c.softDune }}>
              {['Batch', 'Product', 'Order Date', 'Units', 'Cairo Pkg', 'Delta Mfg', 'WAC', 'Deposits', 'Finals', 'Status'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '12px 16px', color: c.umber, fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.07em', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((b, i) => (
              <tr key={b.id} style={{ backgroundColor: i % 2 === 0 ? '#fff' : c.vanilla, borderBottom: `1px solid ${c.softDune}` }}>
                <td style={{ padding: '14px 16px', fontWeight: '600', color: c.umber }}>{b.batchNumber}</td>
                <td style={{ padding: '14px 16px', color: c.black }}>
                  <div style={{ fontSize: '11px', color: c.taupe }}>{b.productId}</div>
                  {b.productName}
                </td>
                <td style={{ padding: '14px 16px', color: c.black }}>{b.orderDate}</td>
                <td style={{ padding: '14px 16px', color: c.black, fontWeight: '500' }}>{b.totalUnits.toLocaleString()}</td>
                <td style={{ padding: '14px 16px', color: c.black }}>${b.packagingCost.perUnit.toFixed(2)}/u</td>
                <td style={{ padding: '14px 16px', color: c.black }}>${b.liquidCost.perUnit.toFixed(2)}/u</td>
                <td style={{ padding: '14px 16px', fontWeight: '600', color: c.umber }}>${b.weightedAvgCost.toFixed(2)}</td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ fontSize: '12px', color: c.black }}>
                    <PaymentDot paid={b.packagingCost.depositPaid} />Cairo
                  </div>
                  <div style={{ fontSize: '12px', color: c.black, marginTop: '3px' }}>
                    <PaymentDot paid={b.liquidCost.depositPaid} />Delta
                  </div>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ fontSize: '12px', color: c.black }}>
                    <PaymentDot paid={b.packagingCost.finalPaid} />Cairo
                  </div>
                  <div style={{ fontSize: '12px', color: c.black, marginTop: '3px' }}>
                    <PaymentDot paid={b.liquidCost.finalPaid} />Delta
                  </div>
                </td>
                <td style={{ padding: '14px 16px' }}><StatusBadge status={b.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ padding: '32px', textAlign: 'center', color: c.taupe, fontFamily: 'var(--font-body)', fontSize: '14px' }}>No batches match the selected filters.</div>
        )}
      </Card>

      {/* Payment Status Legend */}
      <div style={{ marginTop: '16px', display: 'flex', gap: '20px', fontSize: '12px', color: c.taupe, fontFamily: 'var(--font-body)' }}>
        <span><span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2d6a4f', marginRight: '6px' }} />Paid</span>
        <span><span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#dc3545', marginRight: '6px' }} />Unpaid</span>
      </div>
    </div>
  )
}
