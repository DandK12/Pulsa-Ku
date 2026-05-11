import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'
import Navbar from '../../components/Navbar'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, transactions: 0, withdrawals: 0 })

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Monitor semua aktivitas platform.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          {[
            { label: 'Total Seller', value: '—', icon: '👥', color: 'text-blue-600' },
            { label: 'Total Transaksi', value: '—', icon: '📋', color: 'text-purple-600' },
            { label: 'Pending Withdraw', value: '—', icon: '🏦', color: 'text-orange-600' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{s.icon}</span>
                <p className="text-sm text-gray-500">{s.label}</p>
              </div>
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Link to="/admin/withdrawals"
            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:border-blue-200 transition-colors">
            <p className="text-2xl mb-2">🏦</p>
            <p className="font-semibold text-gray-800">Kelola Penarikan</p>
            <p className="text-sm text-gray-400 mt-1">Approve atau tolak request penarikan saldo seller</p>
          </Link>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <p className="text-2xl mb-2">📊</p>
            <p className="font-semibold text-gray-800">Laporan</p>
            <p className="text-sm text-gray-400 mt-1">Coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  )
}