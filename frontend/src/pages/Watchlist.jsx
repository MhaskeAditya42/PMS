"use client"

import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import { useAuth } from "../context/AuthContext"
import { watchlistAPI, stocksAPI } from "../services/api"
import LoadingSpinner from "../components/LoadingSpinner"
import { Plus, Trash2, RefreshCw, Eye } from "lucide-react"

const Watchlist = () => {
  const { user } = useAuth()
  const [watchlist, setWatchlist] = useState([])
  const [stocks, setStocks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedStock, setSelectedStock] = useState("")

  useEffect(() => {
    fetchData()
  }, [user])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [watchlistRes, stocksRes] = await Promise.all([
        watchlistAPI.getWatchlistByUserId(user.id),
        stocksAPI.getAllStocks(),
      ])

      setWatchlist(Array.isArray(watchlistRes) ? watchlistRes : [])
      setStocks(Array.isArray(stocksRes) ? stocksRes : [])
    } catch (error) {
      console.error("Error fetching data:", error)
      toast.error("Failed to load watchlist")
    } finally {
      setLoading(false)
    }
  }

  const handleAddToWatchlist = async (e) => {
    e.preventDefault()
    if (!selectedStock) return

    try {
      await watchlistAPI.addToWatchlist({
        user_id: user.id,
        stock_id: selectedStock,
      })

      toast.success("Stock added to watchlist")
      setShowForm(false)
      setSelectedStock("")
      fetchData()
    } catch (error) {
      console.error("Error adding to watchlist:", error)
      toast.error("Failed to add stock to watchlist")
    }
  }

  const handleRemoveFromWatchlist = async (stockId) => {
    if (window.confirm("Are you sure you want to remove this stock from your watchlist?")) {
      try {
        await watchlistAPI.removeFromWatchlist(user.id, stockId)
        toast.success("Stock removed from watchlist")
        fetchData()
      } catch (error) {
        console.error("Error removing from watchlist:", error)
        toast.error("Failed to remove stock from watchlist")
      }
    }
  }

  const getStockDetails = (stockId) => {
    return stocks.find((stock) => stock.stock_id === stockId) || {}
  }

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
        <h1 className="text-2xl font-bold text-white">Watchlist</h1>
        <div className="flex space-x-2">
          <button onClick={fetchData} className="btn-secondary flex items-center">
            <RefreshCw className="mr-2" size={16} />
            Refresh
          </button>
          <button onClick={() => setShowForm(true)} className="btn-primary flex items-center">
            <Plus className="mr-2" size={16} />
            Add Stock
          </button>
        </div>
      </div>

      {/* Add Stock Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold text-white mb-4">Add Stock to Watchlist</h3>
            <form onSubmit={handleAddToWatchlist} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Select Stock</label>
                <select
                  value={selectedStock}
                  onChange={(e) => setSelectedStock(e.target.value)}
                  className="input-field"
                  required
                >
                  <option value="">Choose a stock</option>
                  {stocks
                    .filter((stock) => !watchlist.some((w) => w.stock_id === stock.stock_id))
                    .map((stock) => (
                      <option key={stock.stock_id} value={stock.stock_id}>
                        {stock.symbol} - {stock.isin}
                      </option>
                    ))}
                </select>
              </div>

              <div className="flex space-x-2 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  Add to Watchlist
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Watchlist Grid */}
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Eye className="mr-2" size={20} />
          Your Watchlist ({watchlist.length} stocks)
        </h3>

        {watchlist.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {watchlist.map((item) => {
              const stockDetails = getStockDetails(item.stock_id)
              return (
                <div key={item.stock_id} className="bg-gray-700 rounded-lg p-6 border-2">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-white">{stockDetails.symbol || `Stock ${item.stock_id}`}</h4>
                      <p className="text-sm text-gray-400">ISIN: {stockDetails.isin || "N/A"}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveFromWatchlist(item.stock_id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Stock ID:</span>
                      <span className="text-white">{item.stock_id}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Series:</span>
                      <span className="text-white">{stockDetails.series || "N/A"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Added:</span>
                      <span className="text-white">{new Date(item.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <Eye className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-400">Your watchlist is empty</p>
            <p className="text-sm text-gray-500 mt-2">Add stocks to keep track of their performance</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Watchlist
