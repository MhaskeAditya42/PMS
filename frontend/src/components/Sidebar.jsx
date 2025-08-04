"use client"
import { NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { LayoutDashboard, Briefcase, ArrowLeftRight, Eye, Wallet, TrendingUp, LogOut, X } from "lucide-react"

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const navItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/portfolio", icon: Briefcase, label: "Portfolio" },
    { path: "/transactions", icon: ArrowLeftRight, label: "Transactions" },
    { path: "/watchlist", icon: Eye, label: "Watchlist" },
    { path: "/wallet", icon: Wallet, label: "Wallet" },
    { path: "/stocks", icon: TrendingUp, label: "Stocks" },
  ]

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setIsOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-64 bg-gray-800 border-r border-gray-700 transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:z-auto`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold text-primary-400">PMS Dashboard</h1>
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <nav className="mt-8">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-6 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors ${
                  isActive ? "bg-primary-600 text-white border-r-4 border-primary-400" : ""
                }`
              }
              onClick={() => setIsOpen(false)}
            >
              <item.icon size={20} className="mr-3" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-2 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors rounded-lg"
          >
            <LogOut size={20} className="mr-3" />
            Logout
          </button>
        </div>
      </div>
    </>
  )
}

export default Sidebar
