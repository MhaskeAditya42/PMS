"use client"
import { Menu, Bell, User } from "lucide-react"
import { useAuth } from "../context/AuthContext"

const Header = ({ onMenuClick }) => {
  const { user } = useAuth()

  return (
    <header className="bg-gray-800 border-b border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button onClick={onMenuClick} className="lg:hidden text-gray-400 hover:text-white mr-4">
            <Menu size={24} />
          </button>
          <h2 className="text-lg font-semibold text-white">Portfolio Management</h2>
        </div>

        <div className="flex items-center space-x-4">
          <button className="text-gray-400 hover:text-white">
            <Bell size={20} />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
              <User size={16} />
            </div>
            <span className="text-sm text-gray-300">User {user?.id}</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
