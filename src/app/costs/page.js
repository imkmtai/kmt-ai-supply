'use client'

import { useState } from 'react'
import { weightedAvgCosts, products, batches } from '@/data/mockData'

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
  return <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: '600', color: c.umber, marginBottom: '16px' }}>{children}</h2>
}

function MarginBar({ margin }) {
  const color = margin > 65 ? '#2d6a4f' : margin > 45 ? '#856404' : '#dc3545'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div style={{ flex: 1, height: '6px', backgroundColor: c.softDune, borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${Math.min(100, margin)}%`, backgroundColor: color, borderRadius: '3px' }} />
      </div>
      <span style={{ fontSize: '13px', fontWeight: '600', color, width: '44px', textAlign: 'right' }}>{margin}%</span>
    </div>
  )
}

export default function CostsPage() {
  const [markup, setMarkup] = useState(60)
  const [selectedProduct, setSelectedProduct] = useState('')

  const selectedWac = weightedAvgCosts.find(w => w.productId === selectedProduct)
  const floorPrice = selectedWac ? parseFloat((selectedWac.wac * (1 + markup / 100)).toFixed(2)) : null

  return (
    <div>
      <div style={{ marginBottom: '36px' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '32px', fontWeight: '600', color: c.umber }}>Cost Analysis</h1>
        <p style={{ marginTop: '6px', fontSize: '14px', color: c.taupe }}>Weighted average costs, pricing floors, and cost trends across batches</p>
      </div>

      {/* WAC Overview */}
      <Card style={{ marginBottom: '24px', padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '24px 24px 0' }}>
          <SectionTitle>Weighted Average Cost by Product</SectionTitle>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-body)', fontSize: '13px' }}>
          <thead>
            <tr style={{ backgroundColor: c.softDune }}>
              {['Product', 'WAC / Unit', 'Total Units', 'Total Inventory Value', 'Selling Price', 'Gross Margin', 'Pricing Floor (50%)', 'Pricing Floor (60%)'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '11px 16px', color: c.umber, fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weightedAvgCosts.map((w, i) => (
              <tr key={w.productId} style={{ backgroundColor: i % 2 === 0 ? '#fff' : c.vanilla, borderBottom: `1px solid ${c.softDune}` }}>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ fontSize: '11px', color: c.taupe }}>{w.productId}</div>
                  <div style={{ fontWeight: '600', color: c.umber }}>{w.productName}</div>
                </td>
                <td style={{ padding: '14px 16px', fontWeight: '700', color: c.black, fontSize: '15px', fontFamily: 'var(--font-heading)' }}>${w.wac.toFixed(2)}</td>
                <td style={{ padding: '14px 16px', color: c.black }}>{w.totalUnits.toLocaleString()}</td>
                <td style={{ padding: '14px 16px', fontWeight: '600', color: c.umber }}>${w.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                <td style={{ padding: '14px 16px', color: c.black }}>${w.sellingPrice.toFixed(2)}</td>
                <td style={{ padding: '14px 16px', minWidth: '140px' }}><MarginBar margin={w.margin} /></td>
                <td style={{ padding: '14px 16px', color: c.black }}>${(w.wac * 1.5).toFixed(2)}</td>
                <td style={{ padding: '14px 16px', color: c.black }}>${(w.wac * 1.6).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Pricing Floor Calculator */}
        <Card>
          <SectionTitle>Pricing Floor Calculator</SectionTitle>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '11px', fontWeight: '500', color: c.taupe, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' }}>Product</label>
            <select
              value={selectedProduct}
              onChange={e => setSelectedProduct(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', border: `1px solid ${c.softDune}`, borderRadius: '4px', fontSize: '13px', fontFamily: 'var(--font-body)', backgroundColor: '#fff', color: c.black }}
            >
              <option value="">Select a product</option>
              {weightedAvgCosts.map(w => <option key={w.productId} value={w.productId}>{w.productId} – {w.productName}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '11px', fontWeight: '500', color: c.taupe, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '8px' }}>
              Markup: {markup}%
            </label>
            <input
              type="range"
              min="10"
              max="200"
              step="5"
              value={markup}
              onChange={e => setMarkup(Number(e.target.value))}
              style={{ width: '100%', accentColor: c.umber }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: c.taupe, fontFamily: 'var(--font-body)', marginTop: '4px' }}>
              <span>10%</span><span>200%</span>
            </div>
          </div>

          {selectedWac ? (
            <div style={{ backgroundColor: c.vanilla, borderRadius: '6px', padding: '20px', border: `1px solid ${c.softDune}` }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {[
                  { label: 'WAC / Unit', value: `$${selectedWac.wac.toFixed(2)}` },
                  { label: `Floor Price (${markup}% markup)`, value: `$${floorPrice}` },
                  { label: 'Current Selling Price', value: `$${selectedWac.sellingPrice.toFixed(2)}` },
                  { label: 'Current Margin', value: `${selectedWac.margin}%` },
                ].map(item => (
                  <div key={item.label}>
                    <div style={{ fontSize: '11px', color: c.taupe, marginBottom: '4px', fontFamily: 'var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.label}</div>
                    <div style={{ fontSize: '22px', fontWeight: '600', color: c.umber, fontFamily: 'var(--font-heading)' }}>{item.value}</div>
                  </div>
                ))}
              </div>
              {floorPrice && selectedWac.sellingPrice < floorPrice && (
                <div style={{ marginTop: '16px', backgroundColor: '#f8d7da', border: '1px solid #dc3545', borderRadius: '4px', padding: '10px 14px', fontSize: '13px', color: '#721c24', fontFamily: 'var(--font-body)' }}>
                  ⚠ Current selling price is below the {markup}% markup floor.
                </div>
              )}
            </div>
          ) : (
            <div style={{ backgroundColor: c.vanilla, borderRadius: '6px', padding: '32px', textAlign: 'center', color: c.taupe, fontSize: '13px', fontFamily: 'var(--font-body)' }}>
              Select a product to calculate pricing floor
            </div>
          )}
        </Card>

        {/* Total Inventory Value */}
        <Card>
          <SectionTitle>Inventory Value Summary</SectionTitle>
          {(() => {
            const totalValue = weightedAvgCosts.reduce((s, w) => s + w.totalValue, 0)
            return (
              <>
                <div style={{ backgroundColor: c.vanilla, borderRadius: '6px', padding: '20px', marginBottom: '20px', border: `1px solid ${c.softDune}` }}>
                  <div style={{ fontSize: '11px', color: c.taupe, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px', fontFamily: 'var(--font-body)' }}>Total Inventory at Cost</div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '36px', fontWeight: '600', color: c.umber }}>${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                </div>
                {weightedAvgCosts.map(w => (
                  <div key={w.productId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: `1px solid ${c.softDune}`, fontFamily: 'var(--font-body)', fontSize: '13px' }}>
                    <div>
                      <span style={{ color: c.taupe, fontSize: '11px', marginRight: '8px' }}>{w.productId}</span>
                      <span style={{ color: c.black, fontWeight: '500' }}>{w.productName}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <span style={{ color: c.taupe }}>{w.totalUnits.toLocaleString()} units</span>
                      <span style={{ fontWeight: '600', color: c.umber }}>${w.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                      <div style={{ width: '60px', height: '4px', backgroundColor: c.softDune, borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${(w.totalValue / totalValue) * 100}%`, backgroundColor: c.taupe, borderRadius: '2px' }} />
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )
          })()}
        </Card>
      </div>

      {/* Cost Trend Table */}
      <Card style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '24px 24px 0' }}>
          <SectionTitle>Cost Trend by Batch</SectionTitle>
          <p style={{ fontSize: '13px', color: c.taupe, marginBottom: '16px', fontFamily: 'var(--font-body)' }}>Per-unit cost across batches — packaging + liquid combined</p>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-body)', fontSize: '13px' }}>
          <thead>
            <tr style={{ backgroundColor: c.softDune }}>
              {['Batch', 'Product', 'Order Date', 'Cairo Pkg/u', 'Delta Mfg/u', 'WAC/u', 'Total Units', 'Batch Cost'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '11px 16px', color: c.umber, fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...batches].sort((a, b) => a.orderDate.localeCompare(b.orderDate)).map((b, i) => {
              const totalBatchCost = b.weightedAvgCost * b.totalUnits
              return (
                <tr key={b.id} style={{ backgroundColor: i % 2 === 0 ? '#fff' : c.vanilla, borderBottom: `1px solid ${c.softDune}` }}>
                  <td style={{ padding: '12px 16px', fontWeight: '600', color: c.umber }}>{b.batchNumber}</td>
                  <td style={{ padding: '12px 16px', color: c.black }}>{b.productName}</td>
                  <td style={{ padding: '12px 16px', color: c.taupe }}>{b.orderDate}</td>
                  <td style={{ padding: '12px 16px', color: c.black }}>${b.packagingCost.perUnit.toFixed(2)}</td>
                  <td style={{ padding: '12px 16px', color: c.black }}>${b.liquidCost.perUnit.toFixed(2)}</td>
                  <td style={{ padding: '12px 16px', fontWeight: '700', color: c.umber }}>${b.weightedAvgCost.toFixed(2)}</td>
                  <td style={{ padding: '12px 16px', color: c.black }}>{b.totalUnits.toLocaleString()}</td>
                  <td style={{ padding: '12px 16px', fontWeight: '600', color: c.black }}>${totalBatchCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr style={{ backgroundColor: c.softDune }}>
              <td colSpan="6" style={{ padding: '12px 16px', fontWeight: '700', color: c.umber, fontFamily: 'var(--font-body)', fontSize: '13px' }}>Total</td>
              <td style={{ padding: '12px 16px', fontWeight: '700', color: c.umber, fontFamily: 'var(--font-body)', fontSize: '13px' }}>
                {batches.reduce((s, b) => s + b.totalUnits, 0).toLocaleString()}
              </td>
              <td style={{ padding: '12px 16px', fontWeight: '700', color: c.umber, fontFamily: 'var(--font-body)', fontSize: '13px' }}>
                ${batches.reduce((s, b) => s + b.weightedAvgCost * b.totalUnits, 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </td>
            </tr>
          </tfoot>
        </table>
      </Card>
    </div>
  )
}
