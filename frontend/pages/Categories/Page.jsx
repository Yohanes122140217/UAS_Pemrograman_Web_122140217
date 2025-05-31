import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';
import { SectionContainer, Badge } from '../../components/UIComponents';

function CategoriesPage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialCategory = searchParams.get('cat') || 'all';
  
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState('popularity');
  const [showFilters, setShowFilters] = useState(false);

  // Mock data for categories
  const categories = [
    { id: 'all', name: "All Categories" },
    { id: 'electronics', name: "Electronics" },
    { id: 'school-supplies', name: "School Supplies" },
    { id: 'dorm-essentials', name: "Dorm Essentials" },
    { id: 'clothing', name: "Clothing" },
    { id: 'sports', name: "Sports & Fitness" },
    { id: 'food', name: "Food & Snacks" },
    { id: 'beauty', name: "Health & Beauty" },
    { id: 'entertainment', name: "Entertainment" },
    { id: 'gift-cards', name: "Gift Cards" },
    { id: 'textbooks', name: "Textbooks" },
  ];

  // Mock data for products
  const allProducts = [
    {
      id: 1,
      name: "Wireless Noise Cancelling Headphones",
      price: 149.99,
      originalPrice: 199.99,
      rating: 4.7,
      sold: 1250,
      image: "/api/placeholder/300/300",
      category: "electronics"
    },
    {
      id: 2,
      name: "College Essential Backpack with USB Port",
      price: 49.99,
      originalPrice: 79.99,
      rating: 4.5,
      sold: 823,
      image: "/api/placeholder/300/300",
      category: "school-supplies"
    },
    {
      id: 3,
      name: "Study Desk Lamp with Wireless Charger",
      price: 34.99,
      originalPrice: 44.99,
      rating: 4.3,
      sold: 628,
      image: "/api/placeholder/300/300",
      category: "dorm-essentials"
    },
    {
      id: 4,
      name: "MacBook Pro 13-inch M1 Chip",
      price: 1199.99,
      rating: 4.9,
      sold: 456,
      image: "/api/placeholder/300/300",
      category: "electronics"
    },
    {
      id: 5,
      name: "Bluetooth Mini Speaker",
      price: 19.99,
      originalPrice: 39.99,
      rating: 4.2,
      sold: 1802,
      image: "/api/placeholder/300/300",
      category: "electronics"
    },
    {
      id: 6,
      name: "College Dorm Room Bedding Set",
      price: 39.99,
      originalPrice: 69.99,
      rating: 4.4,
      sold: 342,
      image: "/api/placeholder/300/300",
      category: "dorm-essentials"
    },
    {
      id: 7,
      name: "Scientific Calculator",
      price: 14.99,
      originalPrice: 24.99,
      rating: 4.8,
      sold: 1205,
      image: "/api/placeholder/300/300",
      category: "school-supplies"
    },
    {
      id: 8,
      name: "Water Bottle with Time Markers",
      price: 9.99,
      originalPrice: 17.99,
      rating: 4.6,
      sold: 2340,
      image: "/api/placeholder/300/300",
      category: "dorm-essentials"
    },
    {
      id: 9,
      name: "Campus Hoodie",
      price: 34.99,
      originalPrice: 44.99,
      rating: 4.5,
      sold: 987,
      image: "/api/placeholder/300/300",
      category: "clothing"
    },
    {
      id: 10,
      name: "Wireless Mouse",
      price: 24.99,
      originalPrice: 29.99,
      rating: 4.3,
      sold: 1245,
      image: "/api/placeholder/300/300",
      category: "electronics"
    },
    {
      id: 11,
      name: "Basketball",
      price: 29.99,
      rating: 4.7,
      sold: 534,
      image: "/api/placeholder/300/300",
      category: "sports"
    },
    {
      id: 12,
      name: "Introduction to Psychology Textbook",
      price: 79.99,
      originalPrice: 120.99,
      rating: 4.4,
      sold: 321,
      image: "/api/placeholder/300/300",
      category: "textbooks"
    },
  ];

  // Filter products based on active category
  const filteredProducts = allProducts.filter(product => {
    if (activeCategory !== 'all' && product.category !== activeCategory) return false;
    if (product.price < priceRange[0] || product.price > priceRange[1]) return false;
    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'popularity':
      default:
        return b.sold - a.sold;
    }
  });

  // Update URL when active category changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (activeCategory === 'all') {
      params.delete('cat');
    } else {
      params.set('cat', activeCategory);
    }
    
    // Update URL without causing a navigation
    const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    window.history.replaceState({}, '', newUrl);
  }, [activeCategory, location.search]);
  
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Shop by Category</h1>
      
      {/* Category Tabs */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex space-x-2 min-w-max pb-2">
          {categories.map(category => (
            <button
              key={category.id}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                activeCategory === category.id 
                  ? 'bg-red-600 text-white' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters - Desktop */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="font-bold text-lg mb-4">Filters</h2>
            
            {/* Price Range Filter */}
            <div className="mb-4">
              <h3 className="font-medium text-sm mb-2">Price Range</h3>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm">${priceRange[0]}</span>
                <span className="text-gray-600 text-sm">${priceRange[1]}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1000"
                step="10"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="w-full accent-red-600"
              />
            </div>
            
            {/* Rating Filter */}
            <div className="mb-4">
              <h3 className="font-medium text-sm mb-2">Rating</h3>
              {[4, 3, 2, 1].map(rating => (
                <label key={rating} className="flex items-center space-x-2 mb-1">
                  <input type="checkbox" className="accent-red-600" />
                  <div className="flex text-yellow-400">
                    {[...Array(rating)].map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                    {[...Array(5 - rating)].map((_, i) => (
                      <span key={i} className="text-gray-300">★</span>
                    ))}
                  </div>
                  <span className="text-gray-600 text-sm">& up</span>
                </label>
              ))}
            </div>
            
            {/* Discount Filter */}
            <div>
              <h3 className="font-medium text-sm mb-2">Discounts</h3>
              <label className="flex items-center space-x-2 mb-1">
                <input type="checkbox" className="accent-red-600" />
                <span className="text-gray-600 text-sm">On Sale</span>
              </label>
            </div>
          </div>
        </div>
        
        {/* Products Section */}
        <div className="flex-1">
          {/* Sort and Filter Controls */}
          <div className="flex justify-between items-center mb-4">
            <button 
              className="lg:hidden px-4 py-2 border border-gray-300 rounded flex items-center text-sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <span className="mr-2">Filter</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </button>
            
            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-2">Sort by:</span>
              <select 
                className="border border-gray-300 rounded px-2 py-1 text-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="popularity">Popularity</option>
                <option value="rating">Rating</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
          
          {/* Mobile Filters */}
          {showFilters && (
            <div className="lg:hidden bg-white p-4 rounded-lg shadow mb-4">
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-bold">Filters</h2>
                <button onClick={() => setShowFilters(false)}>✕</button>
              </div>
              
              {/* Price Range Filter */}
              <div className="mb-4">
                <h3 className="font-medium text-sm mb-2">Price Range</h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 text-sm">${priceRange[0]}</span>
                  <span className="text-gray-600 text-sm">${priceRange[1]}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="10"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full accent-red-600"
                />
              </div>
              
              {/* Mobile Filter Controls */}
              <div className="flex justify-end space-x-2 mt-4">
                <button className="px-3 py-1 border border-gray-300 rounded text-sm">Reset</button>
                <button 
                  className="px-3 py-1 bg-red-600 text-white rounded text-sm"
                  onClick={() => setShowFilters(false)}
                >
                  Apply
                </button>
              </div>
            </div>
          )}
          
          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sortedProducts.map(product => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
          
          {/* Empty State */}
          {sortedProducts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">😕</div>
              <h3 className="text-xl font-medium mb-2">No products found</h3>
              <p className="text-gray-600">Try adjusting your filters or browse a different category.</p>
            </div>
          )}
          
          {/* Pagination */}
          {sortedProducts.length > 0 && (
            <div className="flex justify-center mt-8">
              <div className="flex space-x-1">
                <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100">
                  &lt;
                </button>
                <button className="px-3 py-1 bg-red-600 text-white rounded">1</button>
                <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100">2</button>
                <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100">3</button>
                <span className="px-3 py-1">...</span>
                <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100">
                  &gt;
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CategoriesPage;