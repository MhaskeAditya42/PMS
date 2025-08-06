"use client"

import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import { useAuth } from "../context/AuthContext"
import { portfolioAPI, walletAPI, transactionsAPI, watchlistAPI } from "../services/api"
import LoadingSpinner from "../components/LoadingSpinner"
import { TrendingUp, TrendingDown, Wallet, Eye } from "lucide-react"

const Dashboard = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState({
    portfolio: [],
    wallet: null,
    recentTransactions: [],
    watchlist: [],
  })

  useEffect(() => {
    if (user?.id) {
      fetchDashboardData()
      // Set up polling for real-time updates every 30 seconds
      const interval = setInterval(fetchDashboardData, 30000)
      return () => clearInterval(interval)
    } else {
      setLoading(false) // Stop loading if no user
    }
  }, [user])

  const fetchDashboardData = async () => {
    if (!user?.id) {
      toast.error("User not authenticated")
      setLoading(false)
      return
    }

    try {
      const [portfolioRes, walletRes, transactionsRes, watchlistRes] = await Promise.allSettled([
        portfolioAPI.getUserPortfolio(user.id),
        walletAPI.getWalletBalance(user.id),
        transactionsAPI.getTransactionsByUserId(user.id),
        watchlistAPI.getWatchlistByUserId(user.id),
      ])

      setDashboardData({
        portfolio: portfolioRes.status === "fulfilled" ? portfolioRes.value : [],
        wallet: walletRes.status === "fulfilled" ? walletRes.value : null,
        recentTransactions: transactionsRes.status === "fulfilled" ? transactionsRes.value?.slice(0, 5) || [] : [],
        watchlist: watchlistRes.status === "fulfilled" ? watchlistRes.value : [],
      })
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      toast.error("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  const portfolioValue = dashboardData.portfolio.reduce((total, item) => total + item.quantity * item.avg_buy_price, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
        <button onClick={fetchDashboardData} className="btn-secondary">
          Refresh
        </button>
      </div>
      <p>Welcome back User! The following is your portfolio summary</p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card border-black border p-6 rounded-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Portfolio Value</p>
              <p className="text-2xl font-bold text-green-400">${portfolioValue.toFixed(2)}</p>
            </div>
            <TrendingUp className="text-green-400" size={24} />
          </div>
        </div>

        <div className="card border-black border p-6 rounded-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Wallet Balance</p>
              <p className="text-2xl font-bold text-blue-400">
                ${parseFloat(dashboardData.wallet?.balance || 0).toFixed(2)}
              </p>
              {parseFloat(dashboardData.wallet?.balance || 0) < 100 && (
                <p className="text-red-400 text-xs mt-1">Low balance!</p>
              )}
            </div>
            <Wallet className="text-blue-400" size={24} />
          </div>
        </div>

        <div className="card border-black border p-6 rounded-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Stocks</p>
              <p className="text-2xl font-bold text-purple-400">{dashboardData.portfolio.length}</p>
            </div>
            <TrendingDown className="text-purple-400" size={24} />
          </div>
        </div>

        <div className="card border rounded-md p-6">
        <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Watchlist Items</p>
              <p className="text-2xl font-bold text-yellow-400">{dashboardData.watchlist.length}</p>
            </div>
            <Eye className="text-yellow-400" size={24} />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Portfolio Holdings */}
        <div className="card border p-8 rounded-md">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <TrendingUp className="mr-2" size={20} />
            Portfolio Holdings
          </h3>
          <div className="space-y-3">
            {dashboardData.portfolio.slice(0, 5).map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-white">Stock ID: {item.stock_id}</p>
                  <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-400">${(item.quantity * item.avg_buy_price).toFixed(2)}</p>
                  <p className="text-sm text-gray-400">@${item.avg_buy_price}</p>
                </div>
              </div>
            ))}
            {dashboardData.portfolio.length === 0 && (
              <p className="text-gray-400 text-center border rounded-md py-30">No portfolio holdings</p>
            )}
          </div>
        </div>

        {/* Watchlist */}
        <div className="card border p-8 rounded-md">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Eye className="mr-2" size={20} />
            Watchlist
          </h3>
          <div className="space-y-3">
            {dashboardData.watchlist.slice(0, 5).map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-white">Stock ID: {item.stock_id}</p>
                  <p className="text-sm text-gray-400">Added: {new Date(item.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
            {dashboardData.watchlist.length === 0 && (
              <p className="text-gray-400 text-center border rounded-md py-30">No watchlist items</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard