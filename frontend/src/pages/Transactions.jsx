"use client"

import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import { useAuth } from "../context/AuthContext"
import { transactionsAPI, stocksAPI } from "../services/api"
import LoadingSpinner from "../components/LoadingSpinner"
import { Plus, Trash2, RefreshCw } from "lucide-react"
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js"
import { Pie, Bar } from "react-chartjs-2"

// Register Chart.js components
ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const Transactions = () => {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [stocks, setStocks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    stock_id: "",
    transaction_type: "BUY",
    quantity: "",
    price: "",
  })

  useEffect(() => {
    if (user?.id) {
      fetchData()
    } else {
      setLoading(false)
      toast.error("User not authenticated")
    }
  }, [user])

  const fetchData = async () => {
    if (!user?.id) {
      toast.error("User not authenticated")
      setTransactions([])
      setStocks([])
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const [transactionsRes, stocksRes] = await Promise.all([
        transactionsAPI.getTransactionsByUserId(user.id),
        stocksAPI.getAllStocks(),
      ])

      setTransactions(Array.isArray(transactionsRes) ? transactionsRes : [])
      setStocks(Array.isArray(stocksRes) ? stocksRes : [])
    } catch (error) {
      console.error("Error fetching data:", error)
      toast.error("Failed to load transactions")
      setTransactions([])
      setStocks([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchPrice = async () => {
      if (formData.stock_id) {
        try {
          const response = await stocksAPI.getStockPrice(formData.stock_id)
          setFormData((prev) => ({
            ...prev,
            price: response.last_price || "",
          }))
        } catch (error) {
          console.error("Error fetching stock price:", error)
          setFormData((prev) => ({
            ...prev,
            price: "",
          }))
          toast.error("Failed to load stock price")
        }
      } else {
        setFormData((prev) => ({
          ...prev,
          price: "",
        }))
      }
    }
    fetchPrice()
  }, [formData.stock_id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await transactionsAPI.createTransaction({
        ...formData,
        user_id: user.id,
        quantity: Number.parseInt(formData.quantity),
      })

      toast.success("Transaction created successfully")
      setShowForm(false)
      setFormData({
        stock_id: "",
        transaction_type: "BUY",
        quantity: "",
        price: "",
      })
      fetchData()
    } catch (error) {
      console.error("Error creating transaction:", error)
      toast.error("Failed to create transaction")
    }
  }

  const handleDelete = async (transactionId) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await transactionsAPI.deleteTransaction(transactionId)
        toast.success("Transaction deleted successfully")
        fetchData()
      } catch (error) {
        console.error("Error deleting transaction:", error)
        toast.error("Failed to delete transaction")
      }
    }
  }

  // Prepare data for Pie Chart (BUY vs SELL distribution)
  const transactionTypeData = {
    labels: ["BUY", "SELL"],
    datasets: [
      {
        data: [
          transactions.filter((t) => t.transaction_type === "BUY").length,
          transactions.filter((t) => t.transaction_type === "SELL").length,
        ],
        backgroundColor: ["#4CAF50", "#EF5350"],
        borderColor: ["#388E3C", "#D32F2F"],
        borderWidth: 1,
      },
    ],
  }

  // Prepare data for Bar Chart (Quantity over time)
  const transactionQuantityData = {
    labels: transactions.map((t) => new Date(t.transaction_date).toLocaleDateString()),
    datasets: [
      {
        label: "Transaction Quantity",
        data: transactions.map((t) => t.quantity),
        backgroundColor: "#42A5F5",
        borderColor: "#1E88E5",
        borderWidth: 1,
      },
    ],
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
        <h1 className="text-2xl font-bold text-white">Transactions</h1>
        <div className="flex space-x-2">
          <button onClick={fetchData} className="btn-secondary flex items-center">
            <RefreshCw className="mr-2" size={16} />
            Refresh
          </button>
          <button onClick={() => setShowForm(true)} className="btn-primary flex items-center">
            <Plus className="mr-2" size={16} />
            New Transaction
          </button>
        </div>
      </div>

      {/* Transaction Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold text-white mb-4">New Transaction</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Stock</label>
                <select
                  value={formData.stock_id}
                  onChange={(e) => setFormData({ ...formData, stock_id: e.target.value })}
                  className="input-field"
                  required
                >
                  <option value="">Select a stock</option>
                  {stocks.map((stock) => (
                    <option key={stock.stock_id} value={stock.stock_id}>
                      {stock.symbol} - {stock.isin}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Transaction Type</label>
                <select
                  value={formData.transaction_type}
                  onChange={(e) => setFormData({ ...formData, transaction_type: e.target.value })}
                  className="input-field"
                >
                  <option value="BUY">BUY</option>
                  <option value="SELL">SELL</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Quantity</label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="input-field"
                  required
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  readOnly
                  className="input-field bg-gray-700 text-white"
                  placeholder="Price will be fetched after selecting stock"
                />
              </div>

              <div className="flex space-x-2 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  Create Transaction
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Visualizations */}
      {transactions.length > 0 && (
        <div className="card space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Buy vs Sell Distribution</h3>
              <div style={{ maxWidth: "400px", margin: "0 auto" }}>
                <Pie
                  data={transactionTypeData}
                  options={{
                    plugins: {
                      legend: { labels: { color: "#ffffff" } },
                    },
                  }}
                />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Transaction Quantities by Date</h3>
              <div style={{ maxWidth: "100%" }}>
                <Bar
                  data={transactionQuantityData}
                  options={{
                    plugins: {
                      legend: { labels: { color: "#ffffff" } },
                    },
                    scales: {
                      x: { ticks: { color: "#ffffff" } },
                      y: { ticks: { color: "#ffffff" }, beginAtZero: true },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transactions Table */}
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4">Transaction History</h3>

        {transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="sticky top-0 bg-gray-800">
                <tr className="border-b border-gray-700">
                  <th className="pb-3 px-4 text-gray-400 font-medium w-16">ID</th>
                  <th className="pb-3 px-4 text-gray-400 font-medium w-24">Stock ID</th>
                  <th className="pb-3 px-4 text-gray-400 font-medium w-24">Type</th>
                  <th className="pb-3 px-4 text-gray-400 font-medium w-24 text-right">Quantity</th>
                  <th className="pb-3 px-4 text-gray-400 font-medium w-24 text-right">Price</th>
                  <th className="pb-3 px-4 text-gray-400 font-medium w-32">Date</th>
                  <th className="pb-3 px-4 text-gray-400 font-medium w-24">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr
                    key={transaction.transaction_id}
                    className="border-b border-gray-800 hover:bg-gray-700 transition-colors"
                  >
                    <td className="py-4 px-4 text-white font-medium">{transaction.transaction_id}</td>
                    <td className="py-4 px-4 text-gray-300">{transaction.stock_id}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          transaction.transaction_type === "BUY"
                            ? "bg-green-900 text-green-300"
                            : "bg-red-900 text-red-300"
                        }`}
                      >
                        {transaction.transaction_type}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-300 text-right">{transaction.quantity}</td>
                    <td className="py-4 px-4 text-gray-300 text-right">
                      ₹{parseFloat(transaction.price || 0).toFixed(2)}
                    </td>
                    <td className="py-4 px-4 text-gray-300">
                      {new Date(transaction.transaction_date).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleDelete(transaction.transaction_id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400">No transactions found</p>
            <p className="text-sm text-gray-500 mt-2">Create your first transaction to get started</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Transactions