import React, { useEffect, useState } from 'react'
import { API_URL } from '../constant'
import { useNavigate } from 'react-router-dom'

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
      {icon && (
        <span className="text-white/80">{icon}</span>
      )}
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
          fetch(`${API_URL}/dashboard/invested`, { credentials: 'include' }),
          fetch(`${API_URL}/dashboard/returns`, { credentials: 'include' }),
          fetch(`${API_URL}/dashboard/current_value`, { credentials: 'include' }),
          fetch(`${API_URL}/user/GetCurrentUser`, { credentials: 'include' }),
          fetch(`${API_URL}/dashboard/wallet_balance`, { credentials: 'include' })
        ])

        const inv = await invRes.json()
        const ret = await retRes.json()
        const cur = await curRes.json()
        const usr = await userRes.json()
        const wal = await walRes.json()

        if (!isActive) return
        if (!inv.success || !ret.success || !cur.success || !usr.success || !wal.success) {
          throw new Error('Failed to fetch dashboard data')
        }

        setInvested(inv.data || 0)
        setReturns(ret.data || 0)
        setCurrentValue(cur.data || 0)
        setUser(usr.data)
        setWalletBalance(wal.data || 0)
      } catch (e) {
        setError(e?.message || 'Something went wrong')
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
            <div className="h-full">
              <StatCard
                title="Total Invested"
                value={invested}
                subtitle="Your invested capital"
                icon={<span>💼</span>}
              />
            </div>
            <div className="h-full">
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
            </div>
            <div className="h-full">
              <StatCard
                title="Current Value"
                value={currentValue}
                subtitle="Market value of holdings"
                colorFrom="from-indigo-600" colorTo="to-blue-600"
                icon={<span>💹</span>}
              />
            </div>
            <div className="h-full">
              <StatCard
                title="Wallet Balance"
                value={walletBalance}
                subtitle="Available cash"
                colorFrom="from-amber-600" colorTo="to-orange-600"
                icon={<span>🏦</span>}
              />
            </div>
          </div>
        )}

        <div className="mt-6 sm:mt-8 rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base sm:text-lg font-semibold">Account Details</h2>
            {!loading && (
              <button onClick={() => navigate('/layout/add-money')} className="text-xs sm:text-sm px-3 py-1.5 rounded-lg bg-purple-600/80 hover:bg-purple-600 text-white transition-colors">
                Add Money
              </button>
            )}
          </div>
          {loading ? (
            <div className="mt-3 space-y-2">
              {[...Array(4)].map((_, idx) => (
                <div key={idx} className="h-9 rounded-lg bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <p className="text-red-400 mt-3">{error}</p>
          ) : (
            <div className="mt-4 space-y-4">
              {/* Profile Info Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <span className="text-blue-400 text-lg">👤</span>
                    </div>
                    <div>
                      <div className="text-gray-400 text-xs font-medium">Full Name</div>
                      <div className="text-white font-semibold text-sm">{user?.name || 'Not Available'}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <span className="text-green-400 text-lg">📧</span>
                    </div>
                    <div>
                      <div className="text-gray-400 text-xs font-medium">Email Address</div>
                      <div className="text-white font-semibold text-sm break-all">{user?.email || 'Not Available'}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <span className="text-purple-400 text-lg">🏷️</span>
                    </div>
                    <div>
                      <div className="text-gray-400 text-xs font-medium">Username</div>
                      <div className="text-white font-semibold text-sm">{user?.username || 'Not Available'}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-500/20 rounded-lg">
                      <span className="text-orange-400 text-lg">🆔</span>
                    </div>
                    <div>
                      <div className="text-gray-400 text-xs font-medium">PAN Number</div>
                      <div className="text-white font-semibold text-sm">{user?.pan || 'Not Available'}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-yellow-500/20 rounded-lg">
                    <span className="text-yellow-400 text-lg">ℹ️</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">Account Information</div>
                    <div className="text-gray-400 text-xs">Your account details and verification status</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Account Status:</span>
                    <span className="text-green-400 font-medium">Active ✅</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Member Since:</span>
                    <span className="text-white font-medium">{new Date().getFullYear()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard

