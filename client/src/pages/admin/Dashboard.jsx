import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Wallet, ShoppingBag, TrendingUp, Users, TrendingDown, ShoppingCart } from 'lucide-react'
import api from '../../api/axios'
import { useAuthStore } from '../../store/authStore'
import Sidebar from '../../components/Sidebar'
import Header from '../../components/Header'
import StatCard from '../../components/StatCard'
import toast from 'react-hot-toast'

const PROVIDERS = [
  { id: 'telkomsel', name: 'Telkomsel', color: 'bg-red-500' },
  { id: 'indosat', name: 'Indosat', color: 'bg-yellow-500' },
  { id: 'xl', name: 'XL', color: 'bg-blue-500' },
  { id: 'tri', name: 'Tri', color: 'bg-purple-500' },
  { id: 'smartfren', name: 'Smartfren', color: 'bg-pink-500' },
  { id: 'axis', name: 'Axis', color: 'bg-indigo-500' },
]

const DENOMINATIONS = [
  { value: 5000, price: 5500 },
  { value: 10000, price: 10500 },
  { value: 20000, price: 20500 },
  { value: 25000, price: 25500 },
  { value: 50000, price: 51000 },
  { value: 100000, price: 101500 },
]

const TOP_EMONEY = [
  { id: '1', name: 'GoPay', transactions: 1243, revenue: 'Rp 15.420.000', change: 12.5, color: 'bg-green-500' },
  { id: '2', name: 'OVO', transactions: 987, revenue: 'Rp 12.340.000', change: 8.3, color: 'bg-purple-500' },
  { id: '3', name: 'DANA', transactions: 856, revenue: 'Rp 10.890.000', change: -3.2, color: 'bg-blue-500' },
  { id: '4', name: 'ShopeePay', transactions: 734, revenue: 'Rp 9.120.000', change: 15.7, color: 'bg-orange-500' },
  { id: '5', name: 'LinkAja', transactions: 521, revenue: 'Rp 6.540.000', change: 5.1, color: 'bg-red-500' },
]

const RECENT_TRANSACTIONS = [
  { id: 1, phone: '0812-3456-7890', provider: 'Telkomsel', amount: 'Rp 50.000', time: '5 menit lalu', status: 'success' },
  { id: 2, phone: '0857-8901-2345', provider: 'Indosat', amount: 'Rp 25.000', time: '15 menit lalu', status: 'success' },
  { id: 3, phone: '0878-9012-3456', provider: 'XL', amount: 'Rp 100.000', time: '30 menit lalu', status: 'pending' },
  { id: 4, phone: '0895-6789-0123', provider: 'Tri', amount: 'Rp 10.000', time: '1 jam lalu', status: 'failed' },
  { id: 5, phone: '0813-4567-8901', provider: 'Telkomsel', amount: 'Rp 20.000', time: '2 jam lalu', status: 'success' },
]

const statusConfig = {
  success: { label: 'Berhasil', class: 'bg-green-100 text-green-700' },
  pending: { label: 'Proses', class: 'bg-yellow-100 text-yellow-700' },
  failed: { label: 'Gagal', class: 'bg-red-100 text-red-700' },
}

