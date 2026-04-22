'use client'

import { useState } from 'react'
import { emailSettings, shopifySettings } from '@/data/mockData'

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

const btnDestructive = {
  backgroundColor: 'transparent',
  color: '#721c24',
  fontFamily: 'var(--font-body)',
  fontSize: '12px',
  fontWeight: '500',
  padding: '8px 16px',
  borderRadius: '4px',
  border: '1px solid #dc3545',
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

// All 5 products — defined locally since mockData only has 3
const INITIAL_PRODUCTS = [
  { id: 'AR-001', name: 'Sea Mist',    reorderThreshold: 200 },
  { id: 'AR-002', name: 'Glow Oil',   reorderThreshold: 150 },
  { id: 'AR-003', name: 'Body Lotion', reorderThreshold: 200 },
  { id: 'AR-004', name: 'Hand Wash',  reorderThreshold: 180 },
  { id: 'AR-005', name: 'Lip Balm',   reorderThreshold: 120 },
]

const emptyAddForm = { name: '', sku: '', threshold: '', shopifyId: '', confirmed: false }

function SectionHeading({ children }) {
  return (
    <div style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: '500', color: '#252525', marginBottom: '4px' }}>
      {children}
    </div>
  )
}

function Toggle({ checked, onChange, label, description }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '14px 0', borderBottom: `1px solid ${c.softDune}` }}>
      <div>
        <div style={{ fontSize: '13.5px', fontWeight: '400', color: c.black, fontFamily: 'var(--font-body)' }}>{label}</div>
        {description && <div style={{ fontSize: '11px', color: c.taupe, marginTop: '3px', fontFamily: 'var(--font-body)' }}>{description}</div>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        style={{
          width: '44px', height: '24px', borderRadius: '12px', border: 'none',
          backgroundColor: checked ? c.umber : c.softDune,
          cursor: 'pointer', position: 'relative',
          transition: 'background-color 0.2s ease', flexShrink: 0, marginLeft: '24px', marginTop: '2px',
        }}
        aria-label={label}
      >
        <span style={{
          position: 'absolute', top: '3px', left: checked ? '23px' : '3px',
          width: '18px', height: '18px', borderRadius: '50%',
          backgroundColor: '#fff', transition: 'left 0.2s ease',
        }} />
      </button>
    </div>
  )
}

// ─── Delete confirmation modal ─────────────────────────────────
function DeleteModal({ product, confirmText, onTextChange, onConfirm, onCancel }) {
  if (!product) return null
  const canConfirm = confirmText === 'DELETE'
  return (
    <>
      <div
        onClick={onCancel}
        style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(37,37,37,0.28)', zIndex: 200 }}
      />
      <div style={{
        position: 'fixed',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#fff',
        border: `1px solid ${c.softDune}`,
        borderRadius: '6px',
        padding: '28px 24px 22px',
        zIndex: 300,
        width: '400px',
        fontFamily: 'var(--font-body)',
      }}>
        {/* Header */}
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: '500', color: '#252525', marginBottom: '12px' }}>
          Delete {product.name}?
        </div>

        {/* Warning */}
        <div style={{
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: '4px',
          padding: '12px 14px',
          marginBottom: '20px',
          fontSize: '13px',
          color: '#721c24',
          lineHeight: 1.6,
        }}>
          Before deleting this product, make sure it is no longer visible on your online store and all active batches are closed.
        </div>

        {/* Confirm input */}
        <div style={{ marginBottom: '20px' }}>
          <label style={fieldLabel}>Type DELETE to confirm</label>
          <input
            type="text"
            value={confirmText}
            onChange={e => onTextChange(e.target.value)}
            placeholder="DELETE"
            style={{ ...inputStyle, borderColor: confirmText && !canConfirm ? '#dc3545' : c.softDune }}
            autoFocus
          />
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={onConfirm}
            disabled={!canConfirm}
            style={{
              ...btnDestructive,
              backgroundColor: canConfirm ? '#dc3545' : '#f8d7da',
              color: canConfirm ? '#fff' : '#721c24',
              borderColor: canConfirm ? '#dc3545' : '#f5c6cb',
              cursor: canConfirm ? 'pointer' : 'not-allowed',
              border: 'none',
            }}
          >
            Confirm Delete
          </button>
          <button onClick={onCancel} style={btnSecondary}>Cancel</button>
        </div>
      </div>
    </>
  )
}

