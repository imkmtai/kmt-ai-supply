'use client'

import { useState, useEffect } from 'react'

// ─── Design tokens ────────────────────────────────────────────
const c = {
  vanilla: '#F8F4EE',
  softDune: '#E4DDCC',
  taupe: '#C5B49D',
  umber: '#443A35',
  black: '#252525',
}

// ─── Responsive hook ──────────────────────────────────────────
function useWindowSize() {
  const [width, setWidth] = useState(1200)
  useEffect(() => {
    setWidth(window.innerWidth)
    const fn = () => setWidth(window.innerWidth)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])
  return { isMobile: width < 768 }
}

// ─── Mock data ────────────────────────────────────────────────
// stockUnits: 87+0+64+43+28 = 222 | salesMonth: 42+28+35+47+32 = 184 | activeBatches: 3
const PRODUCTS = [
  { name: 'Sea Mist',    sku: 'AR-001', stockUnits: 87,  stockStatus: 'ok',  threshold: 70,  wac: 11.00, salePrice: 45.00, salesMonth: 42,  batch1Active: true,  batch1Stock: 87,  batch2Status: 'In Production', activeBatches: 1, channels: ['online', 'in-store'] },
  { name: 'Glow Oil',   sku: 'AR-002', stockUnits: 0,   stockStatus: 'out', threshold: 30,  wac: 18.20, salePrice: 85.00, salesMonth: 28,  batch1Active: false, batch1Stock: 0,   batch2Status: 'In Production', activeBatches: 1, channels: ['online'] },
  { name: 'Body Lotion', sku: 'AR-003', stockUnits: 64,  stockStatus: 'ok',  threshold: 50,  wac: 9.50,  salePrice: 55.00, salesMonth: 35,  batch1Active: true,  batch1Stock: 64,  batch2Status: 'Not Ordered',   activeBatches: 0, channels: ['online', 'in-store'] },
  { name: 'Hand Wash',  sku: 'AR-004', stockUnits: 43,  stockStatus: 'low', threshold: 50,  wac: 22.00, salePrice: 38.00, salesMonth: 47,  batch1Active: true,  batch1Stock: 43,  batch2Status: 'Ready',         activeBatches: 1, channels: ['in-store'] },
  { name: 'Lip Balm',   sku: 'AR-005', stockUnits: 28,  stockStatus: 'low', threshold: 35,  wac: 18.50, salePrice: 28.00, salesMonth: 32,  batch1Active: true,  batch1Stock: 28,  batch2Status: 'Delivered',     activeBatches: 0, channels: ['online', 'in-store'] },
]

const AI_INSIGHTS = [
  'Sea Mist will run out in approximately 18 days at current sales rate',
  'Packaging costs have risen 15% over your last 2 batches',
  'Glow Oil reorder recommended — Batch 2 not yet started',
]

const AI_SUGGESTIONS = [
  { name: 'Sea Mist',  sku: 'AR-001', qty: 1000, reason: '18 days of stock remaining', costPerUnit: 11.00 },
  { name: 'Glow Oil',  sku: 'AR-002', qty: 500,  reason: 'Out of stock, Batch 2 not yet started', costPerUnit: 18.20 },
  { name: 'Lip Balm',  sku: 'AR-005', qty: 800,  reason: '15 days of stock remaining', costPerUnit: 18.50 },
]

// Per-product detail data (last 3 orders + WAC history)
const PRODUCT_DETAILS = {
  'AR-001': {
    lastOrders: [
      { date: '2026-03-15', qty: 500, batch: 'SM-2026-001' },
      { date: '2025-11-20', qty: 800, batch: 'SM-2025-002' },
      { date: '2025-07-08', qty: 500, batch: 'SM-2025-001' },
    ],
    wacHistory: [
      { batch: 'SM-2025-001', wac: 10.50 },
      { batch: 'SM-2025-002', wac: 11.00 },
      { batch: 'SM-2026-001', wac: 11.20 },
    ],
  },
  'AR-002': {
    lastOrders: [
      { date: '2026-03-01', qty: 300, batch: 'GO-2026-001' },
      { date: '2025-09-14', qty: 400, batch: 'GO-2025-002' },
      { date: '2025-04-22', qty: 300, batch: 'GO-2025-001' },
    ],
    wacHistory: [
      { batch: 'GO-2025-001', wac: 16.80 },
      { batch: 'GO-2025-002', wac: 17.40 },
      { batch: 'GO-2026-001', wac: 18.20 },
    ],
  },
  'AR-003': {
    lastOrders: [
      { date: '2026-02-10', qty: 600, batch: 'BL-2026-001' },
      { date: '2025-10-05', qty: 700, batch: 'BL-2025-002' },
      { date: '2025-05-18', qty: 600, batch: 'BL-2025-001' },
    ],
    wacHistory: [
      { batch: 'BL-2025-001', wac: 9.10 },
      { batch: 'BL-2025-002', wac: 9.30 },
      { batch: 'BL-2026-001', wac: 9.50 },
    ],
  },
  'AR-004': {
    lastOrders: [
      { date: '2026-01-22', qty: 500, batch: 'HW-2026-001' },
      { date: '2025-08-30', qty: 600, batch: 'HW-2025-002' },
      { date: '2025-03-12', qty: 500, batch: 'HW-2025-001' },
    ],
    wacHistory: [
      { batch: 'HW-2025-001', wac: 20.50 },
      { batch: 'HW-2025-002', wac: 21.20 },
      { batch: 'HW-2026-001', wac: 22.00 },
    ],
  },
  'AR-005': {
    lastOrders: [
      { date: '2026-02-28', qty: 400, batch: 'LB-2026-001' },
      { date: '2025-09-10', qty: 500, batch: 'LB-2025-002' },
      { date: '2025-04-01', qty: 400, batch: 'LB-2025-001' },
    ],
    wacHistory: [
      { batch: 'LB-2025-001', wac: 16.80 },
      { batch: 'LB-2025-002', wac: 17.50 },
      { batch: 'LB-2026-001', wac: 18.50 },
    ],
  },
}

// ─── Helpers ──────────────────────────────────────────────────
const STOCK_BADGE = {
  ok:  { bg: '#eaf4ee', color: '#2d6a4f', label: 'OK' },
  low: { bg: '#fff3cd', color: '#856404', label: 'LOW' },
  out: { bg: '#f8d7da', color: '#721c24', label: 'OUT' },
}

function marginColor(m) { return m > 50 ? '#2d6a4f' : m > 20 ? '#856404' : '#721c24' }

function numStyle(size = '16px', extra = {}) {
  return { fontSize: size, fontWeight: '600', color: c.umber, fontFamily: 'var(--font-body)', lineHeight: 1, ...extra }
}

function batchStatusStr(p) {
  const parts = []
  if (p.batch1Active) parts.push('B1 Active')
  if (p.batch2Status !== 'Not Ordered') parts.push(`B2 ${p.batch2Status}`)
  return parts.join(' · ') || '—'
}

function StockBadge({ status }) {
  const s = STOCK_BADGE[status] || STOCK_BADGE.ok
  return (
    <span style={{
      display: 'inline-block', padding: '2px 7px', borderRadius: '3px',
      fontSize: '10px', fontWeight: '700', letterSpacing: '0.07em', textTransform: 'uppercase',
      backgroundColor: s.bg, color: s.color, fontFamily: 'var(--font-body)',
    }}>{s.label}</span>
  )
}

function ChannelDots({ channels }) {
  return (
    <span style={{ display: 'inline-flex', gap: '3px', marginLeft: '5px', verticalAlign: 'middle' }}>
      {channels.includes('online') && (
        <span title="Online" style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#2d6a4f', display: 'inline-block' }} />
      )}
      {channels.includes('in-store') && (
        <span title="In-store" style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#2563eb', display: 'inline-block' }} />
      )}
    </span>
  )
}

