import React, { useState } from 'react'
import { API_URL } from '../constant'
import { useNavigate } from 'react-router-dom'

const AddMoney = () => {
  const [amount, setAmount] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const parsed = parseInt(amount, 10)
    if (!parsed || parsed <= 0) {
      alert('Please enter a valid amount')
      return
    }
    try {
      setIsSubmitting(true)
      const res = await fetch(`${API_URL}/user/addMoney`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ amount: parsed })
      })
      const json = await res.json()
      if (!json?.success) throw new Error(json?.message || 'Failed to add money')
      alert('Amount added successfully')
      navigate('/layout/')
    } catch (err) {
      alert(err?.message || 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-gray-950 text-gray-100">
      <div className="max-w-md mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <h1 className="text-2xl font-semibold">Add Money</h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4 bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6">
          <div>
            <label className="text-sm text-gray-300">Amount</label>
            <input
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-2 w-full h-11 px-4 rounded-lg bg-gray-900/60 border border-gray-700 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/70 focus:border-transparent"
              placeholder="Enter amount"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:from-purple-700 hover:to-pink-700 disabled:opacity-60"
          >
            {isSubmitting ? 'Adding...' : 'Add to Wallet'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddMoney

