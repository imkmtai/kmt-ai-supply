'use client'

import { useState } from 'react'

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

const colHeader = {
  fontFamily: 'var(--font-body)',
  fontSize: '11px',
  fontWeight: '600',
  color: c.taupe,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  padding: '12px 0',
  textAlign: 'left',
  borderBottom: `1px solid ${c.softDune}`,
}

const cell = {
  fontFamily: 'var(--font-body)',
  fontSize: '13.5px',
  fontWeight: '400',
  color: c.black,
  padding: '12px 0',
  borderBottom: `1px solid ${c.softDune}`,
}

const inputStyle = {
  width: '100%',
  padding: '9px 12px',
  border: `1px solid ${c.softDune}`,
  borderRadius: '4px',
  fontSize: '13px',
  fontFamily: 'var(--font-body)',
  backgroundColor: '#fff',
  color: c.black,
  outline: 'none',
}

const fieldLabel = {
  fontSize: '11px',
  fontWeight: '600',
  color: c.taupe,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  display: 'block',
  marginBottom: '6px',
  fontFamily: 'var(--font-body)',
}

function StatusPill({ status }) {
  const styles = {
    PAID: { backgroundColor: '#d4edda', color: '#155724' },
    PENDING: { backgroundColor: '#fff3cd', color: '#856404' },
    UNPAID: { backgroundColor: '#f8d7da', color: '#721c24' },
  }
  const s = styles[status] || styles.UNPAID
  return (
    <span style={{
      ...s,
      fontFamily: 'var(--font-body)',
      fontSize: '10px',
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      padding: '2px 8px',
      borderRadius: '3px',
      display: 'inline-block',
    }}>{status}</span>
  )
}

function TypePill({ type }) {
  const isPO = type === 'PO'
  return (
    <span style={{
      backgroundColor: isPO ? c.softDune : c.vanilla,
      color: c.umber,
      border: isPO ? 'none' : `1px solid ${c.softDune}`,
      fontFamily: 'var(--font-body)',
      fontSize: '10px',
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      padding: '2px 8px',
      borderRadius: '3px',
      display: 'inline-block',
    }}>{type}</span>
  )
}

const SUPPLIERS = [
  {
    id: 'cairo',
    name: 'Cairo Packaging Co.',
    role: 'Packaging',
    contact: 'Ahmed Hassan',
    email: 'ahmed.hassan@cairopack.com',
    paymentTerms: '50% deposit, 50% on delivery',
    batches: [
      { batch: 'SM-2025-001', products: 'Sea Mist', deposit: '$1,250.00', final: '$1,250.00', status: 'PAID' },
      { batch: 'GO-2025-001', products: 'Glow Oil', deposit: '$900.00', final: '$900.00', status: 'PAID' },
      { batch: 'BL-2025-002', products: 'Body Lotion', deposit: '$760.00', final: '—', status: 'PENDING' },
    ],
  },
  {
    id: 'delta',
    name: 'Delta Manufacturing',
    role: 'Liquid & Filling',
    contact: 'Sara Nour',
    email: 'sara.nour@deltamfg.com',
    paymentTerms: '40% deposit, 60% on delivery',
    batches: [
      { batch: 'SM-2025-001', products: 'Sea Mist', deposit: '$4,375.00', final: '$4,375.00', status: 'PAID' },
      { batch: 'GO-2025-001', products: 'Glow Oil', deposit: '$2,625.00', final: '—', status: 'PENDING' },
      { batch: 'LB-2025-001', products: 'Lip Balm', deposit: '—', final: '—', status: 'UNPAID' },
    ],
  },
]

