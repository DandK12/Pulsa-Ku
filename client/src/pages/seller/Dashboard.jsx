import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'
import Navbar from '../../components/Navbar'
import { useAuthStore } from '../../store/authStore'
import toast from 'react-hot-toast'

export default function SellerDashboard() {
  const { user } = useAuthStore()
  const [balance, setBalance] = useState(0)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [walletRes, txRes] = await Promise.all([
          api.get('/wallet/balance'),
          api.get('/transactions'),
        ])
        setBalance(walletRes.data.balance || 0)
        setTransactions(txRes.data.slice(0, 5))
      } catch (err) {
        toast.error('Gagal memuat data')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const formatRupiah = (num) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num)

  const statusColor = (status) => {
    if (status === 'success') return 'bg-green-100 text-green-700'
    if (status === 'pending') return 'bg-yellow-100 text-yellow-700'
    return 'bg-red-100 text-red-700'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Selamat datang, {user?.name}! 👋
          </h1>
          <p className="text-gray-500 mt-1">Kelola penjualan pulsa kamu di sini.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Saldo Wallet</p>
            <p className="text-3xl font-bold text-blue-600">
              {loading ? '...' : formatRupiah(balance)}
            </p>
            <Link to="/topup" className="text-xs text-blue-500 hover:underline mt-2 inline-block">
              + Topup Saldo →
            </Link>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Total Transaksi</p>
            <p className="text-3xl font-bold text-gray-800">
              {loading ? '...' : transactions.length}
            </p>
            <Link to="/transactions" className="text-xs text-blue-500 hover:underline mt-2 inline-block">
              Lihat semua →
            </Link>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Status Akun</p>
            <p className="text-3xl font-bold text-green-500">Aktif</p>
            <p className="text-xs text-gray-400 mt-2">Seller terverifikasi</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { to: '/topup', icon: '💳', label: 'Topup Saldo', color: 'bg-blue-50 text-blue-600' },
            { to: '/transactions', icon: '📋', label: 'Transaksi', color: 'bg-purple-50 text-purple-600' },
            { to: '/wallet', icon: '👛', label: 'Wallet', color: 'bg-green-50 text-green-600' },
            { to: '/wallet', icon: '🏦', label: 'Tarik Saldo', color: 'bg-orange-50 text-orange-600' },
          ].map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className={`${item.color} rounded-2xl p-5 flex flex-col items-center gap-2 hover:opacity-80 transition-opacity`}
            >
              <span className="text-3xl">{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          ))}
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center p-6 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">Transaksi Terakhir</h2>
            <Link to="/transactions" className="text-sm text-blue-500 hover:underline">
              Lihat semua
            </Link>
          </div>
          {loading ? (
            <div className="p-6 text-center text-gray-400">Memuat...</div>
          ) : transactions.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-4xl mb-3">📭</p>
              <p className="text-gray-400">Belum ada transaksi</p>
              <Link to="/topup" className="text-blue-500 text-sm hover:underline mt-1 inline-block">
                Mulai topup saldo
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between px-6 py-4">
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{tx.phone_number}</p>
                    <p className="text-xs text-gray-400">{tx.product_code} · {new Date(tx.created_at).toLocaleDateString('id-ID')}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800 text-sm">{formatRupiah(tx.amount)}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor(tx.status)}`}>
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}