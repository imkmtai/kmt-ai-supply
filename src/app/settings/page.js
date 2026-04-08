'use client'

import { useState } from 'react'
import { products, emailSettings, shopifySettings } from '@/data/mockData'

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
  return <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: '600', color: c.umber, marginBottom: '4px' }}>{children}</h2>
}

function Toggle({ checked, onChange, label, description }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '14px 0', borderBottom: `1px solid ${c.softDune}` }}>
      <div>
        <div style={{ fontSize: '14px', fontWeight: '500', color: c.black, fontFamily: 'var(--font-body)' }}>{label}</div>
        {description && <div style={{ fontSize: '12px', color: c.taupe, marginTop: '3px', fontFamily: 'var(--font-body)' }}>{description}</div>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        style={{
          width: '44px',
          height: '24px',
          borderRadius: '12px',
          border: 'none',
          backgroundColor: checked ? c.umber : c.softDune,
          cursor: 'pointer',
          position: 'relative',
          transition: 'background-color 0.2s ease',
          flexShrink: 0,
          marginLeft: '24px',
          marginTop: '2px',
        }}
        aria-label={label}
      >
        <span style={{
          position: 'absolute',
          top: '3px',
          left: checked ? '23px' : '3px',
          width: '18px',
          height: '18px',
          borderRadius: '50%',
          backgroundColor: '#fff',
          transition: 'left 0.2s ease',
        }} />
      </button>
    </div>
  )
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

const labelStyle = {
  fontSize: '11px',
  fontWeight: '500',
  color: c.taupe,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  display: 'block',
  marginBottom: '6px',
}