// ─── Metrics bar ──────────────────────────────────────────────
function MetricsBar({ activeProducts, isMobile }) {
  const totalSalesMonth    = activeProducts.reduce((s, p) => s + p.salesMonth, 0)
  const totalStockUnits    = activeProducts.reduce((s, p) => s + p.stockUnits, 0)
  const totalActiveBatches = activeProducts.reduce((s, p) => s + p.activeBatches, 0)

  const metrics = [
    { label: 'Units Sold This Month', value: totalSalesMonth.toLocaleString(), trend: '↑ +8.6%', trendColor: '#2d6a4f' },
    { label: 'Total Units in Stock',  value: totalStockUnits.toLocaleString(),  trend: '↓ -2.1%', trendColor: '#dc3545' },
    { label: 'Active Batches',        value: totalActiveBatches.toString(),      trend: null,       trendColor: null },
  ]

  return (
    <div style={{
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      borderBottom: `1px solid ${c.softDune}`,
      marginBottom: '14px',
      paddingBottom: '14px',
    }}>
      {metrics.map((m, i) => (
        <div key={m.label} style={{
          flex: 1,
          padding: isMobile ? '8px 0' : '0 20px',
          paddingLeft: !isMobile && i === 0 ? '0' : undefined,
          display: 'flex',
          flexDirection: isMobile ? 'row' : 'column',
          alignItems: isMobile ? 'center' : 'flex-start',
          justifyContent: isMobile ? 'space-between' : 'flex-start',
          borderBottom: isMobile && i < metrics.length - 1 ? `1px solid ${c.softDune}` : 'none',
        }}>
          <span style={{ fontSize: '11px', fontWeight: '700', color: c.taupe, fontFamily: 'var(--font-body)', letterSpacing: '0.04em', marginBottom: isMobile ? 0 : '4px', whiteSpace: 'nowrap' }}>
            {m.label}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={numStyle('18px')}>{m.value}</span>
            {m.trend && (
              <span style={{ fontSize: '11px', fontWeight: '500', color: m.trendColor, fontFamily: 'var(--font-body)', whiteSpace: 'nowrap' }}>
                {m.trend}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Insights panel ───────────────────────────────────────────
function InsightsPanel() {
  const [open, setOpen] = useState(false)
  return (
    <div style={{
      backgroundColor: '#fff', border: `1px solid ${c.softDune}`,
      borderRadius: '6px', marginBottom: '14px', overflow: 'hidden',
    }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width: '100%', background: 'none', border: 'none',
          padding: '10px 16px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '10px',
        }}
      >
        <span style={{ fontSize: '13px', color: c.umber }}>✦</span>
        <span style={{ flex: 1, textAlign: 'left', fontSize: '13px', color: c.umber, fontFamily: 'var(--font-body)', fontWeight: '500' }}>
          {AI_INSIGHTS.length} AI insights available
        </span>
        <span style={{ fontSize: '11px', color: c.taupe, transition: 'transform 0.15s', display: 'inline-block', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>▾</span>
      </button>
      {open && (
        <div style={{ padding: '0 16px 12px', borderTop: `1px solid ${c.softDune}` }}>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', paddingTop: '10px' }}>
            {AI_INSIGHTS.map((insight, i) => (
              <li key={i} style={{ display: 'flex', gap: '8px', fontSize: '13px', color: c.black, fontFamily: 'var(--font-body)', lineHeight: 1.5 }}>
                <span style={{ color: c.taupe, flexShrink: 0 }}>·</span>
                {insight}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// ─── Details panel ────────────────────────────────────────────
function DetailsPanel({ product, isMobile, onClose, onReorder }) {
  const [channels, setChannels] = useState(product?.channels || [])

  // Sync channels when product changes
  useEffect(() => { setChannels(product?.channels || []) }, [product?.sku])

  function toggleChannel(ch) {
    setChannels(prev => prev.includes(ch) ? prev.filter(c => c !== ch) : [...prev, ch])
  }

  const detail = product ? PRODUCT_DETAILS[product.sku] : null
  const wacHistory = detail?.wacHistory || []
  const wacFirst = wacHistory[0]?.wac
  const wacLast  = wacHistory[wacHistory.length - 1]?.wac
  const wacChange = wacFirst ? ((wacLast - wacFirst) / wacFirst * 100).toFixed(1) : null
  const wacUp = wacLast > wacFirst

  const panelStyle = isMobile ? {
    position: 'fixed', bottom: 0, left: 0, right: 0,
    height: 'auto', maxHeight: '82vh',
    borderTop: `1px solid ${c.softDune}`, borderRadius: '12px 12px 0 0',
    transform: product ? 'translateY(0)' : 'translateY(100%)',
    transition: 'transform 0.28s cubic-bezier(0.4,0,0.2,1)',
  } : {
    position: 'fixed', top: 0, right: 0,
    width: '400px', height: '100vh',
    borderLeft: `1px solid ${c.softDune}`,
    transform: product ? 'translateX(0)' : 'translateX(100%)',
    transition: 'transform 0.28s cubic-bezier(0.4,0,0.2,1)',
  }

  const btnBase = {
    padding: '5px 14px', borderRadius: '3px', fontSize: '12px',
    fontFamily: 'var(--font-body)', cursor: 'pointer', fontWeight: '500', border: 'none',
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', top: 0, left: isMobile ? 0 : '240px', right: 0, bottom: 0,
          backgroundColor: 'rgba(37,37,37,0.2)',
          opacity: product ? 1 : 0, pointerEvents: product ? 'auto' : 'none',
          transition: 'opacity 0.22s ease', zIndex: 198,
        }}
      />

      <div style={{
        ...panelStyle,
        backgroundColor: '#fff', zIndex: 199,
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        {/* Drag handle on mobile */}
        {isMobile && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 4px' }}>
            <div style={{ width: '36px', height: '4px', borderRadius: '2px', backgroundColor: c.softDune }} />
          </div>
        )}

        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${c.softDune}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          {product && (
            <div>
              <div style={{ fontWeight: '600', fontSize: '15px', color: c.umber, fontFamily: 'var(--font-body)' }}>{product.name}</div>
              <div style={{ fontSize: '11px', color: c.taupe, marginTop: '2px', fontFamily: 'var(--font-body)' }}>{product.sku}</div>
            </div>
          )}
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '18px', color: c.taupe, cursor: 'pointer', padding: '4px', lineHeight: 1 }}>✕</button>
        </div>

        {/* Body */}
        {product && (
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>

            {/* Stock */}
            <div style={{ marginBottom: '18px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ backgroundColor: c.vanilla, borderRadius: '5px', padding: '12px' }}>
                <div style={{ fontSize: '11px', color: c.taupe, fontFamily: 'var(--font-body)', marginBottom: '4px' }}>Current Stock</div>
                <div style={numStyle('18px')}>{product.stockUnits.toLocaleString()}</div>
                <StockBadge status={product.stockStatus} />
              </div>
              <div style={{ backgroundColor: c.vanilla, borderRadius: '5px', padding: '12px' }}>
                <div style={{ fontSize: '11px', color: c.taupe, fontFamily: 'var(--font-body)', marginBottom: '4px' }}>Threshold</div>
                <div style={numStyle('18px')}>{product.threshold}</div>
                <div style={{ fontSize: '11px', color: c.taupe, fontFamily: 'var(--font-body)', marginTop: '3px' }}>reorder point</div>
              </div>
            </div>

            {/* Batch status */}
            <div style={{ marginBottom: '18px' }}>
              <div style={{ fontSize: '11px', color: c.taupe, textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: '8px', fontFamily: 'var(--font-body)' }}>Batch Status</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <div style={{ fontSize: '12px', color: c.black, fontFamily: 'var(--font-body)', backgroundColor: product.batch1Active ? '#eaf4ee' : c.softDune, color: product.batch1Active ? '#2d6a4f' : c.taupe, padding: '4px 10px', borderRadius: '3px', fontWeight: '500' }}>
                  Batch 1 · {product.batch1Active ? `${product.batch1Stock} units` : 'Depleted'}
                </div>
                <div style={{ fontSize: '12px', fontFamily: 'var(--font-body)', padding: '4px 10px', borderRadius: '3px', fontWeight: '500',
                  backgroundColor: product.batch2Status === 'In Production' ? '#fff3cd' : product.batch2Status === 'Ready' || product.batch2Status === 'Delivered' ? '#eaf4ee' : c.softDune,
                  color: product.batch2Status === 'In Production' ? '#856404' : product.batch2Status === 'Ready' || product.batch2Status === 'Delivered' ? '#2d6a4f' : c.taupe,
                }}>
                  Batch 2 · {product.batch2Status}
                </div>
              </div>
            </div>

            {/* Last 3 orders */}
            <div style={{ marginBottom: '18px' }}>
              <div style={{ fontSize: '11px', color: c.taupe, textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: '8px', fontFamily: 'var(--font-body)' }}>Last 3 Orders</div>
              <div style={{ border: `1px solid ${c.softDune}`, borderRadius: '5px', overflow: 'hidden' }}>
                {(detail?.lastOrders || []).map((o, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '9px 12px',
                    borderBottom: i < 2 ? `1px solid ${c.softDune}` : 'none',
                    backgroundColor: i % 2 === 0 ? '#fff' : c.vanilla,
                  }}>
                    <div>
                      <div style={{ fontSize: '12px', color: c.black, fontFamily: 'var(--font-body)', fontWeight: '500' }}>{o.batch}</div>
                      <div style={{ fontSize: '11px', color: c.taupe, fontFamily: 'var(--font-body)', marginTop: '1px' }}>{o.date}</div>
                    </div>
                    <div style={numStyle('13px')}>{o.qty.toLocaleString()} units</div>
                  </div>
                ))}
              </div>
            </div>

            {/* WAC history */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '11px', color: c.taupe, textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: '8px', fontFamily: 'var(--font-body)' }}>
                WAC Trend · Last 3 Batches
                {wacChange !== null && (
                  <span style={{ marginLeft: '8px', fontWeight: '600', color: wacUp ? '#dc3545' : '#2d6a4f', fontSize: '11px', textTransform: 'none', letterSpacing: 0 }}>
                    {wacUp ? '↑' : '↓'} {Math.abs(wacChange)}% overall
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                {wacHistory.map((w, i) => {
                  const prev = wacHistory[i - 1]
                  const up = prev && w.wac > prev.wac
                  const down = prev && w.wac < prev.wac
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {i > 0 && (
                        <span style={{ fontSize: '12px', color: up ? '#dc3545' : '#2d6a4f', fontFamily: 'var(--font-body)' }}>
                          {up ? '↑' : '↓'}
                        </span>
                      )}
                      <div style={{ backgroundColor: c.vanilla, borderRadius: '4px', padding: '6px 10px', textAlign: 'center' }}>
                        <div style={{ fontSize: '10px', color: c.taupe, fontFamily: 'var(--font-body)', marginBottom: '2px' }}>{w.batch.split('-').slice(-1)[0]}</div>
                        <div style={numStyle('13px')}>${w.wac.toFixed(2)}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Start Reorder */}
            <button
              onClick={() => { onClose(); onReorder() }}
              style={{
                width: '100%', padding: '11px',
                backgroundColor: c.umber, color: '#fff',
                border: 'none', borderRadius: '4px',
                fontSize: '13px', fontWeight: '500', cursor: 'pointer',
                fontFamily: 'var(--font-body)', letterSpacing: '0.02em',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}
            >
              <span style={{ fontSize: '13px' }}>✦</span>
              Start Reorder
            </button>
          </div>
        )}
      </div>
    </>
  )
}

// ─── Suggest tab ──────────────────────────────────────────────
function SuggestTab({ confirmedItems, onToggle, onCreateBatch }) {
  return (
    <div>
      <p style={{ fontSize: '13px', color: c.taupe, marginBottom: '16px', fontFamily: 'var(--font-body)', lineHeight: 1.6 }}>
        Based on current sales velocity and stock levels:
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
        {AI_SUGGESTIONS.map((s, i) => {
          const confirmed = confirmedItems.has(i)
          return (
            <div key={i} style={{
              border: `1px solid ${confirmed ? c.umber : c.softDune}`,
              borderRadius: '6px', padding: '14px',
              backgroundColor: confirmed ? c.vanilla : '#fff',
              transition: 'border-color 0.15s ease, background-color 0.15s ease',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '13px', color: c.umber, fontFamily: 'var(--font-body)' }}>{s.name}</div>
                  <div style={{ fontSize: '11px', color: c.taupe, marginTop: '1px', fontFamily: 'var(--font-body)' }}>{s.sku}</div>
                </div>
                <button onClick={() => onToggle(i)} style={{
                  padding: '4px 12px', fontSize: '11px', fontWeight: '500',
                  backgroundColor: confirmed ? c.umber : 'transparent',
                  color: confirmed ? '#fff' : c.umber,
                  border: `1px solid ${c.umber}`, borderRadius: '3px',
                  cursor: 'pointer', fontFamily: 'var(--font-body)',
                  whiteSpace: 'nowrap',
                }}>{confirmed ? '✓ Added' : 'Add to Order'}</button>
              </div>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '6px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: c.taupe, fontFamily: 'var(--font-body)', marginBottom: '2px' }}>Qty</div>
                  <div style={numStyle('14px')}>{s.qty.toLocaleString()}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: c.taupe, fontFamily: 'var(--font-body)', marginBottom: '2px' }}>Est. Cost</div>
                  <div style={numStyle('14px')}>${(s.qty * s.costPerUnit).toLocaleString()}</div>
                </div>
              </div>
              <div style={{ fontSize: '11px', color: c.taupe, fontFamily: 'var(--font-body)', fontStyle: 'italic' }}>{s.reason}</div>
            </div>
          )
        })}
      </div>
      {confirmedItems.size > 0 && (
        <button onClick={onCreateBatch} style={{
          width: '100%', padding: '11px', backgroundColor: c.umber, color: '#fff',
          border: 'none', borderRadius: '4px', fontSize: '13px', fontWeight: '500',
          cursor: 'pointer', fontFamily: 'var(--font-body)',
        }}>
          Create Batch · {confirmedItems.size} item{confirmedItems.size > 1 ? 's' : ''}
        </button>
      )}
    </div>
  )
}

// ─── Tell AI tab ──────────────────────────────────────────────
function TellTab({ input, onInputChange, onSubmit, loading, result, error, onCreateBatch }) {
  return (
    <div>
      <p style={{ fontSize: '13px', color: c.taupe, marginBottom: '16px', fontFamily: 'var(--font-body)', lineHeight: 1.6 }}>
        Describe your order in plain English. AI will parse it into a structured batch.
      </p>
      <form onSubmit={onSubmit}>
        <input
          value={input}
          onChange={e => onInputChange(e.target.value)}
          placeholder='e.g. Order 3,000 Sea Mist and 2,000 Glow Oil'
          style={{
            width: '100%', padding: '9px 12px', marginBottom: '10px',
            border: `1px solid ${c.softDune}`, borderRadius: '4px',
            fontSize: '13px', fontFamily: 'var(--font-body)', color: c.black,
            backgroundColor: '#fff', outline: 'none', boxSizing: 'border-box',
          }}
        />
        <button type="submit" disabled={loading || !input.trim()} style={{
          padding: '8px 18px', backgroundColor: loading || !input.trim() ? c.taupe : c.umber,
          color: '#fff', border: 'none', borderRadius: '4px',
          fontSize: '13px', fontWeight: '500', cursor: loading || !input.trim() ? 'default' : 'pointer',
          fontFamily: 'var(--font-body)', marginBottom: '16px',
        }}>
          {loading ? 'Parsing…' : '✦ Parse Order'}
        </button>
      </form>

      {error && (
        <div style={{ backgroundColor: '#f8d7da', border: '1px solid #f5c6cb', borderRadius: '4px', padding: '10px 12px', fontSize: '12px', color: '#721c24', fontFamily: 'var(--font-body)', marginBottom: '14px', lineHeight: 1.5 }}>
          {error}
        </div>
      )}

      {result && result.length > 0 && (
        <>
          <div style={{ fontSize: '11px', color: c.taupe, textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: '10px', fontFamily: 'var(--font-body)' }}>Parsed Order</div>
          <div style={{ border: `1px solid ${c.softDune}`, borderRadius: '5px', overflow: 'hidden', marginBottom: '16px' }}>
            {result.map((item, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 14px', borderBottom: i < result.length - 1 ? `1px solid ${c.softDune}` : 'none',
                backgroundColor: i % 2 === 0 ? '#fff' : c.vanilla,
              }}>
                <div>
                  <div style={{ fontWeight: '500', color: c.black, fontSize: '13px', fontFamily: 'var(--font-body)' }}>{item.product}</div>
                  {item.sku && <div style={{ fontSize: '11px', color: c.taupe, marginTop: '1px', fontFamily: 'var(--font-body)' }}>{item.sku}</div>}
                </div>
                <div style={numStyle('13px')}>{(item.quantity || 0).toLocaleString()} units</div>
              </div>
            ))}
          </div>
          <button onClick={onCreateBatch} style={{
            width: '100%', padding: '11px', backgroundColor: c.umber, color: '#fff',
            border: 'none', borderRadius: '4px', fontSize: '13px', fontWeight: '500',
            cursor: 'pointer', fontFamily: 'var(--font-body)',
          }}>Create Batch Order</button>
        </>
      )}

      {result && result.length === 0 && (
        <div style={{ fontSize: '13px', color: c.taupe, fontFamily: 'var(--font-body)' }}>
          No products recognised. Try again using catalogue names.
        </div>
      )}
    </div>
  )
}

// ─── Dashboard ────────────────────────────────────────────────
export default function Dashboard() {
  const { isMobile } = useWindowSize()

  // Filter
  const [selectedProducts, setSelectedProducts] = useState(new Set())
  const isAll = selectedProducts.size === 0
  const activeProducts = isAll ? PRODUCTS : PRODUCTS.filter(p => selectedProducts.has(p.name))

  function toggleProduct(name) {
    if (name === 'All') { setSelectedProducts(new Set()); return }
    const next = new Set(selectedProducts)
    next.has(name) ? next.delete(name) : next.add(name)
    setSelectedProducts(next)
  }

  // Details panel
  const [detailProduct, setDetailProduct] = useState(null)

  // Order panel
  const [orderOpen, setOrderOpen]         = useState(false)
  const [orderTab, setOrderTab]           = useState('suggest')
  const [confirmedItems, setConfirmedItems] = useState(new Set())
  const [tellInput, setTellInput]         = useState('')
  const [tellLoading, setTellLoading]     = useState(false)
  const [tellResult, setTellResult]       = useState(null)
  const [tellError, setTellError]         = useState(null)
  const [orderSuccess, setOrderSuccess]   = useState(false)

  function toggleConfirmed(i) {
    const next = new Set(confirmedItems)
    next.has(i) ? next.delete(i) : next.add(i)
    setConfirmedItems(next)
  }

  async function handleTellSubmit(e) {
    e.preventDefault()
    if (!tellInput.trim()) return
    setTellLoading(true); setTellError(null); setTellResult(null)
    try {
      const res = await fetch('/api/parse-order', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: tellInput }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || `Error ${res.status}`)
      setTellResult(data.items)
    } catch (err) {
      setTellError(err.message || 'Could not parse order. Check ANTHROPIC_API_KEY is set.')
    } finally {
      setTellLoading(false)
    }
  }

  function handleCreateBatch() {
    setOrderSuccess(true)
    setTimeout(() => {
      setOrderSuccess(false); setOrderOpen(false)
      setConfirmedItems(new Set()); setTellResult(null); setTellInput('')
    }, 2500)
  }

  function openOrder() { setDetailProduct(null); setOrderSuccess(false); setOrderOpen(true) }

  // Table columns — WAC / Sale Price / Margin hidden on mobile
  const COLS = [
    { key: 'product',     label: 'Product',     desktop: true,  mobile: true  },
    { key: 'stock',       label: 'Stock',        desktop: true,  mobile: true  },
    { key: 'wac',         label: 'WAC',          desktop: true,  mobile: false },
    { key: 'salePrice',   label: 'Sale Price',   desktop: true,  mobile: false },
    { key: 'margin',      label: 'Margin',       desktop: true,  mobile: false },
    { key: 'batchStatus', label: 'Batch Status', desktop: true,  mobile: true  },
    { key: 'actions',     label: '',             desktop: true,  mobile: true  },
  ]
  const visibleCols = COLS.filter(col => isMobile ? col.mobile : col.desktop)

  return (
    <div style={{ paddingBottom: isMobile ? '80px' : '0' }}>
      {/* Header */}
      <div style={{ marginBottom: '16px' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', fontWeight: '500', color: '#252525', lineHeight: 1.2 }}>Dashboard</h1>
        <p style={{ marginTop: '2px', fontSize: '12px', color: c.taupe, fontFamily: 'var(--font-body)' }}>Supply Overview · 8 April 2026</p>
      </div>

      {/* Metrics */}
      <MetricsBar activeProducts={activeProducts} isMobile={isMobile} />

      {/* Pills */}
      <div style={{
        display: 'flex', gap: '6px', marginBottom: '12px',
        ...(isMobile ? { overflowX: 'auto', flexWrap: 'nowrap', paddingBottom: '4px', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' } : { flexWrap: 'wrap' }),
      }}>
        {['All', ...PRODUCTS.map(p => p.name)].map(name => {
          const active = name === 'All' ? isAll : selectedProducts.has(name)
          return (
            <button key={name} onClick={() => toggleProduct(name)} style={{
              padding: '5px 13px', borderRadius: '999px', flexShrink: 0,
              border: `1px solid ${active ? c.umber : c.softDune}`,
              backgroundColor: active ? c.umber : '#fff',
              color: active ? '#fff' : c.umber,
              fontSize: '12px', fontFamily: 'var(--font-body)',
              fontWeight: active ? '600' : '400',
              cursor: 'pointer', whiteSpace: 'nowrap',
              transition: 'all 0.12s ease',
            }}>{name}</button>
          )
        })}
      </div>

      {/* AI Insights */}
      <InsightsPanel />

      {/* Product table */}
      <div style={{ marginBottom: '24px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-body)', fontSize: '13.5px' }}>
          <thead>
            <tr>
              {visibleCols.map(col => (
                <th key={col.key} style={{
                  textAlign: 'left', padding: '12px 14px 12px 0',
                  fontSize: '11px', fontWeight: '600', color: '#C5B49D',
                  textTransform: 'uppercase', letterSpacing: '0.08em',
                  whiteSpace: 'nowrap', fontFamily: 'var(--font-body)',
                  borderBottom: `1px solid ${c.softDune}`,
                }}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {activeProducts.map((p, i) => {
              const margin = (p.salePrice - p.wac) / p.salePrice * 100
              return (
                <tr key={p.sku} style={{
                  backgroundColor: 'transparent',
                  borderBottom: `1px solid ${c.softDune}`,
                }}>
                  {visibleCols.map(col => {
                    if (col.key === 'product') return (
                      <td key="product" style={{ padding: '12px 14px 12px 0' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span style={{ fontWeight: '400', color: '#252525', fontSize: '13.5px' }}>{p.name}</span>
                        </div>
                        <div style={{ fontSize: '11px', color: c.taupe, marginTop: '1px' }}>{p.sku}</div>
                      </td>
                    )
                    if (col.key === 'stock') return (
                      <td key="stock" style={{ padding: '12px 14px 12px 0' }}>
                        <div style={{ ...numStyle('13.5px'), marginBottom: '3px' }}>{p.stockUnits.toLocaleString()}</div>
                        <StockBadge status={p.stockStatus} />
                      </td>
                    )
                    if (col.key === 'wac') return (
                      <td key="wac" style={{ padding: '12px 14px 12px 0', ...numStyle('13.5px') }}>${p.wac.toFixed(2)}</td>
                    )
                    if (col.key === 'salePrice') return (
                      <td key="salePrice" style={{ padding: '12px 14px 12px 0', ...numStyle('13.5px') }}>${p.salePrice.toFixed(2)}</td>
                    )
                    if (col.key === 'margin') return (
                      <td key="margin" style={{ padding: '12px 14px 12px 0', fontSize: '13.5px', fontWeight: '600', color: marginColor(margin), fontFamily: 'var(--font-body)' }}>
                        {margin.toFixed(1)}%
                      </td>
                    )
                    if (col.key === 'batchStatus') return (
                      <td key="batchStatus" style={{ padding: '12px 14px 12px 0', fontSize: '13.5px', color: '#252525', whiteSpace: 'nowrap' }}>
                        {batchStatusStr(p)}
                      </td>
                    )
                    if (col.key === 'actions') return (
                      <td key="actions" style={{ padding: '12px 0' }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          {!isMobile && (
                            <button
                              title="Reorder"
                              onClick={openOrder}
                              style={{
                                width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                backgroundColor: c.umber, color: '#fff',
                                border: 'none', borderRadius: '4px', cursor: 'pointer',
                                fontSize: '14px', lineHeight: 1,
                              }}
                            >↺</button>
                          )}
                          <button
                            title="Details"
                            onClick={() => setDetailProduct(p)}
                            style={{
                              width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                              backgroundColor: 'transparent', color: c.umber,
                              border: `1px solid ${c.softDune}`, borderRadius: '4px', cursor: 'pointer',
                              fontSize: '14px', lineHeight: 1,
                            }}
                          >⊙</button>
                        </div>
                      </td>
                    )
                    return null
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
        {activeProducts.length === 0 && (
          <tbody><tr><td colSpan="99" style={{ padding: '24px', textAlign: 'center', color: c.taupe, fontFamily: 'var(--font-body)', fontSize: '13px' }}>No products selected.</td></tr></tbody>
        )}
      </div>

      {/* Details panel */}
      <DetailsPanel
        product={detailProduct}
        isMobile={isMobile}
        onClose={() => setDetailProduct(null)}
        onReorder={openOrder}
      />

      {/* Floating New Order button */}
      <button
        onClick={openOrder}
        style={isMobile ? {
          position: 'fixed', bottom: 0, left: 0, right: 0,
          padding: '14px', backgroundColor: c.umber, color: '#fff',
          border: 'none', fontSize: '14px', fontWeight: '500',
          fontFamily: 'var(--font-body)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          zIndex: 150, letterSpacing: '0.01em',
        } : {
          position: 'fixed', bottom: '28px', right: '28px',
          padding: '11px 20px', backgroundColor: c.umber, color: '#fff',
          border: 'none', borderRadius: '6px',
          fontSize: '13px', fontWeight: '500', fontFamily: 'var(--font-body)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '7px',
          boxShadow: '0 4px 18px rgba(68,58,53,0.28)', zIndex: 150,
        }}
      >
        <span>✦</span> New Order
      </button>

      {/* Order panel backdrop */}
      <div
        onClick={() => setOrderOpen(false)}
        style={{
          position: 'fixed', top: 0, left: '240px', right: 0, bottom: 0,
          backgroundColor: 'rgba(37,37,37,0.2)',
          opacity: orderOpen ? 1 : 0, pointerEvents: orderOpen ? 'auto' : 'none',
          transition: 'opacity 0.22s ease', zIndex: 199,
        }}
      />

      {/* Order panel */}
      <div style={{
        position: 'fixed', top: 0, right: 0, width: isMobile ? '100%' : '420px', height: '100vh',
        backgroundColor: '#fff', borderLeft: isMobile ? 'none' : `1px solid ${c.softDune}`,
        zIndex: 200, display: 'flex', flexDirection: 'column',
        transform: orderOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.28s cubic-bezier(0.4,0,0.2,1)',
      }}>
        {/* Panel header */}
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${c.softDune}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: c.umber, fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', gap: '7px' }}>
              <span>✦</span> New Order
            </div>
            <div style={{ fontSize: '11px', color: c.taupe, marginTop: '2px', fontFamily: 'var(--font-body)' }}>AI-assisted batch ordering</div>
          </div>
          <button onClick={() => setOrderOpen(false)} style={{ background: 'none', border: 'none', fontSize: '17px', color: c.taupe, cursor: 'pointer', padding: '4px', lineHeight: 1 }}>✕</button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: `1px solid ${c.softDune}`, flexShrink: 0 }}>
          {[['suggest', '✦ AI Suggest'], ['tell', '✎ Tell AI']].map(([key, label]) => (
            <button key={key} onClick={() => setOrderTab(key)} style={{
              flex: 1, padding: '11px', border: 'none', background: 'none',
              fontSize: '13px', fontWeight: orderTab === key ? '600' : '400',
              color: orderTab === key ? c.umber : c.taupe,
              fontFamily: 'var(--font-body)',
              borderBottom: orderTab === key ? `2px solid ${c.umber}` : '2px solid transparent',
              cursor: 'pointer', marginBottom: '-1px',
            }}>{label}</button>
          ))}
        </div>

        {/* Panel body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {orderSuccess ? (
            <div style={{ backgroundColor: '#eaf4ee', border: '1px solid #2d6a4f', borderRadius: '6px', padding: '24px', textAlign: 'center' }}>
              <div style={{ fontSize: '22px', marginBottom: '8px' }}>✓</div>
              <div style={{ fontWeight: '600', color: '#2d6a4f', fontSize: '14px', fontFamily: 'var(--font-body)', marginBottom: '5px' }}>Batch order created</div>
              <div style={{ fontSize: '12px', color: '#2d6a4f', fontFamily: 'var(--font-body)' }}>Go to Batch Orders to manage it</div>
            </div>
          ) : orderTab === 'suggest' ? (
            <SuggestTab confirmedItems={confirmedItems} onToggle={toggleConfirmed} onCreateBatch={handleCreateBatch} />
          ) : (
            <TellTab input={tellInput} onInputChange={setTellInput} onSubmit={handleTellSubmit} loading={tellLoading} result={tellResult} error={tellError} onCreateBatch={handleCreateBatch} />
          )}
        </div>
      </div>
    </div>
  )
}