const DOCUMENTS = [
  { id: 1, name: 'PO-SM-2025-001', batch: 'SM-2025-001', supplier: 'Cairo Packaging Co.', date: '2025-01-10', type: 'PO' },
  { id: 2, name: 'REC-SM-2025-001', batch: 'SM-2025-001', supplier: 'Cairo Packaging Co.', date: '2025-02-14', type: 'RECEIPT' },
  { id: 3, name: 'PO-GO-2025-001', batch: 'GO-2025-001', supplier: 'Delta Manufacturing', date: '2025-02-01', type: 'PO' },
  { id: 4, name: 'PO-BL-2025-002', batch: 'BL-2025-002', supplier: 'Cairo Packaging Co.', date: '2025-03-05', type: 'PO' },
  { id: 5, name: 'REC-GO-2025-001', batch: 'GO-2025-001', supplier: 'Delta Manufacturing', date: '2025-03-20', type: 'RECEIPT' },
  { id: 6, name: 'PO-LB-2025-001', batch: 'LB-2025-001', supplier: 'Delta Manufacturing', date: '2025-04-01', type: 'PO' },
]

const emptySupplierForm = { name: '', role: 'Packaging', contact: '', email: '', paymentTerms: '' }
const emptyDocForm = { supplier: '', batch: '', type: 'PO' }

