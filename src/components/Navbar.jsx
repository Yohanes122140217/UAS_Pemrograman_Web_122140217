import { useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <nav className="bg-red-600 text-white shadow-md sticky top-0 z-50">
      {/* Main navbar */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold flex items-center">
            <span className="mr-2">🛒</span>
            <span>Sellit.</span>
          </Link>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 mx-6 bg-w">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                className="bg-white w-full py-2 px-4 rounded-lg text-gray-800 focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="absolute right-0 top-0 h-full px-4 bg-red-500 rounded-r-lg hover:bg-red-700 transition">
                <span>🔍</span>
              </button>
            </div>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/categories" className="hover:text-red-200 transition">Categories</Link>
            <Link to="/flash-sale" className="hover:text-red-200 transition">Flash Sale</Link>
            <Link to="/cart" className="relative hover:text-red-200 transition">
              Cart
              <span className="absolute -top-2 -right-2 bg-white text-red-600 rounded-full w-5 h-5 flex items-center justify-center text-xs">3</span>
            </Link>
            <div className="border-l border-red-400 h-6"></div>
            <div className="flex items-center">
              {/* <img 
              {/* <img 
                src="/api/placeholder/32/32" 
                alt="User" 
                className="w-8 h-8 rounded-full mr-2"
              /> */}
              <div className="group relative">
                <button className="flex items-center" >
                  My Account <span className="ml-1">▼</span>
                </button>
                <div className="absolute right-0 top-full w-48 bg-white rounded-md shadow-lg py-1
                opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto
                transition-opacity duration-200 text-gray-800">
                  <Link to="/account/wallet" className="block px-4 py-2 hover:bg-red-100">Wallet</Link>
                  <Link to="/account/orders" className="block px-4 py-2 hover:bg-red-100">Orders</Link>
                  <Link to="/seller" className="block px-4 py-2 hover:bg-red-100">Seller Dashboard</Link>
                  <div className="border-t border-gray-200"></div>
                  <Link to="/help" className="block px-4 py-2 hover:bg-red-100">Help Center</Link>
                  <Link to="/signup" className="block px-4 py-2 hover:bg-red-100">Sign Up</Link>
                  <Link to="/login" className="block px-4 py-2 hover:bg-red-100">Login</Link>
                  <Link to="/register" className="block px-4 py-2 hover:bg-red-100">Sign Up</Link>
                  <button className="block w-full text-left px-4 py-2 hover:bg-red-100">Log Out</button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Search Bar - Mobile Only */}
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
              <span>🔍</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-red-700 py-3">
          <div className="container mx-auto px-4">
            <div className="flex flex-col">
              <Link to="/categories" className="py-2 hover:bg-red-800 px-2 rounded">Categories</Link>
              <Link to="/flash-sale" className="py-2 hover:bg-red-800 px-2 rounded">Flash Sale</Link>
              <Link to="/cart" className="py-2 hover:bg-red-800 px-2 rounded flex justify-between">
                Cart <span className="bg-white text-red-600 rounded-full w-5 h-5 flex items-center justify-center text-xs">3</span>
              </Link>
              <Link to="/account/wallet" className="py-2 hover:bg-red-800 px-2 rounded">Wallet</Link>
              <Link to="/account/orders" className="py-2 hover:bg-red-800 px-2 rounded">Orders</Link>
              <Link to="/seller" className="py-2 hover:bg-red-800 px-2 rounded">Seller Dashboard</Link>
              <Link to="/help" className="py-2 hover:bg-red-800 px-2 rounded">Help Center</Link>
              <button className="py-2 hover:bg-red-800 px-2 rounded text-left">Log Out</button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;