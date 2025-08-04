"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { useAuth } from "../context/AuthContext"
import { authAPI } from "../services/api"
import LoadingSpinner from "../components/LoadingSpinner"

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password_hash: "",
  })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await authAPI.login(formData)

      if (response.user_id) {
        login({ id: response.user_id }, response.token || "dummy-token")
        toast.success("Login successful!")
        navigate("/dashboard")
      } else {
        toast.error("Invalid response from server")
      }
    } catch (error) {
      console.error("Login error:", error)
      if (error.status === 401) {
        toast.error("Invalid credentials")
      } else if (error.status === 400) {
        toast.error("Missing required fields")
      } else {
        toast.error("Login failed. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Sign in to PMS</h2>
          <p className="mt-2 text-gray-400">Portfolio Management System</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="input-field mt-1"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="input-field mt-1"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="password_hash" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <input
                id="password_hash"
                name="password_hash"
                type="password"
                required
                className="input-field mt-1"
                placeholder="Enter your password"
                value={formData.password_hash}
                onChange={handleChange}
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full btn-primary flex items-center justify-center">
            {loading ? <LoadingSpinner size="small" /> : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