export default function SuppliersPage() {
  const [activeTab, setActiveTab] = useState('suppliers')
  const [showAddSupplier, setShowAddSupplier] = useState(false)
  const [supplierForm, setSupplierForm] = useState(emptySupplierForm)
  const [showDocModal, setShowDocModal] = useState(false)
  const [docForm, setDocForm] = useState(emptyDocForm)

  return (
    <div style={{ position: 'relative' }}>
      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '32px' }}>
        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '28px',
          fontWeight: '500',
          color: '#252525',
        }}>Suppliers</h1>

        {activeTab === 'suppliers' && (
          <button onClick={() => setShowAddSupplier(true)} style={btnPrimary}>
            + Add Supplier
          </button>
        )}
        {activeTab === 'documents' && (
          <button onClick={() => setShowDocModal(true)} style={btnPrimary}>
            + Generate Document
          </button>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0', marginBottom: '32px', borderBottom: `1px solid ${c.softDune}` }}>
        {['suppliers', 'documents'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '13.5px',
              fontWeight: activeTab === tab ? '500' : '400',
              color: activeTab === tab ? c.umber : c.taupe,
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab ? `2px solid ${c.umber}` : '2px solid transparent',
              padding: '0 0 12px',
              marginRight: '28px',
              cursor: 'pointer',
              textTransform: 'capitalize',
              marginBottom: '-1px',
            }}
          >
            {tab === 'suppliers' ? 'Suppliers' : 'Documents'}
          </button>
        ))}
      </div>

      {/* SUPPLIERS TAB */}
      {activeTab === 'suppliers' && (
        <div>
          {SUPPLIERS.map(supplier => (
            <div key={supplier.id} style={{ marginBottom: '40px' }}>
              {/* Supplier card header */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '4px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: c.umber,
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: c.vanilla,
                    flexShrink: 0,
                  }}>
                    {supplier.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: '500', color: '#252525' }}>
                      {supplier.name}
                    </div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: c.taupe, marginTop: '2px' }}>
                      {supplier.role}
                    </div>
                  </div>
                </div>
              </div>

              {/* Supplier info row */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '24px',
                marginBottom: '20px',
                paddingBottom: '20px',
                borderBottom: `1px solid ${c.softDune}`,
              }}>
                {[
                  { label: 'Contact', value: supplier.contact },
                  { label: 'Email', value: supplier.email },
                  { label: 'Payment Terms', value: supplier.paymentTerms },
                  { label: 'Role', value: supplier.role },
                ].map(f => (
                  <div key={f.label}>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: '600', color: c.taupe, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
                      {f.label}
                    </div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '13.5px', color: '#252525' }}>
                      {f.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Batch payment history table */}
              <div style={{ marginBottom: '8px', fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: '600', color: c.taupe, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Batch Payment History
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['BATCH', 'PRODUCT(S)', 'DEPOSIT', 'FINAL', 'STATUS'].map(h => (
                      <th key={h} style={{ ...colHeader, paddingRight: '24px' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {supplier.batches.map((b, i) => (
                    <tr key={i}>
                      <td style={{ ...cell, fontWeight: '600', color: c.umber, paddingRight: '24px' }}>{b.batch}</td>
                      <td style={{ ...cell, paddingRight: '24px' }}>{b.products}</td>
                      <td style={{ ...cell, fontWeight: '600', paddingRight: '24px' }}>{b.deposit}</td>
                      <td style={{ ...cell, fontWeight: '600', paddingRight: '24px' }}>{b.final}</td>
                      <td style={{ ...cell }}><StatusPill status={b.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Divider between suppliers */}
              {supplier.id !== SUPPLIERS[SUPPLIERS.length - 1].id && (
                <div style={{ height: '1px', backgroundColor: c.softDune, margin: '32px 0 8px' }} />
              )}
            </div>
          ))}
        </div>
      )}

      {/* DOCUMENTS TAB */}
      {activeTab === 'documents' && (
        <div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['DOCUMENT', 'BATCH', 'SUPPLIER', 'DATE', 'TYPE', 'ACTIONS'].map(h => (
                  <th key={h} style={{ ...colHeader, paddingRight: '24px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DOCUMENTS.map(doc => (
                <tr key={doc.id}>
                  <td style={{ ...cell, fontWeight: '600', color: '#252525', paddingRight: '24px' }}>{doc.name}</td>
                  <td style={{ ...cell, paddingRight: '24px' }}>{doc.batch}</td>
                  <td style={{ ...cell, paddingRight: '24px' }}>{doc.supplier}</td>
                  <td style={{ ...cell, color: c.taupe, paddingRight: '24px' }}>{doc.date}</td>
                  <td style={{ ...cell, paddingRight: '24px' }}><TypePill type={doc.type} /></td>
                  <td style={{ ...cell }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {/* Download icon button */}
                      <button
                        title="Download"
                        style={{
                          background: 'none',
                          border: `1px solid ${c.softDune}`,
                          borderRadius: '4px',
                          padding: '5px 8px',
                          cursor: 'pointer',
                          color: c.taupe,
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                      </button>
                      {/* View button */}
                      <button style={{ ...btnSecondary, fontSize: '11px', padding: '5px 10px' }}>
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ADD SUPPLIER SLIDE-IN PANEL */}
      {showAddSupplier && (
        <>
          <div
            onClick={() => setShowAddSupplier(false)}
            style={{
              position: 'fixed', inset: 0, backgroundColor: 'rgba(37,37,37,0.18)', zIndex: 200,
            }}
          />
          <div style={{
            position: 'fixed', top: 0, right: 0, bottom: 0,
            width: '400px',
            backgroundColor: '#fff',
            borderLeft: `1px solid ${c.softDune}`,
            zIndex: 300,
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
          }}>
            <div style={{ padding: '28px 28px 20px', borderBottom: `1px solid ${c.softDune}` }}>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: '500', color: '#252525' }}>
                Add Supplier
              </div>
            </div>
            <div style={{ padding: '24px 28px', flex: 1 }}>
              <div style={{ marginBottom: '18px' }}>
                <label style={fieldLabel}>Supplier Name</label>
                <input
                  style={inputStyle}
                  placeholder="e.g. Cairo Packaging Co."
                  value={supplierForm.name}
                  onChange={e => setSupplierForm({ ...supplierForm, name: e.target.value })}
                />
              </div>
              <div style={{ marginBottom: '18px' }}>
                <label style={fieldLabel}>Role</label>
                <select
                  style={{ ...inputStyle, cursor: 'pointer' }}
                  value={supplierForm.role}
                  onChange={e => setSupplierForm({ ...supplierForm, role: e.target.value })}
                >
                  <option value="Packaging">Packaging</option>
                  <option value="Liquid & Filling">Liquid &amp; Filling</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div style={{ marginBottom: '18px' }}>
                <label style={fieldLabel}>Contact Name</label>
                <input
                  style={inputStyle}
                  placeholder="Full name"
                  value={supplierForm.contact}
                  onChange={e => setSupplierForm({ ...supplierForm, contact: e.target.value })}
                />
              </div>
              <div style={{ marginBottom: '18px' }}>
                <label style={fieldLabel}>Email</label>
                <input
                  type="email"
                  style={inputStyle}
                  placeholder="contact@supplier.com"
                  value={supplierForm.email}
                  onChange={e => setSupplierForm({ ...supplierForm, email: e.target.value })}
                />
              </div>
              <div style={{ marginBottom: '28px' }}>
                <label style={fieldLabel}>Payment Terms</label>
                <input
                  style={inputStyle}
                  placeholder="e.g. 50% deposit, 50% on delivery"
                  value={supplierForm.paymentTerms}
                  onChange={e => setSupplierForm({ ...supplierForm, paymentTerms: e.target.value })}
                />
              </div>
            </div>
            <div style={{ padding: '20px 28px', borderTop: `1px solid ${c.softDune}`, display: 'flex', gap: '10px' }}>
              <button
                onClick={() => { setShowAddSupplier(false); setSupplierForm(emptySupplierForm) }}
                style={btnPrimary}
              >
                Save
              </button>
              <button
                onClick={() => { setShowAddSupplier(false); setSupplierForm(emptySupplierForm) }}
                style={btnSecondary}
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}

      {/* GENERATE DOCUMENT MODAL */}
      {showDocModal && (
        <>
          <div
            onClick={() => setShowDocModal(false)}
            style={{
              position: 'fixed', inset: 0, backgroundColor: 'rgba(37,37,37,0.28)', zIndex: 200,
            }}
          />
          <div style={{
            position: 'fixed',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '420px',
            backgroundColor: '#fff',
            border: `1px solid ${c.softDune}`,
            borderRadius: '6px',
            zIndex: 300,
            overflow: 'hidden',
          }}>
            <div style={{ padding: '24px 24px 16px', borderBottom: `1px solid ${c.softDune}` }}>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: '500', color: '#252525' }}>
                Generate Document
              </div>
            </div>
            <div style={{ padding: '20px 24px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={fieldLabel}>Supplier</label>
                <select
                  style={{ ...inputStyle, cursor: 'pointer' }}
                  value={docForm.supplier}
                  onChange={e => setDocForm({ ...docForm, supplier: e.target.value })}
                >
                  <option value="">Select supplier</option>
                  {SUPPLIERS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={fieldLabel}>Batch</label>
                <select
                  style={{ ...inputStyle, cursor: 'pointer' }}
                  value={docForm.batch}
                  onChange={e => setDocForm({ ...docForm, batch: e.target.value })}
                >
                  <option value="">Select batch</option>
                  {['SM-2025-001', 'GO-2025-001', 'BL-2025-002', 'LB-2025-001'].map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={fieldLabel}>Type</label>
                <select
                  style={{ ...inputStyle, cursor: 'pointer' }}
                  value={docForm.type}
                  onChange={e => setDocForm({ ...docForm, type: e.target.value })}
                >
                  <option value="PO">PO</option>
                  <option value="Receipt">Receipt</option>
                </select>
              </div>
            </div>
            <div style={{ padding: '16px 24px', borderTop: `1px solid ${c.softDune}`, display: 'flex', gap: '10px' }}>
              <button
                onClick={() => { setShowDocModal(false); setDocForm(emptyDocForm) }}
                style={btnPrimary}
              >
                Generate
              </button>
              <button
                onClick={() => { setShowDocModal(false); setDocForm(emptyDocForm) }}
                style={btnSecondary}
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
