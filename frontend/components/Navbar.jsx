// src/components/Navbar.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const handleLogout = async () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    navigate('/login', { replace: true })
  }

  return (
    <nav className="bg-red-600 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold flex items-center">
            <span className="mr-2">🛒</span>
            <span>Sellit.</span>
          </Link>

          {/* Search Bar - Hidden on md */}
          <div className="hidden md:flex flex-1 mx-6">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                className="bg-white w-full py-2 px-4 rounded-lg text-gray-800 focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="absolute right-0 top-0 h-full px-4 bg-red-500 rounded-r-lg hover:bg-red-700 transition">
                🔍
              </button>
            </div>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/categories" className="hover:text-red-200 transition">
              Categories
            </Link>
            <Link to="/flash-sale" className="hover:text-red-200 transition">
              Flash Sale
            </Link>
            <Link to="/cart" className="relative hover:text-red-200 transition">
              Cart
              <span className="absolute -top-2 -right-2 bg-white text-red-600 rounded-full w-5 h-5 flex items-center justify-center text-xs">
                3
              </span>
            </Link>

            <div className="border-l border-red-400 h-6"></div>

            <div className="group relative">
              <button className="flex items-center">
                My Account <span className="ml-1">▼</span>
              </button>

              <div
                className="
                  absolute right-0 top-full w-48 bg-white rounded-md shadow-lg py-1
                  opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto
                  transition-opacity duration-200 text-gray-800"
              >
                {token ? (
                  <>
                    <Link
                      to="/account/wallet"
                      className="block px-4 py-2 hover:bg-red-100"
                    >
                      Wallet
                    </Link>
                    <Link
                      to="/account/orders"
                      className="block px-4 py-2 hover:bg-red-100"
                    >
                      Orders
                    </Link>
                    <Link
                      to="/seller"
                      className="block px-4 py-2 hover:bg-red-100"
                    >
                      Seller Dashboard
                    </Link>
                    <div className="border-t border-gray-200"></div>
                    <Link
                      to="/help"
                      className="block px-4 py-2 hover:bg-red-100"
                    >
                      Help Center
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 hover:bg-red-100"
                    >
                      Log Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/signup"
                      className="block px-4 py-2 hover:bg-red-100"
                    >
                      Sign Up
                    </Link>
                    <Link
                      to="/login"
                      className="block px-4 py-2 hover:bg-red-100"
                    >
                      Log In
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen((o) => !o)}
          >
            {isMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Search Bar - Mobile */}
        <div className="mt-3 md:hidden">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full py-2 px-4 rounded-lg text-gray-800 focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="absolute right-0 top-0 h-full px-4 bg-red-500 rounded-r-lg hover:bg-red-700 transition">
              🔍
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-red-700 py-3">
          <div className="container mx-auto px-4">
            <div className="flex flex-col space-y-1">
              <Link
                to="/categories"
                className="py-2 hover:bg-red-800 px-2 rounded"
              >
                Categories
              </Link>
              <Link
                to="/flash-sale"
                className="py-2 hover:bg-red-800 px-2 rounded"
              >
                Flash Sale
              </Link>
              <Link
                to="/cart"
                className="py-2 hover:bg-red-800 px-2 rounded flex justify-between"
              >
                Cart
                <span className="bg-white text-red-600 rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  3
                </span>
              </Link>
              {token ? (
                <>
                  <Link
                    to="/account/wallet"
                    className="py-2 hover:bg-red-800 px-2 rounded"
                  >
                    Wallet
                  </Link>
                  <Link
                    to="/account/orders"
                    className="py-2 hover:bg-red-800 px-2 rounded"
                  >
                    Orders
                  </Link>
                  <Link
                    to="/seller"
                    className="py-2 hover:bg-red-800 px-2 rounded"
                  >
                    Seller Dashboard
                  </Link>
                  <Link
                    to="/help"
                    className="py-2 hover:bg-red-800 px-2 rounded"
                  >
                    Help Center
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="py-2 hover:bg-red-800 px-2 rounded text-left"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/signup"
                    className="py-2 hover:bg-red-800 px-2 rounded"
                  >
                    Sign Up
                  </Link>
                  <Link
                    to="/login"
                    className="py-2 hover:bg-red-800 px-2 rounded"
                  >
                    Log In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
