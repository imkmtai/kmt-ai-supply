export const colors = {
  vanilla: '#F8F4EE',
  softDune: '#E4DDCC',
  taupe: '#C5B49D',
  umber: '#443A35',
  black: '#252525',
}

export const products = [
  { id: 'AR-001', name: 'Sea Mist', category: 'Body Mist', reorderThreshold: 200, sellingPrice: 45.00 },
  { id: 'AR-002', name: 'Glow Oil', category: 'Face & Body Oil', reorderThreshold: 150, sellingPrice: 85.00 },
  { id: 'AR-003', name: 'Body Lotion', category: 'Body Care', reorderThreshold: 200, sellingPrice: 55.00 },
]

export const suppliers = [
  {
    id: 'SUP-001',
    name: 'Cairo Packaging Co.',
    type: 'packaging',
    contact: 'Ahmed Hassan',
    email: 'a.hassan@cairopkg.com',
    phone: '+20 2 2345 6789',
    address: '14 Nasr City Industrial Zone, Cairo, Egypt',
    paymentTerms: '50% deposit, 50% on delivery',
    currency: 'USD',
    rating: 4.7,
    leadTimeDays: 28,
  },
  {
    id: 'SUP-002',
    name: 'Delta Manufacturing',
    type: 'liquid',
    contact: 'Sarah Adel',
    email: 's.adel@deltamfg.com',
    phone: '+20 2 9876 5432',
    address: '7 El Obour Industrial District, Cairo, Egypt',
    paymentTerms: '30% deposit, 70% on delivery',
    currency: 'USD',
    rating: 4.5,
    leadTimeDays: 35,
  },
]

export const batches = [
  {
    id: 'BATCH-001',
    productId: 'AR-001',
    productName: 'Sea Mist',
    batchNumber: 'SM-2025-001',
    orderDate: '2025-01-10',
    receivedDate: '2025-02-20',
    status: 'received',
    totalUnits: 500,
    unitsRemaining: 320,
    isFifoActive: true,
    packagingCost: {
      supplierId: 'SUP-001',
      perUnit: 2.40,
      total: 1200.00,
      depositPaid: true,
      depositAmount: 600.00,
      depositDate: '2025-01-12',
      finalPaid: true,
      finalAmount: 600.00,
      finalDate: '2025-02-22',
    },
    liquidCost: {
      supplierId: 'SUP-002',
      perUnit: 8.60,
      total: 4300.00,
      depositPaid: true,
      depositAmount: 1290.00,
      depositDate: '2025-01-12',
      finalPaid: true,
      finalAmount: 3010.00,
      finalDate: '2025-02-22',
    },
    weightedAvgCost: 11.00,
    notes: 'First production run. All payments settled.',
  },
  {
    id: 'BATCH-002',
    productId: 'AR-002',
    productName: 'Glow Oil',
    batchNumber: 'GO-2025-001',
    orderDate: '2025-03-01',
    receivedDate: null,
    status: 'in-transit',
    totalUnits: 300,
    unitsRemaining: 0,
    isFifoActive: false,
    packagingCost: {
      supplierId: 'SUP-001',
      perUnit: 3.20,
      total: 960.00,
      depositPaid: true,
      depositAmount: 480.00,
      depositDate: '2025-03-03',
      finalPaid: false,
      finalAmount: 480.00,
      finalDate: null,
    },
    liquidCost: {
      supplierId: 'SUP-002',
      perUnit: 15.00,
      total: 4500.00,
      depositPaid: true,
      depositAmount: 1350.00,
      depositDate: '2025-03-03',
      finalPaid: false,
      finalAmount: 3150.00,
      finalDate: null,
    },
    weightedAvgCost: 18.20,
    notes: 'ETA mid-April. Final payments due on delivery.',
  },
]

export const paymentHistory = {
  'SUP-001': [
    { date: '2025-01-12', batchId: 'BATCH-001', batchNumber: 'SM-2025-001', type: 'deposit', amount: 600.00, method: 'Bank Transfer', ref: 'CPK-250112' },
    { date: '2025-02-22', batchId: 'BATCH-001', batchNumber: 'SM-2025-001', type: 'final', amount: 600.00, method: 'Bank Transfer', ref: 'CPK-250222' },
    { date: '2025-03-03', batchId: 'BATCH-002', batchNumber: 'GO-2025-001', type: 'deposit', amount: 480.00, method: 'Bank Transfer', ref: 'CPK-250303' },
    { date: null, batchId: 'BATCH-002', batchNumber: 'GO-2025-001', type: 'final', amount: 480.00, method: 'Pending', ref: '—' },
  ],
  'SUP-002': [
    { date: '2025-01-12', batchId: 'BATCH-001', batchNumber: 'SM-2025-001', type: 'deposit', amount: 1290.00, method: 'Bank Transfer', ref: 'DLT-250112' },
    { date: '2025-02-22', batchId: 'BATCH-001', batchNumber: 'SM-2025-001', type: 'final', amount: 3010.00, method: 'Bank Transfer', ref: 'DLT-250222' },
    { date: '2025-03-03', batchId: 'BATCH-002', batchNumber: 'GO-2025-001', type: 'deposit', amount: 1350.00, method: 'Bank Transfer', ref: 'DLT-250303' },
    { date: null, batchId: 'BATCH-002', batchNumber: 'GO-2025-001', type: 'final', amount: 3150.00, method: 'Pending', ref: '—' },
  ],
}

export const outstandingPayments = batches.flatMap(b => {
  const items = []
  if (!b.packagingCost.finalPaid) {
    items.push({
      batchId: b.id,
      batchNumber: b.batchNumber,
      productName: b.productName,
      supplierId: b.packagingCost.supplierId,
      supplierName: 'Cairo Packaging Co.',
      type: b.packagingCost.depositPaid ? 'Final Payment' : 'Deposit',
      amount: b.packagingCost.depositPaid ? b.packagingCost.finalAmount : b.packagingCost.depositAmount,
      status: 'outstanding',
    })
  }
  if (!b.liquidCost.finalPaid) {
    items.push({
      batchId: b.id,
      batchNumber: b.batchNumber,
      productName: b.productName,
      supplierId: b.liquidCost.supplierId,
      supplierName: 'Delta Manufacturing',
      type: b.liquidCost.depositPaid ? 'Final Payment' : 'Deposit',
      amount: b.liquidCost.depositPaid ? b.liquidCost.finalAmount : b.liquidCost.depositAmount,
      status: 'outstanding',
    })
  }
  return items
})

export const stockLevels = products.map(p => {
  const productBatches = batches.filter(b => b.productId === p.id && b.status === 'received')
  const totalUnits = productBatches.reduce((sum, b) => sum + b.unitsRemaining, 0)
  const activeBatch = productBatches.find(b => b.isFifoActive)
  return {
    ...p,
    totalUnits,
    activeBatch: activeBatch?.batchNumber || '—',
    status: totalUnits === 0 ? 'out' : totalUnits < p.reorderThreshold ? 'low' : 'ok',
  }
})

export const weightedAvgCosts = products.map(p => {
  const received = batches.filter(b => b.productId === p.id && b.status === 'received')
  if (received.length === 0) return {
    productId: p.id,
    productName: p.name,
    wac: 0,
    totalValue: 0,
    totalUnits: 0,
    sellingPrice: p.sellingPrice,
    margin: 0,
    pricingFloor: 0,
  }
  const totalUnits = received.reduce((sum, b) => sum + b.totalUnits, 0)
  const totalValue = received.reduce((sum, b) => sum + b.weightedAvgCost * b.totalUnits, 0)
  const wac = totalValue / totalUnits
  return {
    productId: p.id,
    productName: p.name,
    wac: parseFloat(wac.toFixed(2)),
    totalValue: parseFloat(totalValue.toFixed(2)),
    totalUnits,
    sellingPrice: p.sellingPrice,
    margin: parseFloat(((p.sellingPrice - wac) / p.sellingPrice * 100).toFixed(1)),
    pricingFloor: parseFloat((wac * 1.5).toFixed(2)),
  }
})

export const emailSettings = {
  alertEmail: 'supply@ardarituals.com',
  lowStockAlerts: true,
  paymentDueAlerts: true,
  batchReceivedAlerts: true,
  weeklyDigest: true,
  digestDay: 'Monday',
}

export const shopifySettings = {
  apiKey: '',
  storeUrl: '',
  connected: false,
}
