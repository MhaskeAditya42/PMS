"use client"

import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import { useAuth } from "../context/AuthContext"
import { portfolioAPI } from "../services/api"
import LoadingSpinner from "../components/LoadingSpinner"
import { RefreshCw, TrendingUp, TrendingDown } from "lucide-react"
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js"
import { Pie, Bar } from "react-chartjs-2"

// Register Chart.js components
ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const Portfolio = () => {
  const { user } = useAuth()
  const [portfolio, setPortfolio] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.id) {
      fetchPortfolio()
    } else {
      setLoading(false)
      toast.error("User not authenticated")
    }
  }, [user])

  const fetchPortfolio = async () => {
    if (!user?.id) {
      toast.error("User not authenticated")
      setPortfolio([])
      setLoading(false)
      return
    }

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

  const totalValue = portfolio.reduce((total, item) => total + item.quantity * parseFloat(item.avg_buy_price || 0), 0)

  // Prepare data for Pie Chart (Portfolio value distribution by stock)
  const portfolioValueData = {
    labels: portfolio.map((item) => item.symbol),
    datasets: [
      {
        data: portfolio.map((item) => item.quantity * parseFloat(item.avg_buy_price || 0)),
        backgroundColor: ["#4CAF50", "#EF5350", "#42A5F5", "#AB47BC", "#FFCA28", "#26A69A"],
        borderColor: ["#388E3C", "#D32F2F", "#1E88E5", "#8E24AA", "#FFB300", "#00897B"],
        borderWidth: 1,
      },
    ],
  }

  // Prepare data for Bar Chart (Quantity per stock)
  const portfolioQuantityData = {
    labels: portfolio.map((item) => item.stock_id),
    datasets: [
      {
        label: "Quantity",
        data: portfolio.map((item) => item.quantity),
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
              <p className="text-2xl font-bold text-green-400">₹{totalValue.toFixed(2)}</p>
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

      {/* Visualizations */}
      {portfolio.length > 0 && (
        <div className="card space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Portfolio Value by Stock</h3>
              <div style={{ maxWidth: "400px", margin: "0 auto" }}>
                <Pie
                  data={portfolioValueData}
                  options={{
                    plugins: {
                      legend: {
                        position: "right",
                        labels: {
                          color: "#ffffff",
                          boxWidth: 20,
                          padding: 20,
                          generateLabels: (chart) => {
                            const { data } = chart;
                            return data.labels.map((label, index) => ({
                              text: label,
                              fillStyle: data.datasets[0].backgroundColor[index],
                              strokeStyle: data.datasets[0].borderColor[index],
                              lineWidth: 1,
                              hidden: false,
                              index,
                            }));
                          },
                        },
                      },
                      tooltip: {
                        callbacks: {
                          label: (context) => {
                            const label = context.label || "";
                            const value = context.raw || 0;
                            return `${label}: ₹${value.toFixed(2)}`;
                          },
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Quantity by Stock</h3>
              <div style={{ maxWidth: "100%" }}>
                <Bar
                  data={portfolioQuantityData}
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

      {/* Portfolio Table */}
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4">Holdings</h3>

        {portfolio.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="sticky top-0 bg-gray-800">
                <tr className="border-b border-gray-700">
                  <th className="pb-3 px-4 text-gray-400 font-medium w-24">Stock Symbol</th>
                  <th className="pb-3 px-4 text-gray-400 font-medium w-24 text-right">Quantity</th>
                  <th className="pb-3 px-4 text-gray-400 font-medium w-28 text-right">Avg Buy Price</th>
                  <th className="pb-3 px-4 text-gray-400 font-medium w-28 text-right">Current Quantity</th>
                  <th className="pb-3 px-4 text-gray-400 font-medium w-28 text-right">Total Value</th>
                </tr>
              </thead>
              <tbody>
                {portfolio.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-800 hover:bg-gray-700 transition-colors"
                  >
                    <td className="py-4 px-4 text-white font-medium">{item.symbol}</td>
                    <td className="py-4 px-4 text-gray-300 text-right">{item.quantity}</td>
                    <td className="py-4 px-4 text-gray-300 text-right">₹{parseFloat(item.avg_buy_price || 0).toFixed(2)}</td>
                    <td className="py-4 px-4 text-gray-300 text-right">{item.current_quantity || item.quantity}</td>
                    <td className="py-4 px-4 text-green-400 font-medium text-right">
                      ₹{(item.quantity * parseFloat(item.avg_buy_price || 0)).toFixed(2)}
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