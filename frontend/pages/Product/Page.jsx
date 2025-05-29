import React, { useEffect, useState } from 'react';
import { Heart, Share2, ShoppingCart, Star, Truck, Shield, RotateCcw, Award, Minus, Plus, ChevronLeft, Zap } from 'lucide-react';

function ProductDetailPage() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Extract ID from URL or use default for demo
  const id = window.location.pathname.split('/').pop() || '1';

  useEffect(() => {
    fetch(`http://localhost:6543/api/products/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Product not found');
        return res.json();
      })
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    console.log(`Adding ${quantity} of product ${id} to cart`);
  };

  const handleBuyNow = () => {
    console.log(`Buy now: ${quantity} of product ${id}`);
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  const goHome = () => {
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Image skeleton */}
              <div className="space-y-4">
                <div className="aspect-square bg-white rounded-3xl shadow-lg">
                  <div className="w-full h-full bg-gray-200 rounded-3xl"></div>
                </div>
              </div>
              {/* Content skeleton */}
              <div className="space-y-6">
                <div className="h-8 bg-gray-200 rounded-lg"></div>
                <div className="h-6 bg-gray-200 rounded-lg w-3/4"></div>
                <div className="h-12 bg-gray-200 rounded-lg w-1/2"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-xl p-12 text-center max-w-md mx-4">
          <div className="text-8xl mb-6">🛍️</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Oops!</h2>
          <p className="text-gray-600 mb-8 text-lg">{error}</p>
          <button 
            onClick={goHome}
            className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <ChevronLeft size={20} />
            Back to Shopping
          </button>
        </div>
      </div>
    );
  }

  const discountPercentage = product.original_price && product.original_price > product.price 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const savings = product.original_price && product.original_price > product.price
    ? (product.original_price - product.price).toFixed(2)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <button onClick={goHome} className="hover:text-red-500 transition-colors font-medium">Home</button>
          <span className="text-gray-400">/</span>
          <span className="text-gray-800 font-semibold truncate">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 xl:gap-16">
          {/* Product Image */}
          <div className="space-y-6">
            <div className="relative group">
              <div className="aspect-square bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">
                <img 
                  src={product.image_url || product.image || '/api/placeholder/600/600'} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {discountPercentage > 0 && (
                  <div className="absolute top-6 left-6">
                    <div className="bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                      -{discountPercentage}%
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                {product.name}
              </h1>
              
              {/* Rating & Social Proof */}
              <div className="flex items-center gap-6 flex-wrap">
                {product.rating && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={`${
                            i < Math.floor(product.rating) 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-semibold text-gray-800">{product.rating}</span>
                    {product.reviews_count && (
                      <span className="text-gray-500">({product.reviews_count.toLocaleString()} reviews)</span>
                    )}
                  </div>
                )}
                {product.sold && (
                  <div className="flex items-center gap-2 text-green-600 font-medium">
                    <Zap size={16} />
                    <span>{product.sold.toLocaleString()} sold</span>
                  </div>
                )}
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-3">
              <div className="flex items-baseline gap-4">
                <span className="text-5xl font-bold text-red-500">
                  ${parseFloat(product.price).toFixed(2)}
                </span>
                {product.original_price && product.original_price > product.price && (
                  <span className="text-2xl text-gray-400 line-through font-medium">
                    ${parseFloat(product.original_price).toFixed(2)}
                  </span>
                )}
              </div>
              {savings > 0 && (
                <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold">
                  <Award size={16} />
                  You save ${savings}
                </div>
              )}
            </div>

            {/* Seller Info */}
            {product.seller && (
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="font-bold text-gray-800 text-lg">{product.seller}</h3>
                    <p className="text-gray-600">Official Store</p>
                  </div>
                  <button className="border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-6 py-2 rounded-xl font-semibold transition-all duration-200">
                    Follow
                  </button>
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800 text-lg">Quantity</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-white rounded-2xl border-2 border-gray-200 overflow-hidden shadow-sm">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <Minus size={18} />
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 h-12 text-center border-0 focus:outline-none font-semibold text-lg"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                <span className="text-gray-600 font-medium">
                  {product.stock ? `${product.stock} in stock` : 'In stock'}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleAddToCart}
                  className="flex items-center justify-center gap-3 border-2 border-red-500 text-red-500 hover:bg-red-50 py-4 rounded-2xl font-bold text-lg transition-all duration-200 transform hover:scale-105"
                >
                  <ShoppingCart size={20} />
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="bg-red-500 hover:bg-red-600 text-white py-4 rounded-2xl font-bold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Buy Now
                </button>
              </div>
              
              {/* Secondary Actions */}
              <div className="flex justify-center gap-8">
                <button 
                  onClick={toggleWishlist}
                  className={`flex items-center gap-2 font-medium transition-colors ${
                    isWishlisted ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
                  }`}
                >
                  <Heart size={20} className={isWishlisted ? 'fill-current' : ''} />
                  {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
                </button>
                <button className="flex items-center gap-2 text-gray-600 hover:text-red-500 font-medium transition-colors">
                  <Share2 size={20} />
                  Share
                </button>
              </div>
            </div>

            {/* Services */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <h3 className="font-bold text-gray-800 text-lg mb-4">What's Included</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Truck className="text-green-600" size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Free Shipping</p>
                    <p className="text-sm text-gray-600">On orders over $50</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <RotateCcw className="text-blue-600" size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Easy Returns</p>
                    <p className="text-sm text-gray-600">14-day return policy</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Shield className="text-purple-600" size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Warranty</p>
                    <p className="text-sm text-gray-600">1-year coverage</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <Award className="text-orange-600" size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Authentic</p>
                    <p className="text-sm text-gray-600">100% genuine</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description */}
        {product.description && (
          <div className="mt-16">
            <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">About This Product</h2>
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                <p>{product.description}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetailPage;