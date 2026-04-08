import { stockLevels, weightedAvgCosts, outstandingPayments, batches } from '@/data/mockData'

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
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '32px', fontWeight: '600', color: c.umber, lineHeight: 1.2 }}>{title}</h1>
      {subtitle && <p style={{ marginTop: '6px', fontSize: '14px', color: c.taupe, fontFamily: 'var(--font-body)' }}>{subtitle}</p>}
    </div>
  )
}

function Card({ children, style }) {
  return (
    <div style={{
      backgroundColor: '#fff',
      border: `1px solid ${c.softDune}`,
      borderRadius: '6px',
      padding: '24px',
      ...style,
    }}>
      {children}
    </div>
  )
}

function SectionTitle({ children }) {
  return (
    <h2 style={{
      fontFamily: 'var(--font-heading)',
      fontSize: '18px',
      fontWeight: '600',
      color: c.umber,
      marginBottom: '16px',
      letterSpacing: '0.01em',
    }}>{children}</h2>
  )
}

function StatusBadge({ status }) {
  const styles = {
    ok: { bg: '#eaf4ee', color: '#2d6a4f', label: 'OK' },
    low: { bg: '#fff3cd', color: '#856404', label: 'LOW' },
    out: { bg: '#f8d7da', color: '#721c24', label: 'OUT' },
    'in-transit': { bg: c.softDune, color: c.umber, label: 'In Transit' },
    pending: { bg: c.softDune, color: c.umber, label: 'Pending' },
    received: { bg: '#eaf4ee', color: '#2d6a4f', label: 'Received' },
    outstanding: { bg: '#fff3cd', color: '#856404', label: 'Outstanding' },
    'awaiting-order': { bg: c.softDune, color: c.umber, label: 'Awaiting Order' },
    overdue: { bg: '#f8d7da', color: '#721c24', label: 'Overdue' },
  }
  const s = styles[status] || styles.pending
  return (
    <span style={{
      display: 'inline-block',
      padding: '3px 10px',
      borderRadius: '3px',
      fontSize: '11px',
      fontWeight: '600',
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      backgroundColor: s.bg,
      color: s.color,
      fontFamily: 'var(--font-body)',
    }}>{s.label}</span>
  )
}

export default function Dashboard() {
  const alerts = stockLevels.filter(s => s.status !== 'ok')
  const inTransit = batches.filter(b => b.status === 'in-transit')
  const totalOutstanding = outstandingPayments.reduce((sum, p) => sum + p.amount, 0)

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle={`Supply Overview · ${new Date('2026-04-08').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`}
      />

      {/* Alerts */}
      {alerts.length > 0 && (
        <div style={{
          backgroundColor: '#fff3cd',
          border: '1px solid #ffc107',
          borderRadius: '6px',
          padding: '14px 20px',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
        }}>
          <span style={{ fontSize: '18px', marginTop: '1px' }}>⚠</span>
          <div>
            <div style={{ fontWeight: '600', color: '#856404', fontSize: '14px', fontFamily: 'var(--font-body)' }}>
              {alerts.length} stock alert{alerts.length > 1 ? 's' : ''} require attention
            </div>
            {alerts.map(a => (
              <div key={a.id} style={{ fontSize: '13px', color: '#856404', marginTop: '4px', fontFamily: 'var(--font-body)' }}>
                · {a.id} {a.name}: {a.totalUnits} units remaining (threshold: {a.reorderThreshold})
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
        {[
          { label: 'Total SKUs', value: '5', sub: 'Active products' },
          { label: 'Total Units in Stock', value: stockLevels.reduce((s, p) => s + p.totalUnits, 0).toLocaleString(), sub: 'Across all products' },
          { label: 'Outstanding Payments', value: `$${totalOutstanding.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, sub: `${outstandingPayments.length} items` },
          { label: 'Batches In Transit', value: inTransit.length.toString(), sub: inTransit.map(b => b.batchNumber).join(', ') || 'None' },
        ].map(stat => (
          <Card key={stat.label} style={{ padding: '20px 24px' }}>
            <div style={{ fontSize: '11px', color: c.taupe, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px', fontFamily: 'var(--font-body)' }}>{stat.label}</div>
            <div style={{ fontSize: '26px', fontWeight: '600', color: c.umber, fontFamily: 'var(--font-heading)', lineHeight: 1 }}>{stat.value}</div>
            <div style={{ fontSize: '12px', color: c.taupe, marginTop: '6px', fontFamily: 'var(--font-body)' }}>{stat.sub}</div>
          </Card>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Stock Levels */}
        <Card>
          <SectionTitle>Stock Levels</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {stockLevels.map((product, i) => (
              <div key={product.id} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 0',
                borderBottom: i < stockLevels.length - 1 ? `1px solid ${c.softDune}` : 'none',
              }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '500', color: c.black, fontFamily: 'var(--font-body)' }}>
                    <span style={{ color: c.taupe, marginRight: '8px', fontSize: '11px', fontWeight: '400' }}>{product.id}</span>
                    {product.name}
                  </div>
                  <div style={{ fontSize: '12px', color: c.taupe, marginTop: '3px', fontFamily: 'var(--font-body)' }}>
                    {product.totalUnits.toLocaleString()} units · Threshold: {product.reorderThreshold}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '80px', height: '4px', backgroundColor: c.softDune, borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${Math.min(100, (product.totalUnits / (product.reorderThreshold * 2)) * 100)}%`,
                      backgroundColor: product.status === 'ok' ? '#2d6a4f' : product.status === 'low' ? '#ffc107' : '#dc3545',
                      borderRadius: '2px',
                    }} />
                  </div>
                  <StatusBadge status={product.status} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* WAC Summary */}
        <Card>
          <SectionTitle>Weighted Average Costs</SectionTitle>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-body)', fontSize: '13px' }}>
            <thead>
              <tr>
                {['Product', 'WAC', 'Sale Price', 'Margin'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 0', color: c.taupe, fontWeight: '500', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: `1px solid ${c.softDune}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {weightedAvgCosts.map((item, i) => (
                <tr key={item.productId} style={{ backgroundColor: i % 2 === 0 ? 'transparent' : c.vanilla }}>
                  <td style={{ padding: '10px 0', color: c.black, fontWeight: '500' }}>{item.productName}</td>
                  <td style={{ padding: '10px 0', color: c.umber }}>${item.wac.toFixed(2)}</td>
                  <td style={{ padding: '10px 0', color: c.black }}>${item.sellingPrice.toFixed(2)}</td>
                  <td style={{ padding: '10px 0', color: item.margin > 60 ? '#2d6a4f' : item.margin > 40 ? '#856404' : '#721c24', fontWeight: '600' }}>{item.margin}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      {/* Outstanding Payments */}
      <Card>
        <SectionTitle>Outstanding Payments</SectionTitle>
        {outstandingPayments.length === 0 ? (
          <p style={{ fontSize: '14px', color: c.taupe, fontFamily: 'var(--font-body)' }}>All payments are up to date.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-body)', fontSize: '13px' }}>
            <thead>
              <tr>
                {['Batch', 'Product', 'Supplier', 'Type', 'Amount', 'Status'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: c.taupe, fontWeight: '500', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: `1px solid ${c.softDune}`, backgroundColor: c.softDune + '80' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {outstandingPayments.map((p, i) => (
                <tr key={`${p.batchId}-${p.supplierId}`} style={{ backgroundColor: i % 2 === 0 ? 'transparent' : c.vanilla + '80' }}>
                  <td style={{ padding: '10px 12px', color: c.umber, fontWeight: '500' }}>{p.batchNumber}</td>
                  <td style={{ padding: '10px 12px', color: c.black }}>{p.productName}</td>
                  <td style={{ padding: '10px 12px', color: c.black }}>{p.supplierName}</td>
                  <td style={{ padding: '10px 12px', color: c.taupe }}>{p.type}</td>
                  <td style={{ padding: '10px 12px', color: c.black, fontWeight: '600' }}>${p.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  <td style={{ padding: '10px 12px' }}><StatusBadge status={p.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  )
}
