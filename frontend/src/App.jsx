"use client"

import { useState } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import { AuthProvider } from "./context/AuthContext"
import ProtectedRoute from "./components/ProtectedRoute"
import Sidebar from "./components/Sidebar"
import Header from "./components/Header"

// Pages
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Portfolio from "./pages/Portfolio"
import Transactions from "./pages/Transactions"
import Watchlist from "./pages/Watchlist"
import Wallet from "./pages/Wallet"
import Stocks from "./pages/Stocks"

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-900">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/*"
              element={
                // <ProtectedRoute>
                  <div className="flex h-screen">
                    <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
                    <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
                      <Header onMenuClick={() => setSidebarOpen(true)} />
                      <main className="flex-1 overflow-y-auto p-6">
                        <Routes>
                          <Route path="/" element={<Navigate to="/dashboard" replace />} />
                          <Route path="/dashboard" element={<Dashboard />} />
                          <Route path="/portfolio" element={<Portfolio />} />
                          <Route path="/transactions" element={<Transactions />} />
                          <Route path="/watchlist" element={<Watchlist />} />
                          <Route path="/wallet" element={<Wallet />} />
                          <Route path="/stocks" element={<Stocks />} />
                        </Routes>
                      </main>
                    </div>
                  </div>
                // </ProtectedRoute>
              }
            />
          </Routes>

          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
