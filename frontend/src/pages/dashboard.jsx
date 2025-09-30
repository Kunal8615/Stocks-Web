import React, { useEffect, useState } from 'react'
import { API_URL } from '../constant'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../utils/axiosConfig'

const numberFormatter = (value) => {
  try {
    const num = Number(value || 0)
    return num.toLocaleString('en-IN', { maximumFractionDigits: 2 })
  } catch {
    return String(value)
  }
}

const StatCard = ({ title, value, subtitle, icon, colorFrom = 'from-purple-600', colorTo = 'to-pink-600', footer }) => (
  <div className={`min-h-[150px] h-full rounded-2xl p-4 sm:p-5 bg-gradient-to-br ${colorFrom} ${colorTo} text-white shadow-lg ring-1 ring-white/10 transition-transform duration-200 hover:-translate-y-0.5 flex flex-col justify-between`}> 
    <div className="flex items-center justify-between">
      <div className="text-sm/5 opacity-90">{title}</div>
      {icon && <span className="text-white/80">{icon}</span>}
    </div>
    <div className="mt-2 text-xl sm:text-2xl font-semibold">₹ {numberFormatter(value)}</div>
    {subtitle && <div className="mt-1 text-xs/5 opacity-90">{subtitle}</div>}
    {footer}
  </div>
)

const Dashboard = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [invested, setInvested] = useState(0)
  const [returns, setReturns] = useState(0)
  const [currentValue, setCurrentValue] = useState(0)
  const [walletBalance, setWalletBalance] = useState(0)
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    let isActive = true
    const fetchAll = async () => {
      setLoading(true)
      setError('')

      try {
        const [invRes, retRes, curRes, userRes, walRes] = await Promise.all([
          axiosInstance.get(`/dashboard/invested`),
          axiosInstance.get(`/dashboard/returns`),
          axiosInstance.get(`/dashboard/current_value`),
          axiosInstance.get(`/user/GetCurrentUser`),
          axiosInstance.get(`/dashboard/wallet_balance`),
        ])

        if (!isActive) return

        if (!invRes.data.success || !retRes.data.success || !curRes.data.success || !userRes.data.success || !walRes.data.success) {
          throw new Error('Failed to fetch dashboard data')
        }

        setInvested(invRes.data.data || 0)
        setReturns(retRes.data.data || 0)
        setCurrentValue(curRes.data.data || 0)
        setUser(userRes.data.data)
        setWalletBalance(walRes.data.data || 0)
      } catch (e) {
        setError(e?.response?.data?.message || e?.message || 'Something went wrong')
      } finally {
        if (isActive) setLoading(false)
      }
    }

    fetchAll()
    return () => { isActive = false }
  }, [])

  const profitAmount = Math.max(0, (currentValue || 0) - (invested || 0))
  const pnl = (currentValue || 0) - (invested || 0)
  const profitPercent = invested > 0 ? (pnl / invested) * 100 : 0

  return (
    <div className="min-h-screen w-full bg-gray-950 text-gray-100">
      <div className="max-w-7xl mx-auto px-3 sm:px-5 py-4 sm:py-6">
        <div className="flex items-center gap-3">
          {user?.photo && (
            <img src={user.photo} alt={user?.name || 'User'} className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover border border-white/20" />
          )}
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold">Hi, {user?.name || 'User'}</h1>
            <p className="text-gray-400 text-xs sm:text-sm">Welcome back!</p>
          </div>
        </div>

        {/* Stats */}
        {loading ? (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 items-stretch">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-full">
                <div className="min-h-[150px] h-full rounded-2xl p-5 sm:p-6 bg-white/5 ring-1 ring-white/10 animate-pulse">
                  <div className="h-4 w-24 bg-white/10 rounded" />
                  <div className="mt-3 h-8 w-32 bg-white/10 rounded" />
                  <div className="mt-2 h-3 w-20 bg-white/10 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 items-stretch">
            <StatCard title="Total Invested" value={invested} subtitle="Your invested capital" icon={<span>💼</span>} />
            <StatCard
              title="Total Returns"
              value={returns}
              subtitle="Realized + unrealized"
              colorFrom="from-emerald-600" colorTo="to-teal-600"
              icon={<span>📈</span>}
              footer={(
                <div className="mt-3">
                  <span className={`${pnl >= 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'} text-[11px] px-2 py-1 rounded-full`}> 
                    {pnl >= 0 ? 'Profit' : 'Loss'} {invested > 0 ? `${profitPercent.toFixed(2)}%` : ''}
                  </span>
                </div>
              )}
            />
            <StatCard title="Current Value" value={currentValue} subtitle="Market value of holdings" colorFrom="from-indigo-600" colorTo="to-blue-600" icon={<span>💹</span>} />
            <StatCard title="Wallet Balance" value={walletBalance} subtitle="Available cash" colorFrom="from-amber-600" colorTo="to-orange-600" icon={<span>🏦</span>} />
          </div>
        )}

        {/* Account Details and Profile Info (same as your current code) */}
      </div>
    </div>
  )
}

export default Dashboard