export default function SellerDashboard() {
  const { user } = useAuthStore()
  const [balance, setBalance] = useState(0)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [phone, setPhone] = useState('')
  const [selectedProvider, setSelectedProvider] = useState('')
  const [selectedDenom, setSelectedDenom] = useState(null)

  const formatRupiah = (num) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [walletRes, txRes] = await Promise.all([
          api.get('/wallet/balance'),
          api.get('/transactions'),
        ])
        setBalance(walletRes.data.balance || 0)
        setTransactions(txRes.data.slice(0, 5))
      } catch {
        toast.error('Gagal memuat data')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleTambahKeranjang = () => {
    if (!phone) return toast.error('Masukkan nomor HP dulu')
    if (!selectedProvider) return toast.error('Pilih provider dulu')
    if (!selectedDenom) return toast.error('Pilih nominal dulu')
    toast.success(`${selectedProvider} ${formatRupiah(selectedDenom.value)} ke ${phone} ditambahkan!`)
  }

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">

            {/* Welcome */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Dashboard Penjualan</h2>
              <p className="text-gray-500 mt-1">Selamat datang kembali! Berikut ringkasan hari ini.</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <StatCard title="Total Saldo" value={loading ? '...' : formatRupiah(balance)} change="+15.2%" changeType="positive" icon={Wallet} iconColor="bg-blue-500" />
              <StatCard title="Transaksi Hari Ini" value="156" change="+23.1%" changeType="positive" icon={ShoppingBag} iconColor="bg-green-500" />
              <StatCard title="Pendapatan Hari Ini" value="Rp 8.340.000" change="+18.7%" changeType="positive" icon={TrendingUp} iconColor="bg-purple-500" />
              <StatCard title="Pelanggan Aktif" value="1,247" change="+12.5%" changeType="positive" icon={Users} iconColor="bg-orange-500" />
            </div>

            {/* Top E-Money + Beli Pulsa */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Top E-Money */}
              <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Top E-Money</h3>
                  <span className="text-sm text-gray-400">7 Hari Terakhir</span>
                </div>
                <div className="space-y-4">
                  {TOP_EMONEY.map((emoney, index) => (
                    <div key={emoney.id} className="flex items-center gap-4">
                      <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                        {index + 1}
                      </div>
                      <div className={`w-10 h-10 rounded-xl ${emoney.color} flex items-center justify-center flex-shrink-0`}>
                        <span className="text-white font-bold text-xs">{emoney.name.substring(0, 2)}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">{emoney.name}</p>
                        <p className="text-xs text-gray-400">{emoney.transactions.toLocaleString('id-ID')} transaksi</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">{emoney.revenue}</p>
                        <div className={`flex items-center justify-end gap-1 text-xs ${emoney.change >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                          {emoney.change >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                          <span>{Math.abs(emoney.change)}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Total Pendapatan</span>
                  <span className="text-lg font-bold text-gray-900">Rp 54.310.000</span>
                </div>
              </div>

              {/* Beli Pulsa */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-5">
                  <ShoppingCart className="text-blue-600" size={20} />
                  <h3 className="text-lg font-semibold text-gray-900">Beli Pulsa</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Nomor Telepon</label>
                    <input
                      type="tel"
                      placeholder="Contoh: 08123456789"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Pilih Provider</label>
                    <div className="grid grid-cols-2 gap-2">
                      {PROVIDERS.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => setSelectedProvider(p.name)}
                          className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                            selectedProvider === p.name
                              ? p.color + ' text-white ring-2 ring-offset-1 ring-blue-400'
                              : p.color + ' text-white opacity-70 hover:opacity-100'
                          }`}
                        >
                          {p.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Pilih Nominal</label>
                    <div className="grid grid-cols-2 gap-2">
                      {DENOMINATIONS.map((d) => (
                        <button
                          key={d.value}
                          onClick={() => setSelectedDenom(d)}
                          className={`py-2 px-3 rounded-lg text-left transition-all border-2 ${
                            selectedDenom?.value === d.value
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-blue-300'
                          }`}
                        >
                          <p className="text-xs font-semibold text-gray-800">{formatRupiah(d.value)}</p>
                          <p className="text-xs text-gray-400">Bayar: {formatRupiah(d.price)}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={handleTambahKeranjang}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors text-sm"
                  >
                    Tambah ke Keranjang
                  </button>
                </div>
              </div>
            </div>

            {/* Transaksi Terbaru */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-5">Transaksi Terbaru</h3>
              <div className="space-y-1">
                {RECENT_TRANSACTIONS.map((tx) => {
                  const status = statusConfig[tx.status]
                  const initials = tx.provider.substring(0, 2).toUpperCase()
                  const providerColor = PROVIDERS.find(p => p.name === tx.provider)?.color || 'bg-gray-400'
                  return (
                    <div key={tx.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full ${providerColor} flex items-center justify-center flex-shrink-0`}>
                          <span className="text-xs font-bold text-white">{initials}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{tx.phone}</p>
                          <p className="text-xs text-gray-400">{tx.provider} · {tx.amount}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400 mb-1">{tx.time}</p>
                        <span className={`inline-block px-2.5 py-0.5 text-xs rounded-full font-medium ${status.class}`}>
                          {status.label}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}