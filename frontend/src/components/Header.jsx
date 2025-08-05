"use client"
import { Menu, Bell, User } from "lucide-react"
import { useAuth } from "../context/AuthContext"

const Header = ({ onMenuClick }) => {
  const { user } = useAuth()

  return (
    <header className="bg-primary-600 border-b border-neutral-100 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button onClick={onMenuClick} className="lg:hidden text-neutral-100 hover:text-secondary-500 mr-4 transition-colors duration-200">
            <Menu size={24} />
          </button>
          <h2 className="text-lg font-semibold text-neutral-50">Portfolio Management</h2>
        </div>

        <div className="flex items-center space-x-4">
          <button className="text-neutral-100 hover:text-secondary-500 transition-colors duration-200">
            <Bell size={20} />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-accent-500 rounded-full flex items-center justify-center">
              <User size={16} className="text-neutral-50" />
            </div>
            <span className="text-sm text-neutral-100">User {user?.id}</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header