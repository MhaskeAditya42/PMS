"use client"

import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import { useAuth } from "../context/AuthContext"
import { portfolioAPI } from "../services/api"
import LoadingSpinner from "../components/LoadingSpinner"
import { RefreshCw, TrendingUp, TrendingDown } from "lucide-react"

const Portfolio = () => {
  const { user } = useAuth()
  const [portfolio, setPortfolio] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPortfolio()
  }, [user])

  const fetchPortfolio = async () => {
    setLoading(true)
    try {
      const data = await portfolioAPI.getUserPortfolio(user.id)
      setPortfolio(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching portfolio:", error)
      toast.error("Failed to load portfolio")
      setPortfolio([])
    } finally {
      setLoading(false)
    }
  }

  const totalValue = portfolio.reduce((total, item) => total + item.quantity * item.avg_buy_price, 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Portfolio</h1>
        <button onClick={fetchPortfolio} className="btn-secondary flex items-center" disabled={loading}>
          <RefreshCw className={`mr-2 ${loading ? "animate-spin" : ""}`} size={16} />
          Refresh
        </button>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Value</p>
              <p className="text-2xl font-bold text-green-400">${totalValue.toFixed(2)}</p>
            </div>
            <TrendingUp className="text-green-400" size={24} />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Holdings</p>
              <p className="text-2xl font-bold text-blue-400">{portfolio.length}</p>
            </div>
            <TrendingDown className="text-blue-400" size={24} />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Quantity</p>
              <p className="text-2xl font-bold text-purple-400">
                {portfolio.reduce((total, item) => total + item.quantity, 0)}
              </p>
            </div>
            <TrendingUp className="text-purple-400" size={24} />
          </div>
        </div>
      </div>

      {/* Portfolio Table */}
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4">Holdings</h3>

        {portfolio.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="pb-3 text-gray-400 font-medium">Stock ID</th>
                  <th className="pb-3 text-gray-400 font-medium">Quantity</th>
                  <th className="pb-3 text-gray-400 font-medium">Avg Buy Price</th>
                  <th className="pb-3 text-gray-400 font-medium">Current Quantity</th>
                  <th className="pb-3 text-gray-400 font-medium">Total Value</th>
                </tr>
              </thead>
              <tbody>
                {portfolio.map((item, index) => (
                  <tr key={index} className="border-b border-gray-800">
                    <td className="py-4 text-white font-medium">{item.stock_id}</td>
                    <td className="py-4 text-gray-300">{item.quantity}</td>
                    <td className="py-4 text-gray-300">${item.avg_buy_price?.toFixed(2)}</td>
                    <td className="py-4 text-gray-300">{item.current_quantity || item.quantity}</td>
                    <td className="py-4 text-green-400 font-medium">
                      ${(item.quantity * item.avg_buy_price).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400">No portfolio holdings found</p>
            <p className="text-sm text-gray-500 mt-2">Start by making your first transaction</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Portfolio
