import { useState } from 'react';
import { ShoppingBag, Tag, Truck, Clock, X } from 'lucide-react';

export default function FlashSalePage() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 5,
    minutes: 23,
    seconds: 45
  });
  
  // Sample flash sale products
  const flashSaleProducts = [
    {
      id: 1,
      name: "Premium Wireless Earbuds",
      originalPrice: 79.99,
      flashPrice: 39.99,
      discount: 50,
      image: "/api/placeholder/300/300",
      sold: 76,
      total: 100,
      rating: 4.7,
      category: "Electronics"
    },
    {
      id: 2,
      name: "Academic Planner 2025",
      originalPrice: 24.99,
      flashPrice: 14.99,
      discount: 40,
      image: "/api/placeholder/300/300",
      sold: 120,
      total: 150,
      rating: 4.5,
      category: "Stationery"
    },
    {
      id: 3,
      name: "Insulated Water Bottle",
      originalPrice: 34.99,
      flashPrice: 19.99,
      discount: 43,
      image: "/api/placeholder/300/300",
      sold: 89,
      total: 120,
      rating: 4.8,
      category: "Accessories"
    },
    {
      id: 4,
      name: "Scientific Calculator",
      originalPrice: 29.99,
      flashPrice: 17.99,
      discount: 40,
      image: "/api/placeholder/300/300",
      sold: 45,
      total: 80,
      rating: 4.6,
      category: "Electronics"
    },
    {
      id: 5,
      name: "Wireless Charging Pad",
      originalPrice: 39.99,
      flashPrice: 19.99,
      discount: 50,
      image: "/api/placeholder/300/300",
      sold: 67,
      total: 100,
      rating: 4.4,
      category: "Electronics"
    },
    {
      id: 6,
      name: "Ergonomic Desk Lamp",
      originalPrice: 49.99,
      flashPrice: 24.99,
      discount: 50,
      image: "/api/placeholder/300/300",
      sold: 38,
      total: 75,
      rating: 4.9,
      category: "Home"
    },
    {
      id: 7,
      name: "USB-C Hub Adapter",
      originalPrice: 45.99,
      flashPrice: 22.99,
      discount: 50,
      image: "/api/placeholder/300/300",
      sold: 52,
      total: 80,
      rating: 4.7,
      category: "Electronics"
    },
    {
      id: 8,
      name: "Portable Bluetooth Speaker",
      originalPrice: 59.99,
      flashPrice: 29.99,
      discount: 50,
      image: "/api/placeholder/300/300",
      sold: 73,
      total: 100,
      rating: 4.6,
      category: "Electronics"
    }
  ];

  const [selectedCategory, setSelectedCategory] = useState('All');
  const categories = ['All', 'Electronics', 'Stationery', 'Accessories', 'Home'];

  const filteredProducts = selectedCategory === 'All' 
    ? flashSaleProducts 
    : flashSaleProducts.filter(product => product.category === selectedCategory);

  return (
    <div className="bg-gray-50 min-h-screen py-6">
      <div className="container mx-auto px-4">
        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-6 md:p-10 flex flex-col md:flex-row items-center">
            <div className="md:w-2/3 text-white">
              <div className="flex items-center mb-4">
                <Clock size={24} className="mr-2" />
                <h2 className="text-xl font-bold">Flash Sale Ends In:</h2>
              </div>
              
              <div className="flex space-x-3 mb-6">
                <div className="bg-white bg-opacity-20 rounded-md px-3 py-2 text-center">
                  <span className="block text-2xl font-bold">{timeLeft.hours}</span>
                  <span className="text-xs">Hours</span>
                </div>
                <div className="bg-white bg-opacity-20 rounded-md px-3 py-2 text-center">
                  <span className="block text-2xl font-bold">{timeLeft.minutes}</span>
                  <span className="text-xs">Minutes</span>
                </div>
                <div className="bg-white bg-opacity-20 rounded-md px-3 py-2 text-center">
                  <span className="block text-2xl font-bold">{timeLeft.seconds}</span>
                  <span className="text-xs">Seconds</span>
                </div>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Student Favorites Flash Sale!</h1>
              <p className="mb-6">Get up to 50% off on college essentials, tech gadgets, and more. Limited stock available!</p>
              
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <div className="flex items-center">
                  <Tag size={16} className="mr-1" />
                  <span>Up to 50% Off</span>
                </div>
                <div className="flex items-center">
                  <Truck size={16} className="mr-1" />
                  <span>Free Shipping</span>
                </div>
                <div className="flex items-center">
                  <ShoppingBag size={16} className="mr-1" />
                  <span>Limited Stock</span>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/3 mt-6 md:mt-0 flex justify-center">
              <img src="/api/placeholder/400/300" alt="Flash Sale Banner" className="rounded-md shadow-lg" />
            </div>
          </div>
        </div>
        
        {/* Category Filters */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex space-x-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full whitespace-nowrap ${
                  selectedCategory === category 
                    ? 'bg-red-600 text-white' 
                    : 'bg-white text-gray-800 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        
        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden transition transform hover:-translate-y-1 hover:shadow-lg">
              <div className="relative">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-0 left-0 bg-red-600 text-white px-2 py-1 text-sm font-bold">
                  {product.discount}% OFF
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 truncate">{product.name}</h3>
                
                <div className="flex items-center mt-2">
                  <span className="text-lg font-bold text-red-600">${product.flashPrice.toFixed(2)}</span>
                  <span className="ml-2 text-sm text-gray-500 line-through">${product.originalPrice.toFixed(2)}</span>
                </div>
                
                <div className="mt-3">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Sold: {product.sold}/{product.total}</span>
                    <span className="text-red-600 font-medium">{Math.round((product.sold/product.total) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-600 h-2 rounded-full" 
                      style={{ width: `${(product.sold/product.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <button className="w-full mt-4 bg-red-600 text-white py-2 rounded-md font-medium hover:bg-red-700 transition">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Flash Sale Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <Clock size={24} className="text-red-600" />
              </div>
              <h3 className="ml-3 text-lg font-semibold">Limited Time Offer</h3>
            </div>
            <p className="text-gray-600">Flash Sale runs for 6 hours only. Get your favorite items before the timer runs out!</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <Tag size={24} className="text-red-600" />
              </div>
              <h3 className="ml-3 text-lg font-semibold">Student Discount</h3>
            </div>
            <p className="text-gray-600">Extra 5% off for verified students. Use your .edu email address at checkout!</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <Truck size={24} className="text-red-600" />
              </div>
              <h3 className="ml-3 text-lg font-semibold">Free Shipping</h3>
            </div>
            <p className="text-gray-600">Free shipping on all flash sale items with no minimum purchase required!</p>
          </div>
        </div>
        
        {/* Newsletter Signup */}
        <div className="mt-12 bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold text-gray-800">Never Miss a Flash Sale!</h3>
              <p className="text-gray-600">Subscribe to get notifications about upcoming Flash Sales and exclusive offers.</p>
            </div>
            
            <div className="w-full md:w-auto">
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your Email Address" 
                  className="flex-1 px-4 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <button className="bg-red-600 text-white px-6 py-2 rounded-r-md hover:bg-red-700 transition">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}