import { useState } from 'react'
import api from '../../api/axios'
import Navbar from '../../components/Navbar'
import toast from 'react-hot-toast'

const PAYMENT_METHODS = [
  { id: 'QRIS', label: 'QRIS', icon: '📱' },
  { id: 'BRIVA', label: 'BRI Virtual Account', icon: '🏦' },
  { id: 'BNIVA', label: 'BNI Virtual Account', icon: '🏦' },
  { id: 'BCAVA', label: 'BCA Virtual Account', icon: '🏦' },
  { id: 'MANDIRIVA', label: 'Mandiri Virtual Account', icon: '🏦' },
]

const NOMINAL = [50000, 100000, 200000, 500000, 1000000]

export default function Topup() {
  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState('')
  const [loading, setLoading] = useState(false)

  const formatRupiah = (num) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num)

  const handleTopup = async (e) => {
    e.preventDefault()
    if (!method) return toast.error('Pilih metode pembayaran dulu')
    if (!amount || Number(amount) < 10000) return toast.error('Minimal topup Rp 10.000')

    setLoading(true)
    try {
      const { data } = await api.post('/topup/create', {
        amount: Number(amount),
        payment_method: method,
      })
      toast.success(`Order berhasil! Ref: ${data.merchant_ref}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Topup gagal')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Topup Saldo</h1>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <form onSubmit={handleTopup} className="space-y-6">

            {/* Nominal Cepat */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-3 block">Pilih Nominal</label>
              <div className="grid grid-cols-3 gap-3">
                {NOMINAL.map((nom) => (
                  <button
                    key={nom}
                    type="button"
                    onClick={() => setAmount(String(nom))}
                    className={`py-2.5 rounded-xl text-sm font-medium border transition-all ${
                      amount === String(nom)
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-200 text-gray-700 hover:border-blue-300'
                    }`}
                  >
                    {formatRupiah(nom)}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Nominal */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Atau masukkan nominal lain</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">Rp</span>
                <input
                  type="number"
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full border rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>

            {/* Metode Pembayaran */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-3 block">Metode Pembayaran</label>
              <div className="space-y-2">
                {PAYMENT_METHODS.map((pm) => (
                  <label
                    key={pm.id}
                    className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                      method === pm.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="method"
                      value={pm.id}
                      checked={method === pm.id}
                      onChange={() => setMethod(pm.id)}
                      className="accent-blue-600"
                    />
                    <span className="text-xl">{pm.icon}</span>
                    <span className="text-sm font-medium text-gray-700">{pm.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Summary */}
            {amount && method && (
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Nominal Topup</span>
                  <span className="font-medium">{formatRupiah(Number(amount))}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Metode</span>
                  <span className="font-medium">{method}</span>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Memproses...' : 'Bayar Sekarang'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}