// ─── Add Product slide-in panel ────────────────────────────────
function AddProductPanel({ show, form, onFormChange, onSave, onCancel }) {
  const canSave = form.name.trim() && form.sku.trim() && form.threshold && form.confirmed
  return (
    <>
      {show && (
        <div
          onClick={onCancel}
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(37,37,37,0.18)', zIndex: 200 }}
        />
      )}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: '400px',
        backgroundColor: '#fff',
        borderLeft: `1px solid ${c.softDune}`,
        zIndex: 300,
        display: 'flex',
        flexDirection: 'column',
        transform: show ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.26s cubic-bezier(0.4,0,0.2,1)',
      }}>
        {/* Panel header */}
        <div style={{ padding: '28px 28px 20px', borderBottom: `1px solid ${c.softDune}`, flexShrink: 0 }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: '500', color: '#252525' }}>
            Add Product
          </div>
        </div>

        {/* Panel fields */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
          <div style={{ marginBottom: '18px' }}>
            <label style={fieldLabel}>Product Name *</label>
            <input
              type="text"
              required
              style={inputStyle}
              placeholder="e.g. Face Serum"
              value={form.name}
              onChange={e => onFormChange('name', e.target.value)}
            />
          </div>

          <div style={{ marginBottom: '18px' }}>
            <label style={fieldLabel}>SKU *</label>
            <input
              type="text"
              required
              style={inputStyle}
              placeholder="e.g. AR-006"
              value={form.sku}
              onChange={e => onFormChange('sku', e.target.value)}
            />
          </div>

          <div style={{ marginBottom: '18px' }}>
            <label style={fieldLabel}>Reorder Threshold *</label>
            <input
              type="number"
              required
              min="1"
              style={inputStyle}
              placeholder="e.g. 150"
              value={form.threshold}
              onChange={e => onFormChange('threshold', e.target.value)}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={fieldLabel}>Shopify Product ID</label>
            <input
              type="text"
              style={inputStyle}
              placeholder="Add when Shopify is connected"
              value={form.shopifyId}
              onChange={e => onFormChange('shopifyId', e.target.value)}
            />
          </div>

          {/* Confirmation checkbox */}
          <label style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            cursor: 'pointer',
            marginBottom: '8px',
          }}>
            <input
              type="checkbox"
              checked={form.confirmed}
              onChange={e => onFormChange('confirmed', e.target.checked)}
              style={{ marginTop: '2px', width: '15px', height: '15px', flexShrink: 0, cursor: 'pointer', accentColor: c.umber }}
            />
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: c.black, lineHeight: 1.5 }}>
              I confirm this product is set up and ready to fulfil orders
            </span>
          </label>
        </div>

        {/* Panel footer */}
        <div style={{ padding: '20px 28px', borderTop: `1px solid ${c.softDune}`, display: 'flex', gap: '10px', flexShrink: 0 }}>
          <button
            onClick={onSave}
            disabled={!canSave}
            style={{
              ...btnPrimary,
              opacity: canSave ? 1 : 0.45,
              cursor: canSave ? 'pointer' : 'not-allowed',
            }}
          >
            Save Product
          </button>
          <button onClick={onCancel} style={btnSecondary}>Cancel</button>
        </div>
      </div>
    </>
  )
}

