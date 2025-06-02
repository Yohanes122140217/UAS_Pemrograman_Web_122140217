// src/pages/Search/Page.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../../components/ProductCard'; // Adjust path if needed

const API_BASE_URL = 'http://localhost:6543'; // Your backend URL

function SearchPage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q') || '';

  const [fetchedProducts, setFetchedProducts] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1200]);
  const [sortBy, setSortBy] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSearchResults = useCallback(async (searchQuery) => {
    if (!searchQuery) {
      setFetchedProducts([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/search/products?q=${encodeURIComponent(searchQuery)}`);
      
      if (!response.ok) {
        let errorMsg = `Search request failed (status ${response.status})`;
        const contentType = response.headers.get("content-type");

        if (contentType && contentType.indexOf("application/json") !== -1) {
          try {
              const errorData = await response.json();
              errorMsg = errorData.error || errorData.errors?.general || JSON.stringify(errorData);
          } catch (jsonParseError) {
              console.error("[SearchPage] Failed to parse JSON error response:", jsonParseError);
              errorMsg = `Server error (status ${response.status}), but error details could not be parsed.`;
          }
        } else {
          try {
              const textError = await response.text();
              console.error("[SearchPage] Non-JSON error response from server (Search):", textError);
              errorMsg = `Server returned ${response.status}. Response: ${textError.substring(0,200)}...`;
          } catch (textParseError) {
              console.error("[SearchPage] Failed to get text from error response:", textParseError);
              errorMsg = `Server error (status ${response.status}) with non-JSON, unreadable response.`;
          }
        }
        throw new Error(errorMsg);
      }

      const data = await response.json();
      setFetchedProducts(data || []);
      console.log(`[SearchPage] Fetched ${data?.length || 0} products for query "${searchQuery}":`, data);
    } catch (err) {
      console.error("[SearchPage] Error fetching search results:", err);
      setError(err.message);
      setFetchedProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSearchResults(query);
  }, [query, fetchSearchResults]);

  const processedProducts = useMemo(() => {
    if (!fetchedProducts) return [];

    let filtered = fetchedProducts.filter(product => {
      // Ensure product and product.price exist before parsing
      if (!product || typeof product.price === 'undefined' || product.price === null) return false; 
      const price = parseFloat(product.price);
      if (isNaN(price)) return false;
      if (price < priceRange[0] || price > priceRange[1]) return false;
      return true;
    });

    return [...filtered].sort((a, b) => {
      const aPrice = parseFloat(a.price);
      const bPrice = parseFloat(b.price);
      const aRating = parseFloat(a.rating) || 0;
      const bRating = parseFloat(b.rating) || 0;
      const aSold = parseInt(a.sold, 10) || 0;
      const bSold = parseInt(b.sold, 10) || 0;

      switch (sortBy) {
        case 'price-low':
          return aPrice - bPrice;
        case 'price-high':
          return bPrice - aPrice;
        case 'rating':
          return bRating - aRating;
        case 'popularity':
          return bSold - aSold;
        case 'relevance':
        default:
          return bSold - aSold; 
      }
    });
  }, [fetchedProducts, priceRange, sortBy]);
  
  return (
    <div className="container mx-auto px-4 py-6">
      {query ? (
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Search Results for: <span className="text-red-600">"{query}"</span>
        </h1>
      ) : (
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Please enter a search term to find products</h1>
      )}

      {error && !isLoading && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters - Desktop */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="font-bold text-lg mb-4">Refine Results</h2>
            
            <div className="mb-4">
              <h3 className="font-medium text-sm mb-2">Price Range</h3>
              <div className="flex items-center justify-between mb-1">
                <span className="text-gray-600 text-xs">Min: ${priceRange[0]}</span>
              </div>
              <input
                type="range" min="0" max="1200" step="10" 
                value={priceRange[0]}
                onChange={(e) => {
                    const newMin = parseInt(e.target.value, 10);
                    setPriceRange(current => [newMin, Math.max(newMin, current[1])]);
                }}
                className="w-full accent-red-600 mb-2"
                disabled={isLoading || !query || fetchedProducts.length === 0}
              />
              <div className="flex items-center justify-between mb-1">
                 <span className="text-gray-600 text-xs">Max: ${priceRange[1]}</span>
              </div>
              <input
                type="range" min="0" max="1200" step="10" 
                value={priceRange[1]}
                onChange={(e) => {
                    const newMax = parseInt(e.target.value, 10);
                    setPriceRange(current => [Math.min(newMax, current[0]), newMax]);
                }}
                className="w-full accent-red-600"
                disabled={isLoading || !query || fetchedProducts.length === 0}
              />
            </div>
            
            <div className="mb-4"> 
              <h3 className="font-medium text-sm mb-2">Rating (TODO)</h3>
              {[4, 3, 2, 1].map(rating => (
                <label key={rating} className="flex items-center space-x-2 mb-1 opacity-50 cursor-not-allowed">
                  <input type="checkbox" className="accent-red-600" disabled /> 
                  <div className="flex text-yellow-400">
                    {[...Array(rating)].map((_, i) => (<span key={i}>★</span>))}
                    {[...Array(5 - rating)].map((_, i) => (<span key={i} className="text-gray-300">★</span>))}
                  </div>
                  <span className="text-gray-600 text-sm">& up</span>
                </label>
              ))}
            </div>
            
            <div> 
              <h3 className="font-medium text-sm mb-2">Discounts (TODO)</h3>
              <label className="flex items-center space-x-2 mb-1 opacity-50 cursor-not-allowed">
                <input type="checkbox" className="accent-red-600" disabled /> 
                <span className="text-gray-600 text-sm">On Sale</span>
              </label>
            </div>
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-center mb-4">
            <button 
              className="lg:hidden px-4 py-2 border border-gray-300 rounded flex items-center text-sm"
              onClick={() => setShowFilters(!showFilters)}
              disabled={!query || (fetchedProducts.length === 0 && !isLoading)}
            >
              <span className="mr-2">Filter</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </button>
            
            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-2">Sort by:</span>
              <select 
                className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-red-500 focus:border-red-500"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                disabled={isLoading || !query || fetchedProducts.length === 0}
              >
                <option value="relevance">Relevance</option>
                <option value="popularity">Popularity</option>
                <option value="rating">Rating</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
          
          {showFilters && (
            <div className="lg:hidden bg-white p-4 rounded-lg shadow mb-4">
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-bold">Filters</h2>
                <button onClick={() => setShowFilters(false)}>✕</button>
              </div>
              
              <div className="mb-4">
                <h3 className="font-medium text-sm mb-2">Price Range</h3>
                <div className="flex items-center justify-between mb-1"><span className="text-gray-600 text-xs">Min: ${priceRange[0]}</span></div>
                <input type="range" min="0" max="1200" step="10" value={priceRange[0]} onChange={(e) => {const newMin = parseInt(e.target.value, 10); setPriceRange(current => [newMin, Math.max(newMin, current[1])]);}} className="w-full accent-red-600 mb-2"/>
                <div className="flex items-center justify-between mb-1"><span className="text-gray-600 text-xs">Max: ${priceRange[1]}</span></div>
                <input type="range" min="0" max="1200" step="10" value={priceRange[1]} onChange={(e) => {const newMax = parseInt(e.target.value, 10); setPriceRange(current => [Math.min(newMax, current[0]), newMax]);}} className="w-full accent-red-600"/>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button 
                    onClick={() => {setPriceRange([0,1200]); /* TODO: Reset other filters */}} 
                    className="px-3 py-1 border border-gray-300 rounded text-sm">Reset</button>
                <button 
                  className="px-3 py-1 bg-red-600 text-white rounded text-sm"
                  onClick={() => setShowFilters(false)}
                >
                  Apply
                </button>
              </div>
            </div>
          )}
          
          {isLoading ? (
            <div className="text-center py-12"><p className="text-gray-600">Searching for products...</p></div>
          ) : processedProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {/* THIS IS THE IMPORTANT CHANGE FOR ProductCard */}
              {processedProducts.map(product => (
                <ProductCard key={product.id} {...product} /> 
              ))}
            </div>
          ) : (
             query && !isLoading && !error && ( 
              <div className="text-center py-12">
                <div className="text-5xl mb-4">😕</div>
                <h3 className="text-xl font-medium mb-2">No products found for "{query}"</h3>
                <p className="text-gray-600">Try a different search term or adjust your filters.</p>
              </div>
            )
          )}
          {!query && !isLoading && !error && (
            <div className="text-center py-12">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-xl font-medium mb-2">Start Searching</h3>
                <p className="text-gray-600">Enter a keyword in the search bar above to find products.</p>
            </div>
          )}
          
          {processedProducts.length > 0 && (
            <div className="flex justify-center mt-8">
              <div className="flex space-x-1 opacity-50"> 
                <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100" disabled>&lt;</button>
                <button className="px-3 py-1 bg-red-600 text-white rounded" disabled>1</button>
                <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100" disabled>&gt;</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchPage;