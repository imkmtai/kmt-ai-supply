'use client'

import { useState } from 'react'
import { batches, suppliers, products } from '@/data/mockData'

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

function DocumentPreview({ docType, batch, supplier }) {
  if (!batch || !supplier) return null
  const cost = supplier.id === 'SUP-001' ? batch.packagingCost : batch.liquidCost
  const product = products.find(p => p.id === batch.productId)
  const now = new Date('2026-04-08')
  const docRef = `ARDA-${docType === 'po' ? 'PO' : 'RCP'}-${batch.batchNumber}-${supplier.id.slice(-3)}`

  return (
    <div style={{ backgroundColor: '#fff', border: `1px solid ${c.softDune}`, borderRadius: '6px', overflow: 'hidden' }}>
      {/* Preview header */}
      <div style={{ backgroundColor: c.softDune, padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', color: c.umber, fontWeight: '600', fontFamily: 'var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {docType === 'po' ? 'Purchase Order' : 'Payment Receipt'} Preview
        </span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => window.print()}
            style={{ padding: '6px 14px', backgroundColor: c.umber, color: c.vanilla, border: 'none', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-body)' }}
          >
            ↓ Download PDF
          </button>
        </div>
      </div>

      {/* Document body */}
      <div style={{ padding: '40px', fontFamily: 'var(--font-body)', maxWidth: '700px', margin: '0 auto' }}>
        {/* Letterhead */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '26px', fontWeight: '700', color: c.umber }}>ARDA Rituals</div>
            <div style={{ fontSize: '12px', color: c.taupe, marginTop: '4px' }}>supply@ardarituals.com</div>
            <div style={{ fontSize: '12px', color: c.taupe }}>Cairo, Egypt</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: '600', color: c.umber }}>
              {docType === 'po' ? 'PURCHASE ORDER' : 'PAYMENT RECEIPT'}
            </div>
            <div style={{ fontSize: '13px', color: c.black, marginTop: '6px', fontWeight: '600' }}>#{docRef}</div>
            <div style={{ fontSize: '12px', color: c.taupe, marginTop: '4px' }}>{now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
          </div>
        </div>

        {/* Parties */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
          <div style={{ backgroundColor: c.vanilla, padding: '16px', borderRadius: '4px' }}>
            <div style={{ fontSize: '10px', color: c.taupe, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>From (Buyer)</div>
            <div style={{ fontWeight: '600', color: c.black }}>ARDA Rituals</div>
            <div style={{ fontSize: '12px', color: c.taupe, marginTop: '4px' }}>Cairo, Egypt</div>
          </div>
          <div style={{ backgroundColor: c.vanilla, padding: '16px', borderRadius: '4px' }}>
            <div style={{ fontSize: '10px', color: c.taupe, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>To (Supplier)</div>
            <div style={{ fontWeight: '600', color: c.black }}>{supplier.name}</div>
            <div style={{ fontSize: '12px', color: c.taupe, marginTop: '2px' }}>{supplier.contact}</div>
            <div style={{ fontSize: '12px', color: c.taupe }}>{supplier.email}</div>
            <div style={{ fontSize: '12px', color: c.taupe }}>{supplier.address}</div>
          </div>
        </div>

        {/* Batch details */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '10px', color: c.taupe, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Batch Reference</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {[
              { label: 'Batch Number', value: batch.batchNumber },
              { label: 'Product', value: `${batch.productId} — ${batch.productName}` },
              { label: 'Order Date', value: batch.orderDate },
            ].map(item => (
              <div key={item.label} style={{ backgroundColor: c.softDune, padding: '10px 12px', borderRadius: '4px' }}>
                <div style={{ fontSize: '10px', color: c.taupe, marginBottom: '4px' }}>{item.label}</div>
                <div style={{ fontSize: '13px', fontWeight: '500', color: c.black }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Line items */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px', fontSize: '13px' }}>
          <thead>
            <tr style={{ backgroundColor: c.umber }}>
              {['Description', 'Qty', 'Unit Price (USD)', 'Total (USD)'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '10px 14px', color: c.vanilla, fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: `1px solid ${c.softDune}` }}>
              <td style={{ padding: '12px 14px', color: c.black }}>
                {supplier.type === 'packaging' ? 'Packaging Components' : 'Liquid Formula / Filling'}
                <div style={{ fontSize: '11px', color: c.taupe, marginTop: '2px' }}>{batch.productName} — Batch {batch.batchNumber}</div>
              </td>
              <td style={{ padding: '12px 14px', color: c.black }}>{batch.totalUnits.toLocaleString()}</td>
              <td style={{ padding: '12px 14px', color: c.black }}>${cost.perUnit.toFixed(2)}</td>
              <td style={{ padding: '12px 14px', fontWeight: '600', color: c.black }}>${cost.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr style={{ backgroundColor: c.vanilla }}>
              <td colSpan="3" style={{ padding: '12px 14px', textAlign: 'right', fontWeight: '600', color: c.umber }}>Order Total</td>
              <td style={{ padding: '12px 14px', fontWeight: '700', color: c.umber, fontSize: '15px' }}>${cost.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
            </tr>
          </tfoot>
        </table>

        {/* Payment Schedule */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontSize: '10px', color: c.taupe, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>Payment Schedule</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <tbody>
              <tr style={{ borderBottom: `1px solid ${c.softDune}` }}>
                <td style={{ padding: '10px 0', color: c.black }}>Deposit (50%)</td>
                <td style={{ padding: '10px 0', textAlign: 'right', fontWeight: '600', color: cost.depositPaid ? '#2d6a4f' : c.black }}>
                  ${cost.depositAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
                <td style={{ padding: '10px 0', textAlign: 'right', fontSize: '12px' }}>
                  {cost.depositPaid ? (
                    <span style={{ color: '#2d6a4f', fontWeight: '600' }}>✓ Paid {cost.depositDate}</span>
                  ) : (
                    <span style={{ color: '#856404' }}>Awaiting payment</span>
                  )}
                </td>
              </tr>
              <tr>
                <td style={{ padding: '10px 0', color: c.black }}>Final Payment (50%)</td>
                <td style={{ padding: '10px 0', textAlign: 'right', fontWeight: '600', color: cost.finalPaid ? '#2d6a4f' : '#856404' }}>
                  ${cost.finalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
                <td style={{ padding: '10px 0', textAlign: 'right', fontSize: '12px' }}>
                  {cost.finalPaid ? (
                    <span style={{ color: '#2d6a4f', fontWeight: '600' }}>✓ Paid {cost.finalDate}</span>
                  ) : (
                    <span style={{ color: '#856404' }}>Outstanding</span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Notes */}
        <div style={{ borderTop: `1px solid ${c.softDune}`, paddingTop: '20px', fontSize: '12px', color: c.taupe }}>
          <strong style={{ color: c.black }}>Notes:</strong> {batch.notes || 'No additional notes.'}<br /><br />
          <em>Payment terms: {supplier.paymentTerms}. This document is generated by ARDA Rituals and serves as an official record.</em>
        </div>
      </div>
    </div>
  )
}

export default function DocumentsPage() {
  const [docType, setDocType] = useState('po')
  const [selectedBatch, setSelectedBatch] = useState('')
  const [selectedSupplier, setSelectedSupplier] = useState('')

  const batch = batches.find(b => b.id === selectedBatch)
  const supplier = suppliers.find(s => s.id === selectedSupplier)
  const canGenerate = batch && supplier

  return (
    <div>
      <div style={{ marginBottom: '36px' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '32px', fontWeight: '600', color: c.umber }}>Documents</h1>
        <p style={{ marginTop: '6px', fontSize: '14px', color: c.taupe }}>Generate purchase orders and payment receipts per supplier and batch</p>
      </div>

      {/* Generator Controls */}
      <Card style={{ marginBottom: '28px' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: '600', color: c.umber, marginBottom: '20px' }}>Generate Document</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', alignItems: 'end' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: '500', color: c.taupe, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' }}>Document Type</label>
            <div style={{ display: 'flex', gap: '0' }}>
              {[
                { value: 'po', label: 'Purchase Order' },
                { value: 'receipt', label: 'Payment Receipt' },
              ].map(opt => (
                <button key={opt.value} onClick={() => setDocType(opt.value)} style={{
                  flex: 1,
                  padding: '9px 12px',
                  border: `1px solid ${c.softDune}`,
                  backgroundColor: docType === opt.value ? c.umber : '#fff',
                  color: docType === opt.value ? c.vanilla : c.black,
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontFamily: 'var(--font-body)',
                  borderRadius: opt.value === 'po' ? '4px 0 0 4px' : '0 4px 4px 0',
                }}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: '500', color: c.taupe, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' }}>Batch</label>
            <select value={selectedBatch} onChange={e => setSelectedBatch(e.target.value)} style={{ width: '100%', padding: '9px 12px', border: `1px solid ${c.softDune}`, borderRadius: '4px', fontSize: '13px', fontFamily: 'var(--font-body)', backgroundColor: '#fff', color: c.black }}>
              <option value="">Select batch</option>
              {batches.map(b => <option key={b.id} value={b.id}>{b.batchNumber} — {b.productName}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: '500', color: c.taupe, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' }}>Supplier</label>
            <select value={selectedSupplier} onChange={e => setSelectedSupplier(e.target.value)} style={{ width: '100%', padding: '9px 12px', border: `1px solid ${c.softDune}`, borderRadius: '4px', fontSize: '13px', fontFamily: 'var(--font-body)', backgroundColor: '#fff', color: c.black }}>
              <option value="">Select supplier</option>
              {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
        </div>
      </Card>

      {/* Document Preview */}
      {canGenerate ? (
        <DocumentPreview docType={docType} batch={batch} supplier={supplier} />
      ) : (
        <div style={{ backgroundColor: '#fff', border: `2px dashed ${c.softDune}`, borderRadius: '6px', padding: '60px', textAlign: 'center', fontFamily: 'var(--font-body)' }}>
          <div style={{ fontSize: '36px', marginBottom: '12px', opacity: 0.4 }}>◻</div>
          <div style={{ fontSize: '15px', color: c.umber, fontWeight: '500', marginBottom: '6px' }}>No document generated yet</div>
          <div style={{ fontSize: '13px', color: c.taupe }}>Select a document type, batch, and supplier above to generate a preview</div>
        </div>
      )}

      {/* Quick Reference Table */}
      <Card style={{ marginTop: '28px', padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px 0' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: '600', color: c.umber, marginBottom: '4px' }}>All Batches — Quick Reference</h2>
          <p style={{ fontSize: '13px', color: c.taupe, marginBottom: '16px', fontFamily: 'var(--font-body)' }}>Select any row to generate a document for that batch</p>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-body)', fontSize: '13px' }}>
          <thead>
            <tr style={{ backgroundColor: c.softDune }}>
              {['Batch', 'Product', 'Status', 'Cairo Deposit', 'Cairo Final', 'Delta Deposit', 'Delta Final', 'Generate'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '10px 14px', color: c.umber, fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {batches.map((b, i) => {
              const statusMap = { received: '#2d6a4f', 'in-transit': c.umber, pending: '#856404' }
              return (
                <tr key={b.id} style={{ backgroundColor: i % 2 === 0 ? '#fff' : c.vanilla, borderBottom: `1px solid ${c.softDune}` }}>
                  <td style={{ padding: '11px 14px', fontWeight: '600', color: c.umber }}>{b.batchNumber}</td>
                  <td style={{ padding: '11px 14px', color: c.black }}>{b.productName}</td>
                  <td style={{ padding: '11px 14px', color: statusMap[b.status] || c.black, fontWeight: '500', textTransform: 'capitalize' }}>{b.status.replace('-', ' ')}</td>
                  {[
                    { paid: b.packagingCost.depositPaid, amount: b.packagingCost.depositAmount },
                    { paid: b.packagingCost.finalPaid, amount: b.packagingCost.finalAmount },
                    { paid: b.liquidCost.depositPaid, amount: b.liquidCost.depositAmount },
                    { paid: b.liquidCost.finalPaid, amount: b.liquidCost.finalAmount },
                  ].map((p, j) => (
                    <td key={j} style={{ padding: '11px 14px' }}>
                      <span style={{ color: p.paid ? '#2d6a4f' : '#856404', fontWeight: '500' }}>
                        {p.paid ? '✓' : '○'} ${p.amount.toLocaleString('en-US', { minimumFractionDigits: 0 })}
                      </span>
                    </td>
                  ))}
                  <td style={{ padding: '11px 14px' }}>
                    <button
                      onClick={() => { setSelectedBatch(b.id); setSelectedSupplier(''); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                      style={{ padding: '4px 10px', backgroundColor: 'transparent', color: c.umber, border: `1px solid ${c.taupe}`, borderRadius: '3px', fontSize: '11px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: '500' }}
                    >
                      Select
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