export default function SettingsPage() {
  const [productList, setProductList] = useState(products.map(p => ({ ...p })))
  const [email, setEmail] = useState(emailSettings)
  const [shopify, setShopify] = useState(shopifySettings)
  const [savedSection, setSavedSection] = useState(null)
  const [editingProduct, setEditingProduct] = useState(null)

  const save = (section) => {
    setSavedSection(section)
    setTimeout(() => setSavedSection(null), 2500)
  }

  const updateProductThreshold = (id, value) => {
    setProductList(prev => prev.map(p => p.id === id ? { ...p, reorderThreshold: Number(value) } : p))
  }

  const updateProductPrice = (id, value) => {
    setProductList(prev => prev.map(p => p.id === id ? { ...p, sellingPrice: Number(value) } : p))
  }

  return (
    <div>
      <div style={{ marginBottom: '36px' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '32px', fontWeight: '600', color: c.umber }}>Settings</h1>
        <p style={{ marginTop: '6px', fontSize: '14px', color: c.taupe }}>Manage products, alert preferences, and integrations</p>
      </div>

      {/* Products */}
      <Card style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
          <div>
            <SectionTitle>Products</SectionTitle>
            <p style={{ fontSize: '13px', color: c.taupe, fontFamily: 'var(--font-body)', marginBottom: '20px' }}>Configure reorder thresholds and selling prices per SKU</p>
          </div>
          {savedSection === 'products' && (
            <div style={{ fontSize: '13px', color: '#2d6a4f', fontWeight: '500', fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              ✓ Saved
            </div>
          )}
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-body)', fontSize: '13px', marginBottom: '20px' }}>
          <thead>
            <tr style={{ backgroundColor: c.softDune }}>
              {['SKU', 'Product Name', 'Category', 'Reorder Threshold (units)', 'Selling Price (USD)', 'Actions'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '10px 16px', color: c.umber, fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {productList.map((p, i) => (
              <tr key={p.id} style={{ backgroundColor: i % 2 === 0 ? '#fff' : c.vanilla, borderBottom: `1px solid ${c.softDune}` }}>
                <td style={{ padding: '12px 16px', fontWeight: '600', color: c.umber, fontFamily: 'monospace', fontSize: '12px' }}>{p.id}</td>
                <td style={{ padding: '12px 16px', color: c.black, fontWeight: '500' }}>{p.name}</td>
                <td style={{ padding: '12px 16px', color: c.taupe }}>{p.category}</td>
                <td style={{ padding: '12px 16px' }}>
                  {editingProduct === p.id ? (
                    <input
                      type="number"
                      min="1"
                      value={p.reorderThreshold}
                      onChange={e => updateProductThreshold(p.id, e.target.value)}
                      style={{ ...inputStyle, width: '100px' }}
                      autoFocus
                    />
                  ) : (
                    <span style={{ fontWeight: '500', color: c.black }}>{p.reorderThreshold.toLocaleString()}</span>
                  )}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  {editingProduct === p.id ? (
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={p.sellingPrice}
                      onChange={e => updateProductPrice(p.id, e.target.value)}
                      style={{ ...inputStyle, width: '100px' }}
                    />
                  ) : (
                    <span style={{ fontWeight: '500', color: c.black }}>${p.sellingPrice.toFixed(2)}</span>
                  )}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  {editingProduct === p.id ? (
                    <button
                      onClick={() => { setEditingProduct(null); save('products') }}
                      style={{ padding: '5px 12px', backgroundColor: c.umber, color: c.vanilla, border: 'none', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-body)' }}
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => setEditingProduct(p.id)}
                      style={{ padding: '5px 12px', backgroundColor: 'transparent', color: c.umber, border: `1px solid ${c.taupe}`, borderRadius: '4px', fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-body)' }}
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Email Alerts */}
      <Card style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <SectionTitle>Email Alert Preferences</SectionTitle>
            <p style={{ fontSize: '13px', color: c.taupe, fontFamily: 'var(--font-body)', marginBottom: '20px' }}>Configure when and where automated alerts are sent</p>
          </div>
          {savedSection === 'email' && (
            <div style={{ fontSize: '13px', color: '#2d6a4f', fontWeight: '500', fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              ✓ Saved
            </div>
          )}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>Alert Email Address</label>
          <input
            type="email"
            value={email.alertEmail}
            onChange={e => setEmail({ ...email, alertEmail: e.target.value })}
            style={{ ...inputStyle, maxWidth: '360px' }}
          />
        </div>

        <div>
          <Toggle
            checked={email.lowStockAlerts}
            onChange={v => setEmail({ ...email, lowStockAlerts: v })}
            label="Low Stock Alerts"
            description="Send an alert when any product falls below its reorder threshold"
          />
          <Toggle
            checked={email.paymentDueAlerts}
            onChange={v => setEmail({ ...email, paymentDueAlerts: v })}
            label="Payment Due Alerts"
            description="Remind when a supplier deposit or final payment is outstanding"
          />
          <Toggle
            checked={email.batchReceivedAlerts}
            onChange={v => setEmail({ ...email, batchReceivedAlerts: v })}
            label="Batch Received Confirmations"
            description="Send a confirmation email when stock is marked as received"
          />
          <Toggle
            checked={email.weeklyDigest}
            onChange={v => setEmail({ ...email, weeklyDigest: v })}
            label="Weekly Digest"
            description="A summary of stock levels, costs, and outstanding payments each week"
          />
        </div>

        {email.weeklyDigest && (
          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: `1px solid ${c.softDune}` }}>
            <label style={labelStyle}>Digest Day</label>
            <select
              value={email.digestDay}
              onChange={e => setEmail({ ...email, digestDay: e.target.value })}
              style={{ ...inputStyle, maxWidth: '200px' }}
            >
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        )}

        <div style={{ marginTop: '20px' }}>
          <button onClick={() => save('email')} style={{ padding: '10px 24px', backgroundColor: c.umber, color: c.vanilla, border: 'none', borderRadius: '4px', fontSize: '13px', fontWeight: '500', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
            Save Email Settings
          </button>
        </div>
      </Card>

      {/* Shopify Integration */}
      <Card>
        <SectionTitle>Shopify Integration</SectionTitle>
        <p style={{ fontSize: '13px', color: c.taupe, fontFamily: 'var(--font-body)', marginBottom: '24px' }}>
          Connect your Shopify store to sync inventory levels and product data. This integration slot is ready to configure.
        </p>

        <div style={{ backgroundColor: c.vanilla, border: `1px solid ${c.softDune}`, borderRadius: '6px', padding: '20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '40px', height: '40px', backgroundColor: c.softDune, borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
            🛍
          </div>
          <div>
            <div style={{ fontWeight: '600', color: c.black, fontFamily: 'var(--font-body)', fontSize: '14px' }}>Shopify Store</div>
            <div style={{ fontSize: '12px', color: c.taupe, fontFamily: 'var(--font-body)', marginTop: '2px' }}>
              {shopify.connected ? `Connected to ${shopify.storeUrl}` : 'Not connected — enter your API credentials below'}
            </div>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <span style={{
              display: 'inline-block',
              padding: '4px 12px',
              borderRadius: '3px',
              fontSize: '11px',
              fontWeight: '600',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              backgroundColor: shopify.connected ? '#eaf4ee' : c.softDune,
              color: shopify.connected ? '#2d6a4f' : c.taupe,
            }}>
              {shopify.connected ? 'Connected' : 'Not Connected'}
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          <div>
            <label style={labelStyle}>Store URL</label>
            <input
              type="text"
              placeholder="yourstore.myshopify.com"
              value={shopify.storeUrl}
              onChange={e => setShopify({ ...shopify, storeUrl: e.target.value })}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Admin API Access Token</label>
            <input
              type="password"
              placeholder="shpat_xxxxxxxxxxxxxxxx"
              value={shopify.apiKey}
              onChange={e => setShopify({ ...shopify, apiKey: e.target.value })}
              style={inputStyle}
            />
          </div>
        </div>

        <div style={{ backgroundColor: c.softDune, borderRadius: '4px', padding: '12px 16px', marginBottom: '20px', fontSize: '12px', color: c.umber, fontFamily: 'var(--font-body)' }}>
          <strong>When connected:</strong> ARDA Supply will sync inventory counts to Shopify product variants, and pull order data to automatically deduct stock. The Shopify Admin API requires the <code style={{ fontFamily: 'monospace', backgroundColor: c.vanilla, padding: '1px 4px', borderRadius: '2px' }}>read_inventory</code> and <code style={{ fontFamily: 'monospace', backgroundColor: c.vanilla, padding: '1px 4px', borderRadius: '2px' }}>write_inventory</code> scopes.
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => save('shopify')}
            style={{ padding: '10px 24px', backgroundColor: c.umber, color: c.vanilla, border: 'none', borderRadius: '4px', fontSize: '13px', fontWeight: '500', cursor: 'pointer', fontFamily: 'var(--font-body)' }}
          >
            {shopify.connected ? 'Update Connection' : 'Connect Shopify'}
          </button>
          {shopify.connected && (
            <button style={{ padding: '10px 20px', backgroundColor: 'transparent', color: '#721c24', border: '1px solid #dc3545', borderRadius: '4px', fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
              Disconnect
            </button>
          )}
        </div>

        {savedSection === 'shopify' && (
          <div style={{ marginTop: '16px', fontSize: '13px', color: '#2d6a4f', fontWeight: '500', fontFamily: 'var(--font-body)' }}>
            ✓ Settings saved. (Mock — no connection established)
          </div>
        )}
      </Card>
    </div>
  )
}
