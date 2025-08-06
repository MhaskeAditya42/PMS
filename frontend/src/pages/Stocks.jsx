"use client"

import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import { useAuth } from "../context/AuthContext"
import { stocksAPI, watchlistAPI } from "../services/api"
import LoadingSpinner from "../components/LoadingSpinner"
import { Search, Plus, Edit, Trash2, RefreshCw, TrendingUp } from "lucide-react"

const Stocks = () => {
  const { user } = useAuth()
  const [stocks, setStocks] = useState([])
  const [watchlist, setWatchlist]= useState([])
  const [filteredStocks, setFilteredStocks] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingStock, setEditingStock] = useState(null)
  const [formData, setFormData] = useState({
    symbol: "",
    isin: "",
    series: "",
  })

  const isAdmin = user?.id === "admin_pms" || user?.role === "admin"

  useEffect(() => {
    fetchStocks()
  }, [])

  useEffect(() => {
    const filtered = stocks.filter(
      (stock) =>
        stock.symbol?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.isin?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredStocks(filtered)
  }, [stocks, searchTerm])

  const fetchStocks = async () => {
    setLoading(true)
    try {
      const data = await stocksAPI.getAllStocks()
      setStocks(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching stocks:", error)
      toast.error("Failed to load stocks")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingStock) {
        await stocksAPI.updateStock({
          ...formData,
          stock_id: editingStock.stock_id,
        })
        toast.success("Stock updated successfully")
      } else {
        await stocksAPI.createStock(formData)
        toast.success("Stock created successfully")
      }

      setShowForm(false)
      setEditingStock(null)
      setFormData({ symbol: "", isin: "", series: "" })
      fetchStocks()
    } catch (error) {
      console.error("Error saving stock:", error)
      toast.error("Failed to save stock")
    }
  }

  const handleEdit = (stock) => {
    setEditingStock(stock)
    setFormData({
      symbol: stock.symbol || "",
      isin: stock.isin || "",
      series: stock.series || "",
    })
    setShowForm(true)
  }

  const handleDelete = async (stockId) => {
    if (window.confirm("Are you sure you want to delete this stock?")) {
      try {
        await stocksAPI.deleteStock(stockId)
        toast.success("Stock deleted successfully")
        fetchStocks()
      } catch (error) {
        console.error("Error deleting stock:", error)
        toast.error("Failed to delete stock")
      }
    }
  }

  const handleAddToWatchlist = async (stockId) => {
    try {
      await watchlistAPI.addToWatchlist(stockId, user?.id)
      toast.success("Added to watchlist")
    } catch (error) {
      console.error("Error adding to watchlist:", error)
      toast.error("Failed to add to watchlist")
    }
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
        <h1 className="text-2xl font-bold text-white">Stocks</h1>
        <div className="flex space-x-2">
          <button onClick={fetchStocks} className="btn-secondary flex items-center">
            <RefreshCw className="mr-2" size={16} />
            Refresh
          </button>
          {isAdmin && (
            <button onClick={() => setShowForm(true)} className="btn-primary flex items-center">
              <Plus className="mr-2" size={16} />
              Add Stock
            </button>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search stocks by symbol or ISIN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      {/* Stock Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold text-white mb-4">{editingStock ? "Edit Stock" : "Add New Stock"}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Symbol</label>
                <input
                  type="text"
                  value={formData.symbol}
                  onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">ISIN</label>
                <input
                  type="text"
                  value={formData.isin}
                  onChange={(e) => setFormData({ ...formData, isin: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Series</label>
                <input
                  type="text"
                  value={formData.series}
                  onChange={(e) => setFormData({ ...formData, series: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div className="flex space-x-2 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  {editingStock ? "Update Stock" : "Add Stock"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingStock(null)
                    setFormData({ symbol: "", isin: "", series: "" })
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stocks Table */}
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <TrendingUp className="mr-2" size={20} />
          All Stocks ({filteredStocks.length})
        </h3>

        {filteredStocks.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="pb-3 text-gray-400 font-medium">Stock ID</th>
                  <th className="pb-3 text-gray-400 font-medium">Symbol</th>
                  <th className="pb-3 text-gray-400 font-medium">ISIN</th>
                  <th className="pb-3 text-gray-400 font-medium">Series</th>
                  <th className="pb-3 text-green-400 font-medium">Low</th>
                  <th className="pb-3 text-yellow-400 font-medium">High</th>
                  <th className="pb-3 text-red-400 font-medium">Close Price</th>
                  <th className="pb-3 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStocks.map((stock) => (
                  <tr key={stock.stock_id} className="border-b border-gray-800">
                    <td className="py-4 text-white font-medium">{stock.stock_id}</td>
                    <td className="py-4 text-gray-300 font-medium">{stock.symbol}</td>
                    <td className="py-4 text-gray-300">{stock.isin}</td>
                    <td className="py-4 text-gray-300">{stock.series}</td>
                    <td className="py-4 text-green-300">{stock.low_price}</td>
                    <td className="py-4 text-yellow-300">{stock.high_price}</td>
                    <td className="py-4 text-red-300">{stock.close_price}</td>
                    <td className="py-4">
                      <div className="flex space-x-2">
                        {isAdmin && (
                          <>
                            <button onClick={() => handleEdit(stock)} className="text-blue-400 hover:text-blue-300">
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(stock.stock_id)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleAddToWatchlist(stock.stock_id)}
                          className="text-green-400 hover:text-green-300"
                        >
                          + Watchlist
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <TrendingUp className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-400">
              {searchTerm ? "No stocks found matching your search" : "No stocks available"}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {searchTerm ? "Try a different search term" : "Add stocks to get started"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Stocks
