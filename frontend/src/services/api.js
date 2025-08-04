import axios from "axios"

const API_BASE_URL = "http://localhost:3000/api"

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      localStorage.removeItem("user_id")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

// Auth API
export const authAPI = {
  login: async (credentials) => {
    try {
      const response = await api.post("/login", credentials)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },
}

// Portfolio API
export const portfolioAPI = {
  getUserPortfolio: async (userId) => {
    try {
      const response = await api.get(`/portfolio/${userId}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },
  updatePortfolio: async (userId, stockId, data) => {
    try {
      const response = await api.put(`/portfolio/${userId}/${stockId}`, data)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },
}

// Stocks API
export const stocksAPI = {
  getAllStocks: async () => {
    try {
      const response = await api.get("/stocks/getAllStocks")
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },
  getStockById: async (stockId) => {
    try {
      const response = await api.get(`/stocks/getStockById?id=${stockId}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },
  createStock: async (stockData) => {
    try {
      const response = await api.post("/stocks/createStock", stockData)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },
  updateStock: async (stockData) => {
    try {
      const response = await api.put("/stocks/updateStock", stockData)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },
  deleteStock: async (stockId) => {
    try {
      const response = await api.delete(`/stocks/deleteStocks?id=${stockId}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },
}

// Transactions API
export const transactionsAPI = {
  createTransaction: async (transactionData) => {
    try {
      const response = await api.post("/transactions/createTransaction", transactionData)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },
  getAllTransactions: async () => {
    try {
      const response = await api.get("/transactions/getAllTransactions")
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },
  getTransactionsByUserId: async (userId) => {
    try {
      const response = await api.get(`/transactions/getTransactionByUserId?userId=${userId}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },
  getTransactionById: async (transactionId) => {
    try {
      const response = await api.get(`/transactions/getTransactionById?id=${transactionId}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },
  deleteTransaction: async (transactionId) => {
    try {
      const response = await api.delete(`/transactions/deleteTransactionById?id=${transactionId}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },
}

// Watchlist API
export const watchlistAPI = {
  addToWatchlist: async (data) => {
    try {
      const response = await api.post("/watchlist/addtoWatchList", data)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },
  getWatchlistByUserId: async (userId) => {
    try {
      const response = await api.get(`/watchlist/getWatchlistByUserId?userId=${userId}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },
  removeFromWatchlist: async (userId, stockId) => {
    try {
      const response = await api.delete(`/watchlist/removeStockfromWatchlist?userId=${userId}&stockId=${stockId}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },
}

// Wallet API
export const walletAPI = {
  getWalletBalance: async (userId) => {
    try {
      const response = await api.get(`/wallet/${userId}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },
}
