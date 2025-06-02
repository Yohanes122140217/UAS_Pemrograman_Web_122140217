// src/pages/Product/Page.jsx
import React, { useEffect, useState } from 'react';
import { Heart, Share2, ShoppingCart, Star, Truck, Shield, RotateCcw, Award, Minus, Plus, ChevronLeft, Zap } from 'lucide-react';

function ProductDetailPage() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loggedInUsername, setLoggedInUsername] = useState(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState({ type: '', text: '' }); // For API feedback

  const id = window.location.pathname.split('/').pop() || '1';

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:6543/api/products/${id}`)
      .then(res => {
        if (!res.ok) {
          if (res.status === 404) throw new Error('Product not found.');
          throw new Error('Could not fetch product details. Please try again later.');
        }
        return res.json();
      })
      .then(data => {
        console.log('[ProductDetailPage] Fetched product data:', data);
        setProduct(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    const usernameFromStorage = localStorage.getItem('username');
    console.log('[ProductDetailPage] Username from localStorage:', usernameFromStorage);
    if (usernameFromStorage) {
      setLoggedInUsername(usernameFromStorage);
    } else {
      setLoggedInUsername(null);
    }
  }, []);

  const handleAddToCart = async () => {
    if (!product || isAddingToCart || (product.stock !== null && product.stock !== undefined && product.stock === 0)) return;

    setIsAddingToCart(true);
    setFeedbackMessage({ type: '', text: '' }); 

    const token = localStorage.getItem('token');
    if (!token) {
      setFeedbackMessage({ type: 'error', text: 'You must be logged in to add items to the cart.' });
      setIsAddingToCart(false);
      return;
    }

    try {
      // CORRECTED URL: Point to your backend server (e.g., on port 6543)
      const response = await fetch('http://localhost:6543/api/cart/items', { // [MODIFIED URL]
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: product.id,
          quantity: quantity,
        }),
      });

      if (!response.ok) {
        let errorPayload = { message: `Request failed with status ${response.status}` };
        try {
          const errorData = await response.json();
          errorPayload.message = errorData.error || errorData.errors?.general || JSON.stringify(errorData);
        } catch (e) {
          const textError = await response.text();
          console.error("Non-JSON error response from server (Add to Cart):", textError);
          errorPayload.message = `Server returned ${response.status}. Response: ${textError.substring(0, 200)}...`;
        }
        setFeedbackMessage({ type: 'error', text: errorPayload.message });
      } else {
        const responseData = await response.json();
        setFeedbackMessage({ type: 'success', text: `${quantity} x "${product.name}" added to your cart!` });
        console.log('Cart updated:', responseData);
      }
    } catch (err) {
      console.error("Error adding item to cart:", err);
      setFeedbackMessage({ type: 'error', text: 'An unexpected network error occurred. Please try again.' });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!product || (product.stock !== null && product.stock !== undefined && product.stock === 0)) return;
    
    setIsAddingToCart(true); 
    setFeedbackMessage({ type: '', text: '' });
    const token = localStorage.getItem('token');

    if (!token) {
      setFeedbackMessage({ type: 'error', text: 'Please log in to make a purchase.' });
      setIsAddingToCart(false);
      return;
    }

    try {
      // CORRECTED URL: Point to your backend server (e.g., on port 6543)
      const response = await fetch('http://localhost:6543/api/cart/items', { // [MODIFIED URL]
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id: product.id, quantity: quantity }),
      });

      if (response.ok) {
        // const responseData = await response.json(); // Optional: log or use
        // console.log('Item added before Buy Now, cart state:', responseData);
        window.location.href = '/checkout'; 
      } else {
        let errorPayload = { message: `Failed to prepare for Buy Now (status ${response.status})` };
        try {
            const errorData = await response.json();
            errorPayload.message = errorData.error || errorData.errors?.general || JSON.stringify(errorData);
        } catch (e) {
            const textError = await response.text();
            console.error("Non-JSON error response from server (Buy Now):", textError);
            errorPayload.message = `Server returned ${response.status}. Response: ${textError.substring(0,200)}...`;
        }
        setFeedbackMessage({ type: 'error', text: errorPayload.message });
      }
    } catch (err) {
      console.error("Error during Buy Now:", err);
      setFeedbackMessage({ type: 'error', text: 'An error occurred processing Buy Now. Please try again.' });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const toggleWishlist = () => setIsWishlisted(!isWishlisted);
  const goHome = () => window.location.href = '/';

  if (loading) {
    return ( <div className="min-h-screen flex justify-center items-center"><p>Loading product details...</p></div>);
  }
  if (error) {
    return ( <div className="min-h-screen flex flex-col justify-center items-center"><p className="text-red-500">Error: {error}</p><button onClick={goHome} className="mt-4 bg-red-500 text-white py-2 px-4 rounded">Go Home</button></div>);
  }
  if (!product) {
    return ( <div className="min-h-screen flex justify-center items-center"><p>Product not found.</p></div>);
  }

  console.log('[ProductDetailPage] Render - loggedInUsername:', loggedInUsername);
  console.log('[ProductDetailPage] Render - product.seller:', product.seller);
  if (loggedInUsername && product.seller) {
    console.log('[ProductDetailPage] Render - Basic Comparison (loggedInUsername !== product.seller):', loggedInUsername !== product.seller);
  }

  const discountPercentage = product.original_price && parseFloat(product.original_price) > parseFloat(product.price)
    ? Math.round(((parseFloat(product.original_price) - parseFloat(product.price)) / parseFloat(product.original_price)) * 100)
    : 0;
  const savings = product.original_price && parseFloat(product.original_price) > parseFloat(product.price)
    ? (parseFloat(product.original_price) - parseFloat(product.price)).toFixed(2)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <button onClick={goHome} className="hover:text-red-500 transition-colors font-medium">Home</button>
          <span className="text-gray-400">/</span>
          <span className="text-gray-800 font-semibold truncate">{product.name}</span>
        </nav>

        {feedbackMessage.text && (
          <div className={`p-4 mb-4 rounded-md text-center ${feedbackMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {feedbackMessage.text}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-12 xl:gap-16">
          <div className="space-y-6"> 
            <div className="relative group">
              <div className="aspect-square bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">
                <img src={product.image_url || product.image || '/api/placeholder/600/600'} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"/>
                {discountPercentage > 0 && (
                  <div className="absolute top-6 left-6"><div className="bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">-{discountPercentage}%</div></div>
                )}
              </div>
            </div>
          </div>
          
          <div className="space-y-8"> 
            <div className="space-y-4"> 
              <h1 className="text-4xl font-bold text-gray-900 leading-tight">{product.name}</h1>
              <div className="flex items-center gap-6 flex-wrap"> 
                {product.rating && ( <div className="flex items-center gap-2"><div className="flex items-center">{[...Array(5)].map((_, i) => (<Star key={i} size={16} className={`${ i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300' }`} />))}</div><span className="font-semibold text-gray-800">{parseFloat(product.rating).toFixed(1)}</span>{product.reviews_count && (<span className="text-gray-500">({product.reviews_count.toLocaleString()} reviews)</span>)}</div>)}
                {typeof product.sold !== 'undefined' && product.sold !== null && (<div className="flex items-center gap-2 text-green-600 font-medium"><Zap size={16} /><span>{product.sold.toLocaleString()} sold</span></div>)}
              </div>
            </div>
            <div className="space-y-3"> 
              <div className="flex items-baseline gap-4"><span className="text-5xl font-bold text-red-500">${parseFloat(product.price).toFixed(2)}</span>{product.original_price && parseFloat(product.original_price) > parseFloat(product.price) && (<span className="text-2xl text-gray-400 line-through font-medium">${parseFloat(product.original_price).toFixed(2)}</span>)}</div>
              {savings > 0 && (<div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold"><Award size={16} /> You save ${savings}</div>)}
            </div>

            {product.seller && (
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="font-bold text-gray-800 text-lg">{typeof product.seller === 'object' && product.seller !== null ? product.seller.name : product.seller}</h3>
                    <p className="text-gray-600">Official Store</p>
                  </div>
                  {loggedInUsername && (typeof product.seller === 'string' ? loggedInUsername !== product.seller : loggedInUsername !== product.seller?.name) && (
                    <button className="border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-6 py-2 rounded-xl font-semibold transition-all duration-200">
                      Follow
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-4"> 
              <h3 className="font-semibold text-gray-800 text-lg">Quantity</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-white rounded-2xl border-2 border-gray-200 overflow-hidden shadow-sm">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-12 flex items-center justify-center hover:bg-gray-50 transition-colors" aria-label="Decrease quantity"><Minus size={18}/></button>
                  <input 
                    type="number" 
                    min="1" 
                    max={product.stock === null || product.stock === undefined ? undefined : product.stock} // Allow undefined max if stock is null/undefined
                    value={quantity} 
                    onChange={(e) => { 
                      const val = parseInt(e.target.value) || 1; 
                      const maxStock = (product.stock === null || product.stock === undefined) ? Infinity : product.stock;
                      setQuantity(Math.max(1, Math.min(val, maxStock)));
                    }} 
                    className="w-16 h-12 text-center border-0 focus:ring-0 focus:outline-none font-semibold text-lg appearance-none [-moz-appearance:textfield]" 
                    aria-label="Current quantity"
                  />
                  <button 
                    onClick={() => {
                        const maxStock = (product.stock === null || product.stock === undefined) ? Infinity : product.stock;
                        setQuantity(prev => Math.min(prev + 1, maxStock))
                    }} 
                    className="w-12 h-12 flex items-center justify-center hover:bg-gray-50 transition-colors" 
                    aria-label="Increase quantity"
                   ><Plus size={18}/></button>
                </div>
                <span className="text-gray-600 font-medium">{
                  (product.stock !== null && product.stock !== undefined) 
                    ? (product.stock > 0 ? `${product.stock} in stock` : 'Out of stock') 
                    : 'In stock'
                }</span>
              </div>
            </div>
            <div className="space-y-4"> 
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button 
                  onClick={handleAddToCart} 
                  disabled={isAddingToCart || (product.stock !== null && product.stock !== undefined && product.stock === 0)} 
                  className={`flex items-center justify-center gap-3 border-2 border-red-500 text-red-500 hover:bg-red-50 py-4 rounded-2xl font-bold text-lg transition-all duration-200 transform hover:scale-105 ${isAddingToCart || (product.stock !== null && product.stock !== undefined && product.stock === 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <ShoppingCart size={20}/> {isAddingToCart ? 'Adding...' : ((product.stock !== null && product.stock !== undefined && product.stock === 0) ? 'Out of Stock' : 'Add to Cart')}
                </button>
                <button 
                  onClick={handleBuyNow} 
                  disabled={isAddingToCart || (product.stock !== null && product.stock !== undefined && product.stock === 0)} 
                  className={`bg-red-500 hover:bg-red-600 text-white py-4 rounded-2xl font-bold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl ${isAddingToCart || (product.stock !== null && product.stock !== undefined && product.stock === 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Buy Now
                </button>
              </div>
              <div className="flex justify-center gap-8 pt-2"> 
                <button onClick={toggleWishlist} className={`flex items-center gap-2 font-medium transition-colors ${isWishlisted ? 'text-red-500' : 'text-gray-600 hover:text-red-500'}`}><Heart size={20} className={isWishlisted ? 'fill-current' : ''}/>{isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}</button>
                <button className="flex items-center gap-2 text-gray-600 hover:text-red-500 font-medium transition-colors"><Share2 size={20}/>Share</button>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <h3 className="font-bold text-gray-800 text-lg mb-4">What's Included</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                <div className="flex items-center gap-3"><div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0"><Truck className="text-green-600" size={18}/></div><div><p className="font-semibold text-gray-800">Free Shipping</p><p className="text-sm text-gray-600">On orders over $50</p></div></div>
                <div className="flex items-center gap-3"><div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0"><RotateCcw className="text-blue-600" size={18}/></div><div><p className="font-semibold text-gray-800">Easy Returns</p><p className="text-sm text-gray-600">14-day return policy</p></div></div>
                <div className="flex items-center gap-3"><div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center shrink-0"><Shield className="text-purple-600" size={18}/></div><div><p className="font-semibold text-gray-800">Warranty</p><p className="text-sm text-gray-600">1-year coverage</p></div></div>
                <div className="flex items-center gap-3"><div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center shrink-0"><Award className="text-orange-600" size={18}/></div><div><p className="font-semibold text-gray-800">Authentic</p><p className="text-sm text-gray-600">100% genuine</p></div></div>
              </div>
            </div>
          </div>
        </div>
        {product.description && (
          <div className="mt-16"><div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-8 sm:p-10"><h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">About This Product</h2><div className="prose prose-lg max-w-none text-gray-700 leading-relaxed"><p>{product.description}</p></div></div></div>
        )}
      </div>
    </div>
  );
}

export default ProductDetailPage;