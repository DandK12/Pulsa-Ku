import { useEffect, useState } from 'react'
import api from '../../api/axios'
import Navbar from '../../components/Navbar'
import toast from 'react-hot-toast'

export default function Withdrawals() {
  const [withdrawals, setWithdrawals] = useState([])
  const [loading, setLoading] = useState(true)

  const formatRupiah = (num) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num)

  useEffect(() => {
    // Fetch semua withdrawal (admin only)
    setLoading(false) // sementara
  }, [])

  const handleApprove = async (id) => {
    try {
      await api.patch(`/withdraw/${id}/approve`)
      toast.success('Penarikan disetujui!')
      setWithdrawals((prev) =>
        prev.map((w) => (w.id === id ? { ...w, status: 'approved' } : w))
      )
    } catch {
      toast.error('Gagal menyetujui penarikan')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Kelola Penarikan Saldo</h1>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-10 text-center text-gray-400">Memuat...</div>
          ) : withdrawals.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-4xl mb-3">✅</p>
              <p className="text-gray-400">Tidak ada permintaan penarikan</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Seller', 'Bank', 'Rekening', 'Nominal', 'Status', 'Aksi'].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {withdrawals.map((w) => (
                  <tr key={w.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-800">{w.user_id}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{w.bank_name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{w.bank_account}</td>
                    <td className="px-6 py-4 text-sm font-semibold">{formatRupiah(w.amount)}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                        w.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {w.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {w.status === 'pending' && (
                        <button
                          onClick={() => handleApprove(w.id)}
                          className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700"
                        >
                          Approve
                        </button>
                      )}
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