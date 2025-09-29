import React, { useEffect, useState } from 'react'
import { API_URL } from '../constant'
import { useNavigate } from 'react-router-dom'

const Stocks = () => {
  const [stocks, setStocks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [qtyById, setQtyById] = useState({})
  const [detailsById, setDetailsById] = useState({})
  const [activeStockId, setActiveStockId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  const navigate = useNavigate()

  // Load all stocks (default)
  const loadStocks = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API_URL}/stocks/getAllStocks`, { credentials: 'include' })
      const json = await res.json()
      if (!json.success) throw new Error(json.message || 'Failed to fetch stocks')
      setStocks(Array.isArray(json.data) ? json.data : [])
    } catch (e) {
      setError(e?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStocks()
  }, [])

  // Search API
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadStocks()
      return
    }
    setIsSearching(true)
    setError('')
    try {
      const res = await fetch(`${API_URL}/stocks/searchStock?searchQuery=${encodeURIComponent(searchQuery)}`, {
        method: 'GET',
        credentials: 'include'
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.message || 'Search failed')
      setStocks(Array.isArray(json.data) ? json.data : [])
    } catch (e) {
      setError(e?.message || 'Error searching stocks')
    } finally {
      setIsSearching(false)
    }
  }

  // Debounce search when typing
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleSearch()
    }, 300) // wait 300ms after typing stops

    return () => clearTimeout(delayDebounceFn)
  }, [searchQuery])

  // Buy stock
  const handleBuy = async (stockId) => {
    const qty = parseInt(qtyById[stockId] || '0', 10)
    if (!qty || qty <= 0) {
      alert('Enter a valid quantity')
      return
    }
    try {
      const res = await fetch(`${API_URL}/stocks/buyStock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ stockid: stockId, total_unit: qty })
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.message || 'Failed to buy stock')
      alert(`Bought successfully: ${json?.data?.stock?.name || 'Stock'}`)
      navigate('/layout/stocks')
    } catch (e) {
      alert(e?.message || 'Failed to buy stock')
    }
  }

  const ensureDetails = async (stockId) => {
    if (detailsById[stockId]) return
    try {
      const res = await fetch(`${API_URL}/stocks/getStockDetail?stockid=${encodeURIComponent(stockId)}`, {
        credentials: 'include'
      })
      const json = await res.json()
      if (json?.success && json?.data) {
        setDetailsById(prev => ({ ...prev, [stockId]: json.data }))
      }
    } catch {}
  }

  return (
    <div className="min-h-screen w-full bg-gray-950 text-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <h1 className="text-xl sm:text-2xl font-semibold">Stocks</h1>

        {/* Search Bar */}
        <div className="flex space-x-2 mt-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search stock (e.g. tata)"
            className="flex-1 border border-gray-600 rounded-md px-3 py-2 bg-black text-white"
          />
        </div>

        {(loading || isSearching) ? (
          <p className="text-gray-400 mt-6">Loading...</p>
        ) : error ? (
          <p className="text-red-400 mt-6">{error}</p>
        ) : (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {stocks.map((s) => {
              const d = detailsById[s._id]
              const availableQty = s?.available_quantity ?? d?.available_quantity
              const price = s?.price_per_unit ?? d?.price_per_unit ?? 0
              const isActive = activeStockId === s._id

              return (
                <div
                  key={s._id}
                  className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-gray-900/60 to-gray-900/30 cursor-pointer"
                  onMouseEnter={() => {
                    setActiveStockId(s._id)
                    ensureDetails(s._id)
                  }}
                  onMouseLeave={() => setActiveStockId(null)}
                  onClick={(e) => {
                    if (e.target.closest('.buy-overlay')) return
                    setActiveStockId(isActive ? null : s._id)
                    ensureDetails(s._id)
                  }}
                >
                  {/* Card content */}
                  <div className="p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-[11px] uppercase tracking-wide text-gray-400">Stock</div>
                        <div className="mt-1 text-lg font-semibold">{s.name}</div>
                        {s.description && (
                          <p className="mt-2 text-sm text-gray-400">{s.description}</p>
                        )}
                      </div>
                      <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs text-gray-200">
                        <span>₹</span>{Number(price).toLocaleString('en-IN')}
                      </span>
                    </div>

                    {availableQty !== undefined && (
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-xs text-gray-400">Available</span>
                        <span className="inline-flex items-center rounded-full bg-white/10 px-2.5 py-1 text-xs text-gray-100">
                          {availableQty}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Buy overlay */}
                  <div
                    className={`buy-overlay absolute inset-x-0 bottom-0 border-t border-white/20 bg-gray-800/70 p-4 backdrop-blur-sm transition-all duration-300 ease-in-out ${
                      isActive
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-full pointer-events-none'
                    }`}
                  >
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min="1"
                        placeholder="Qty"
                        value={qtyById[s._id] || ''}
                        onChange={(e) => setQtyById(prev => ({ ...prev, [s._id]: e.target.value }))}
                        className="flex-1 w-full rounded bg-gray-700 px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleBuy(s._id)
                        }}
                        className="rounded bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                      >
                        Buy
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Stocks
