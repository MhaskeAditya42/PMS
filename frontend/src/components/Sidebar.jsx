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
    { path: "/gold", icon: TrendingUp, label: "Digital Gold" },
  ]

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-neutral-800 bg-opacity-50 z-40 lg:hidden" onClick={() => setIsOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-64 bg-primary-600 border-r border-neutral-100 transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:z-auto`}
      >
        <div className="flex items-center justify-between px-4 py-[14px] border-b border-neutral-100">
          <h1 className="text-xl font-bold text-neutral-50">PMS Dashboard</h1>
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-neutral-100 hover:text-secondary-50 transition-colors duration-200">
            <X size={24} />
          </button>
        </div>

        <nav className="mt-8">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar flex items-center px-6 py-3 ${
                  isActive ?  "text-neutral-50 border-r-4 border-accent-500" : "bg-amber-300"
                }`
              }
              onClick={() => setIsOpen(false)}
            >
              <item.icon size={20} className="sidebar-icon mr-3" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-neutral-100">
          <button id="logout-btn"
            onClick={handleLogout}
            className="flex items-center w-full px-2 py-3 hover:bg-primary-400 hover:text-neutral-50 transition-colors duration-200 rounded-lg"
          >
            <LogOut size={20} className="logout-icon mr-3" />
            LogOut
          </button>
        </div>
      </div>
    </>
  )
}

export default Sidebar