// ─── Page ──────────────────────────────────────────────────────
export default function SettingsPage() {
  const [productList, setProductList] = useState(INITIAL_PRODUCTS)
  const [email, setEmail]             = useState(emailSettings)
  const [shopify, setShopify]         = useState(shopifySettings)
  const [savedSection, setSavedSection] = useState(null)

  // Delete modal state
  const [deleteModal, setDeleteModal]         = useState(null)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')

  // Add panel state
  const [showAddPanel, setShowAddPanel] = useState(false)
  const [addForm, setAddForm]           = useState(emptyAddForm)

  const save = (section) => {
    setSavedSection(section)
    setTimeout(() => setSavedSection(null), 2500)
  }

  function openDelete(product) {
    setDeleteModal(product)
    setDeleteConfirmText('')
  }

  function handleConfirmDelete() {
    setProductList(prev => prev.filter(p => p.id !== deleteModal.id))
    setDeleteModal(null)
    setDeleteConfirmText('')
  }

  function handleAddFormChange(field, value) {
    setAddForm(prev => ({ ...prev, [field]: value }))
  }

  function handleSaveProduct() {
    const newProduct = {
      id: addForm.sku.trim().toUpperCase(),
      name: addForm.name.trim(),
      reorderThreshold: Number(addForm.threshold),
    }
    setProductList(prev => [...prev, newProduct])
    setShowAddPanel(false)
    setAddForm(emptyAddForm)
  }

  function handleCancelAdd() {
    setShowAddPanel(false)
    setAddForm(emptyAddForm)
  }

  return (
    <div>
      {/* Page title */}
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', fontWeight: '500', color: '#252525', marginBottom: '32px' }}>
        Settings
      </h1>

      {/* ── Products ───────────────────────────────────────────── */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px' }}>
          <div>
            <SectionHeading>Products</SectionHeading>
            <div style={{ fontSize: '11px', color: c.taupe, fontFamily: 'var(--font-body)', marginTop: '4px' }}>
              Manage your product catalogue and reorder thresholds
            </div>
          </div>
          <button onClick={() => setShowAddPanel(true)} style={btnPrimary}>
            + Add Product
          </button>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-body)' }}>
          <thead>
            <tr>
              <th style={thStyle}>SKU</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Reorder Threshold</th>
              <th style={{ ...thStyle, paddingRight: '0' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {productList.map(p => (
              <tr key={p.id} style={{ backgroundColor: 'transparent' }}>
                <td style={{ ...tdStyle, fontWeight: '600', color: c.umber, fontFamily: 'monospace', fontSize: '12px' }}>
                  {p.id}
                </td>
                <td style={tdStyle}>{p.name}</td>
                <td style={{ ...tdStyle, fontWeight: '600', color: '#252525' }}>
                  {p.reorderThreshold.toLocaleString()} units
                </td>
                <td style={{ ...tdStyle, paddingRight: '0' }}>
                  <button onClick={() => openDelete(p)} style={btnDestructive}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {productList.length === 0 && (
          <div style={{ padding: '24px 0', textAlign: 'center', color: c.taupe, fontFamily: 'var(--font-body)', fontSize: '13.5px' }}>
            No products. Add one to get started.
          </div>
        )}
      </div>

      {/* ── Email Alerts ────────────────────────────────────────── */}
      <div style={{ border: `1px solid ${c.softDune}`, borderRadius: '4px', padding: '24px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
          <div>
            <SectionHeading>Email Alert Preferences</SectionHeading>
            <div style={{ fontSize: '11px', color: c.taupe, fontFamily: 'var(--font-body)', marginBottom: '20px' }}>
              Configure when and where automated alerts are sent
            </div>
          </div>
          {savedSection === 'email' && (
            <div style={{ fontSize: '13px', color: '#155724', fontWeight: '500', fontFamily: 'var(--font-body)' }}>✓ Saved</div>
          )}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={fieldLabel}>Alert Email Address</label>
          <input
            type="email"
            value={email.alertEmail}
            onChange={e => setEmail({ ...email, alertEmail: e.target.value })}
            style={{ ...inputStyle, maxWidth: '360px' }}
          />
        </div>

        <div>
          <Toggle checked={email.lowStockAlerts} onChange={v => setEmail({ ...email, lowStockAlerts: v })} label="Low Stock Alerts" description="Send an alert when any product falls below its reorder threshold" />
          <Toggle checked={email.paymentDueAlerts} onChange={v => setEmail({ ...email, paymentDueAlerts: v })} label="Payment Due Alerts" description="Remind when a supplier deposit or final payment is outstanding" />
          <Toggle checked={email.batchReceivedAlerts} onChange={v => setEmail({ ...email, batchReceivedAlerts: v })} label="Batch Received Confirmations" description="Send a confirmation email when stock is marked as received" />
          <Toggle checked={email.weeklyDigest} onChange={v => setEmail({ ...email, weeklyDigest: v })} label="Weekly Digest" description="A summary of stock levels, costs, and outstanding payments each week" />
        </div>

        {email.weeklyDigest && (
          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: `1px solid ${c.softDune}` }}>
            <label style={fieldLabel}>Digest Day</label>
            <select value={email.digestDay} onChange={e => setEmail({ ...email, digestDay: e.target.value })} style={{ ...inputStyle, maxWidth: '200px' }}>
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        )}

        <div style={{ marginTop: '20px' }}>
          <button onClick={() => save('email')} style={btnPrimary}>Save Email Settings</button>
        </div>
      </div>

      {/* ── Shopify Integration ─────────────────────────────────── */}
      <div style={{ border: `1px solid ${c.softDune}`, borderRadius: '4px', padding: '24px' }}>
        <SectionHeading>Shopify Integration</SectionHeading>
        <div style={{ fontSize: '11px', color: c.taupe, fontFamily: 'var(--font-body)', marginBottom: '24px' }}>
          Connect your Shopify store to sync inventory levels and product data
        </div>

        <div style={{ backgroundColor: c.vanilla, border: `1px solid ${c.softDune}`, borderRadius: '4px', padding: '16px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '36px', height: '36px', backgroundColor: c.softDune, borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🛍</div>
          <div>
            <div style={{ fontWeight: '600', color: c.black, fontFamily: 'var(--font-body)', fontSize: '13.5px' }}>Shopify Store</div>
            <div style={{ fontSize: '11px', color: c.taupe, fontFamily: 'var(--font-body)', marginTop: '2px' }}>
              {shopify.connected ? `Connected to ${shopify.storeUrl}` : 'Not connected — enter your API credentials below'}
            </div>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <span style={{
              display: 'inline-block', padding: '2px 8px', borderRadius: '3px',
              fontSize: '10px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase',
              fontFamily: 'var(--font-body)',
              backgroundColor: shopify.connected ? '#d4edda' : c.softDune,
              color: shopify.connected ? '#155724' : c.taupe,
            }}>
              {shopify.connected ? 'Connected' : 'Not Connected'}
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          <div>
            <label style={fieldLabel}>Store URL</label>
            <input type="text" placeholder="yourstore.myshopify.com" value={shopify.storeUrl} onChange={e => setShopify({ ...shopify, storeUrl: e.target.value })} style={inputStyle} />
          </div>
          <div>
            <label style={fieldLabel}>Admin API Access Token</label>
            <input type="password" placeholder="shpat_xxxxxxxxxxxxxxxx" value={shopify.apiKey} onChange={e => setShopify({ ...shopify, apiKey: e.target.value })} style={inputStyle} />
          </div>
        </div>

        <div style={{ backgroundColor: c.softDune, borderRadius: '4px', padding: '12px 16px', marginBottom: '20px', fontSize: '12px', color: c.umber, fontFamily: 'var(--font-body)' }}>
          <strong>When connected:</strong> ARDA Supply will sync inventory counts to Shopify product variants, and pull order data to automatically deduct stock. The Shopify Admin API requires the{' '}
          <code style={{ fontFamily: 'monospace', backgroundColor: c.vanilla, padding: '1px 4px', borderRadius: '2px' }}>read_inventory</code> and{' '}
          <code style={{ fontFamily: 'monospace', backgroundColor: c.vanilla, padding: '1px 4px', borderRadius: '2px' }}>write_inventory</code> scopes.
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => save('shopify')} style={btnPrimary}>
            {shopify.connected ? 'Update Connection' : 'Connect Shopify'}
          </button>
          {shopify.connected && (
            <button style={{ ...btnSecondary, color: '#721c24', border: '1px solid #dc3545' }}>Disconnect</button>
          )}
        </div>

        {savedSection === 'shopify' && (
          <div style={{ marginTop: '16px', fontSize: '13px', color: '#155724', fontWeight: '500', fontFamily: 'var(--font-body)' }}>
            ✓ Settings saved. (Mock — no connection established)
          </div>
        )}
      </div>

      {/* ── Delete confirmation modal ──────────────────────────── */}
      <DeleteModal
        product={deleteModal}
        confirmText={deleteConfirmText}
        onTextChange={setDeleteConfirmText}
        onConfirm={handleConfirmDelete}
        onCancel={() => { setDeleteModal(null); setDeleteConfirmText('') }}
      />

      {/* ── Add Product slide-in panel ─────────────────────────── */}
      <AddProductPanel
        show={showAddPanel}
        form={addForm}
        onFormChange={handleAddFormChange}
        onSave={handleSaveProduct}
        onCancel={handleCancelAdd}
      />
    </div>
  )
}
