import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Home, ShoppingCart, History, Wallet, Users, Settings, LogOut, Zap } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const sellerMenu = [
    { icon: Home, label: 'Dashboard', to: '/dashboard' },
    { icon: ShoppingCart, label: 'Beli Pulsa', to: '/topup' },
    { icon: History, label: 'Riwayat', to: '/transactions' },
    { icon: Wallet, label: 'Saldo', to: '/wallet' },
    { icon: Settings, label: 'Pengaturan', to: '/settings' },
  ]

  const adminMenu = [
    { icon: Home, label: 'Dashboard', to: '/admin' },
    { icon: Users, label: 'Penarikan', to: '/admin/withdrawals' },
    { icon: Settings, label: 'Pengaturan', to: '/settings' },
  ]

  const menuItems = user?.role === 'admin' ? adminMenu : sellerMenu

  const handleLogout = () => {
    logout()
    toast.success('Logout berhasil')
    navigate('/login')
  }

  return (
    <div className="w-64 bg-gray-900 text-white h-screen flex flex-col fixed left-0 top-0">
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Zap size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold">PulsaKu</h1>
            <p className="text-xs text-gray-400">Jual Beli Pulsa</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.to
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <Icon size={20} />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold">{user?.name?.charAt(0).toUpperCase()}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-lg transition-colors text-sm"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}
