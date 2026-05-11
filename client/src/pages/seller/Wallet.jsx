import { useEffect, useState } from 'react'
import api from '../../api/axios'
import Sidebar from '../../components/Sidebar'
import Header from '../../components/Header'
import toast from 'react-hot-toast'

export default function Wallet() {
  const [balance, setBalance] = useState(0)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [showWithdraw, setShowWithdraw] = useState(false)
  const [withdrawForm, setWithdrawForm] = useState({ amount: '', bank_name: '', bank_account: '' })

  const formatRupiah = (num) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [walletRes, historyRes] = await Promise.all([
          api.get('/wallet/balance'),
          api.get('/wallet/history'),
        ])
        setBalance(walletRes.data.balance || 0)
        setHistory(historyRes.data)
      } catch {
        toast.error('Gagal memuat wallet')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleWithdraw = async (e) => {
    e.preventDefault()
    try {
      await api.post('/withdraw/request', {
        ...withdrawForm,
        amount: Number(withdrawForm.amount),
      })
      toast.success('Permintaan penarikan berhasil dikirim!')
      setShowWithdraw(false)
      setWithdrawForm({ amount: '', bank_name: '', bank_account: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal mengajukan penarikan')
    }
  }

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Wallet Saya</h1>

            {/* Balance Card */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 text-white mb-6 shadow-lg">
              <p className="text-blue-100 text-sm mb-2">Saldo Tersedia</p>
              <p className="text-4xl font-bold mb-6">
                {loading ? '...' : formatRupiah(balance)}
              </p>
              <button
                onClick={() => setShowWithdraw(!showWithdraw)}
                className="bg-white text-blue-600 px-5 py-2 rounded-xl font-semibold text-sm hover:bg-blue-50 transition-colors"
              >
                🏦 Tarik Saldo
              </button>
            </div>

            {/* Withdraw Form */}
            {showWithdraw && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
                <h2 className="font-semibold text-gray-800 mb-4">Form Penarikan Saldo</h2>
                <form onSubmit={handleWithdraw} className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Jumlah Penarikan</label>
                    <input
                      type="number"
                      placeholder="Minimal Rp 50.000"
                      value={withdrawForm.amount}
                      onChange={(e) => setWithdrawForm({ ...withdrawForm, amount: e.target.value })}
                      className="w-full border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Nama Bank</label>
                    <select
                      value={withdrawForm.bank_name}
                      onChange={(e) => setWithdrawForm({ ...withdrawForm, bank_name: e.target.value })}
                      className="w-full border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      required
                    >
                      <option value="">Pilih Bank</option>
                      {['BCA', 'BNI', 'BRI', 'Mandiri', 'BSI', 'DANA', 'OVO', 'GoPay'].map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Nomor Rekening / Akun</label>
                    <input
                      type="text"
                      placeholder="Masukkan nomor rekening"
                      value={withdrawForm.bank_account}
                      onChange={(e) => setWithdrawForm({ ...withdrawForm, bank_account: e.target.value })}
                      className="w-full border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      required
                    />
                  </div>
                  <div className="flex gap-3">
                    <button type="submit" className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-700">
                      Ajukan Penarikan
                    </button>
                    <button type="button" onClick={() => setShowWithdraw(false)} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-50">
                      Batal
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* History */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="p-6 border-b border-gray-100">
                <h2 className="font-semibold text-gray-800">Riwayat Saldo</h2>
              </div>
              {loading ? (
                <div className="p-6 text-center text-gray-400">Memuat...</div>
              ) : history.length === 0 ? (
                <div className="p-10 text-center">
                  <p className="text-4xl mb-3">📭</p>
                  <p className="text-gray-400">Belum ada riwayat saldo</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {history.map((log) => (
                    <div key={log.id} className="flex items-center justify-between px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-lg ${log.type === 'credit' ? 'bg-green-50' : 'bg-red-50'}`}>
                          {log.type === 'credit' ? '⬆️' : '⬇️'}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{log.description}</p>
                          <p className="text-xs text-gray-400">{new Date(log.created_at).toLocaleDateString('id-ID')}</p>
                        </div>
                      </div>
                      <p className={`font-semibold text-sm ${log.type === 'credit' ? 'text-green-600' : 'text-red-500'}`}>
                        {log.type === 'credit' ? '+' : '-'}{formatRupiah(log.amount)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}