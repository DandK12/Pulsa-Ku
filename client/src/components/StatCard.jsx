export default function StatCard({ title, value, change, changeType, icon: Icon, iconColor }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <div className={`p-2.5 rounded-xl ${iconColor}`}>
          <Icon size={20} className="text-white" />
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className={`text-xs font-medium ${changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
          {change} dari bulan lalu
        </p>
      </div>
    </div>
  )
}