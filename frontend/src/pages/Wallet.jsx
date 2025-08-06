"use client"

import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import { useAuth } from "../context/AuthContext"
import { walletAPI } from "../services/api"
import LoadingSpinner from "../components/LoadingSpinner"
import { WalletIcon, RefreshCw, AlertTriangle } from "lucide-react"

const Wallet = () => {
  const { user } = useAuth()
  const [wallet, setWallet] = useState(null)
  const [loading, setLoading] = useState(true)
  const [addAmount, setAddAmount] = useState("")
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    if (user?.id) {
      fetchWallet()
      const interval = setInterval(fetchWallet, 30000)
      return () => clearInterval(interval)
    } else {
      setLoading(false)
      toast.error("User not authenticated")
    }
  }, [user])

  const fetchWallet = async () => {
    if (!user?.id) {
      toast.error("User not authenticated")
      setWallet(null)
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const data = await walletAPI.getWalletBalance(user.id)
      setWallet(data)
    } catch (error) {
      console.error("Error fetching wallet:", error)
      toast.error("Failed to load wallet information")
      setWallet(null)
    } finally {
      setLoading(false)
    }
  }

  const handleAddBalance = async () => {
    if (!addAmount || isNaN(addAmount) || parseFloat(addAmount) <= 0) {
      toast.error("Please enter a valid amount greater than 0")
      return
    }

    try {
      setAdding(true)
      await walletAPI.addBalance(user.id, parseFloat(addAmount))
      toast.success("Balance added successfully")
      setAddAmount("")
      fetchWallet()
    } catch (error) {
      console.error("Error adding balance:", error)
      toast.error("Failed to add balance")
    } finally {
      setAdding(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  const isLowBalance = parseFloat(wallet?.balance || 0) < 100

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Wallet</h1>
        <button onClick={fetchWallet} className="btn-secondary flex items-center" disabled={loading}>
          <RefreshCw className={`mr-2 ${loading ? "animate-spin" : ""}`} size={16} />
          Refresh
        </button>
      </div>

      {/* Low Balance Alert */}
      {isLowBalance && (
        <div className="bg-red-900 border border-red-700 rounded-lg p-4 flex items-center">
          <AlertTriangle className="text-red-400 mr-3" size={20} />
          <div>
            <p className="text-red-300 font-medium">Low Balance Alert</p>
            <p className="text-red-400 text-sm">
              Your wallet balance is below $100. Consider adding funds to continue trading.
            </p>
          </div>
        </div>
      )}

      {/* Wallet Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <WalletIcon className="mr-2" size={20} />
              Current Balance
            </h3>
          </div>

          <div className="text-center">
            <p className={`text-4xl font-bold mb-2 ${isLowBalance ? "text-red-400" : "text-green-400"}`}>
              ${parseFloat(wallet?.balance || 0).toFixed(2)}
            </p>
            <p className="text-gray-400 text-sm">Available for trading</p>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">Wallet Details</h3>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">User ID:</span>
              <span className="text-white font-medium">{wallet?.user_id || user.id}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-400">Last Updated:</span>
              <span className="text-white">
                {wallet?.last_updated ? new Date(wallet.last_updated).toLocaleString() : "Never"}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-400">Status:</span>
              <span className={`font-medium ${isLowBalance ? "text-red-400" : "text-green-400"}`}>
                {isLowBalance ? "Low Balance" : "Active"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Balance History Placeholder */}
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4">Balance Overview</h3>

        <div className="text-center py-8">
          <WalletIcon className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-400">Balance history and analytics</p>
          <p className="text-sm text-gray-500 mt-2">Feature coming soon - Track your wallet balance over time</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Add Funds */}
          <div className="p-4 text-left border border-gray-700 rounded-lg">
            <p className="font-medium text-white mb-2">Add Funds</p>
            <div className="flex flex-col space-y-2">
              <input
                type="number"
                placeholder="Enter amount"
                value={addAmount}
                onChange={(e) => setAddAmount(e.target.value)}
                className="input bg-gray-800 text-white border border-gray-600 rounded p-2"
              />
              <button
                className="btn-primary p-2 flex justify-center items-center"
                onClick={handleAddBalance}
                disabled={adding}
              >
                {adding ? "Adding..." : "Add Funds"}
              </button>
            </div>
          </div>

          {/* Transaction History */}
          <button className="btn-secondary p-4 text-left">
            <div>
              <p className="font-medium">Transaction History</p>
              <p className="text-sm opacity-75">View your wallet transactions</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Wallet
