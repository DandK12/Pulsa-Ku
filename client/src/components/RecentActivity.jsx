export default function RecentActivity({ transactions = [] }) {
  const formatRupiah = (num) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num)

  const statusConfig = {
    success: { label: 'Berhasil', class: 'bg-green-100 text-green-700' },
    pending: { label: 'Proses', class: 'bg-yellow-100 text-yellow-700' },
    failed: { label: 'Gagal', class: 'bg-red-100 text-red-700' },
  }

  const dummyData = [
    { id: 1, phone_number: '0812-3456-7890', product_code: 'Telkomsel', amount: 50000, status: 'success', created_at: new Date() },
    { id: 2, phone_number: '0857-8901-2345', product_code: 'Indosat', amount: 25000, status: 'success', created_at: new Date() },
    { id: 3, phone_number: '0878-9012-3456', product_code: 'XL', amount: 100000, status: 'pending', created_at: new Date() },
  ]

  const data = transactions.length > 0 ? transactions : dummyData

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-5">Transaksi Terbaru</h3>
      <div className="space-y-1">
        {data.map((tx) => {
          const status = statusConfig[tx.status] || statusConfig.pending
          return (
            <div key={tx.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-blue-600">
                    {tx.product_code?.substring(0, 2).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{tx.phone_number}</p>
                  <p className="text-xs text-gray-400">{tx.product_code}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">{formatRupiah(tx.amount)}</p>
                <span className={`inline-block px-2 py-0.5 text-xs rounded-full font-medium ${status.class}`}>
                  {status.label}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
