import { useEffect, useState } from 'react'
import api from '../../api/axios'
import Navbar from '../../components/Navbar'
import toast from 'react-hot-toast'

export default function Transactions() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  const formatRupiah = (num) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num)

  const statusColor = (status) => {
    if (status === 'success') return 'bg-green-100 text-green-700'
    if (status === 'pending') return 'bg-yellow-100 text-yellow-700'
    return 'bg-red-100 text-red-700'
  }

  useEffect(() => {
    api.get('/transactions')
      .then((res) => setTransactions(res.data))
      .catch(() => toast.error('Gagal memuat transaksi'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Riwayat Transaksi</h1>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-10 text-center text-gray-400">Memuat...</div>
          ) : transactions.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-4xl mb-3">📭</p>
              <p className="text-gray-400">Belum ada transaksi</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['No. HP', 'Produk', 'Nominal', 'Status', 'Tanggal'].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">{tx.phone_number}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{tx.product_code}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-800">{formatRupiah(tx.amount)}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColor(tx.status)}`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(tx.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}