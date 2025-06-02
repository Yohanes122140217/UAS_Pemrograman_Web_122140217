// src/pages/Cart/Page.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Trash2, Heart, ShoppingBag, Tag, CreditCard, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

// Define your backend API base URL
const API_BASE_URL = 'http://localhost:6543'; // Adjust if your backend port is different

export default function CartPage() {
  const [cart, setCart] = useState(null); // Will hold the full cart object from API
  const [cartItems, setCartItems] = useState([]); // Derived from cart.items
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0); // This is a percentage

  const fetchCartData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const token = localStorage.getItem('token');
    if (!token) {
      setError("Please log in to view your cart.");
      setIsLoading(false);
      setCartItems([]);
      setCart(null);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/cart`, { // [MODIFIED URL]
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        let errorPayload = { message: `Failed to fetch cart (status: ${response.status})` };
        try {
          const errData = await response.json();
          errorPayload.message = errData.error || JSON.stringify(errData);
        } catch (e) {
          const textError = await response.text();
          console.error("[CartPage] Non-JSON error response from server (fetchCartData):", textError);
          errorPayload.message = `Server returned ${response.status}. Response: ${textError.substring(0,200)}...`;
        }
        throw new Error(errorPayload.message);
      }

      const cartData = await response.json();
      setCart(cartData);
      setCartItems(cartData.items || []);
      console.log("[CartPage] Cart data fetched from API:", cartData);
    } catch (err) {
      console.error("[CartPage] Error fetching cart:", err);
      setError(err.message);
      setCartItems([]);
      setCart(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCartData();
  }, [fetchCartData]);

  const handleApiAction = async (endpoint, method, body = null) => {
    // setError(null); // Clear previous errors before new action
    // No need to set isLoading(true) here if fetchCartData does it and is always called after.
    // However, for actions that don't immediately show results via fetchCartData, you might want it.
    // Let's keep setIsLoading(true) at the start of actions for immediate feedback.
    setIsLoading(true); 
    const token = localStorage.getItem('token');
    if (!token) {
      setError("Authentication required. Please log in.");
      setIsLoading(false);
      return false;
    }

    try {
      const options = {
        method: method,
        headers: { 'Authorization': `Bearer ${token}` },
      };
      if (body) {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(body);
      }
      const response = await fetch(`${API_BASE_URL}${endpoint}`, options); // [MODIFIED URL construction]

      if (!response.ok) {
        let errorPayload = { message: `API action failed at ${endpoint} (status: ${response.status})` };
         try {
            const errorData = await response.json();
            errorPayload.message = errorData.error || errorData.errors?.general || JSON.stringify(errorData);
        } catch (e) {
            const textError = await response.text();
            console.error(`[CartPage] Non-JSON error response from API action ${method} ${endpoint}:`, textError);
            errorPayload.message = `Server returned ${response.status}. Response: ${textError.substring(0,200)}...`;
        }
        throw new Error(errorPayload.message);
      }
      
      // On success, refetch the entire cart to ensure UI consistency
      await fetchCartData(); 
      return true;

    } catch (err) {
      console.error(`[CartPage] Error during API action ${method} ${endpoint}:`, err);
      setError(err.message); // Set error state to display it
      setIsLoading(false); // Ensure loading is stopped on error
      return false;
    }
    // setIsLoading(false) is handled by fetchCartData if successful
  };

  const handleQuantityChange = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) { 
        // If quantity becomes 0 or less, remove the item
        await handleRemoveItem(cartItemId);
        return;
    }
    await handleApiAction(`/api/cart/items/${cartItemId}`, 'PUT', { quantity: newQuantity });
  };

  const handleRemoveItem = async (cartItemId) => {
    await handleApiAction(`/api/cart/items/${cartItemId}`, 'DELETE');
  };

  const handleMoveToWishlist = async (cartItemId) => {
    console.log(`Item with cart_item_id ${cartItemId} would be moved to wishlist.`);
    await handleRemoveItem(cartItemId);
  };

  const handleClearCart = async () => {
    await handleApiAction('/api/cart', 'DELETE');
  };

  const handleApplyCoupon = () => { 
    if (couponCode.toUpperCase() === 'STUDENT10') {
      setCouponApplied(true);
      setCouponDiscount(10);
      alert('Coupon STUDENT10 applied!');
    } else {
      alert('Invalid coupon code');
      setCouponApplied(false);
      setCouponDiscount(0);
    }
  };

  const subtotal = cartItems.reduce((total, item) => total + (item.price_at_add * item.quantity), 0);
  const shipping = subtotal > 50 || cartItems.length === 0 ? 0 : 5.99;
  const tax = subtotal * 0.08; 
  const totalDiscountFromCoupon = couponApplied ? (subtotal * (couponDiscount / 100)) : 0;
  const grandTotal = subtotal + shipping + tax - totalDiscountFromCoupon;
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Recommended products: No dummy data.
  // In a real app, you'd fetch these from an API.
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  // TODO: useEffect to fetch recommended products if needed:
  // useEffect(() => {
  //   fetch(`${API_BASE_URL}/api/products/recommended`) // Example endpoint
  //     .then(res => res.json())
  //     .then(data => setRecommendedProducts(data))
  //     .catch(err => console.error("Error fetching recommended products:", err));
  // }, []);


  if (isLoading && !cart && !error) { 
    return <div className="bg-gray-50 min-h-screen py-6 flex justify-center items-center"><p>Loading your cart...</p></div>;
  }
  
  return (
    <div className="bg-gray-50 min-h-screen py-6">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Shopping Cart</h1>

        {error && !isLoading && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
        {isLoading && (cart || error) && <div className="text-center my-4 text-gray-600">Updating cart...</div>}


        {cartItems.length === 0 && !isLoading ? ( 
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="mb-6">
              <ShoppingBag size={64} className="mx-auto text-gray-300" />
              <h2 className="text-xl font-semibold mt-4">Your cart is empty</h2>
              {!error && <p className="text-gray-600 mt-2">Looks like you haven't added anything to your cart yet.</p>}
              {/* Show a more specific message if there was an error loading the cart vs. it just being empty */}
              {error && <p className="text-gray-600 mt-2">Could not load your cart. Please try refreshing or logging in again.</p>}
            </div>
            <Link 
              to="/" 
              className="inline-block bg-red-600 text-white px-6 py-3 rounded-md font-medium hover:bg-red-700 transition"
            >
              Continue Shopping
            </Link>
            
            {/* Recommended Products Section - Now uses an empty array or fetched data */}
            <div className="mt-12">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Recommended For You</h3>
              {recommendedProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {recommendedProducts.map(product => (
                    <div key={product.id} className="bg-white border rounded-lg overflow-hidden hover:shadow-md transition">
                      <img src={product.image_url || product.image || '/api/placeholder/150/150'} alt={product.name} className="w-full h-32 object-cover" />
                      <div className="p-3">
                        <h4 className="font-medium text-gray-800 truncate">{product.name}</h4>
                        <div className="flex items-center mt-1">
                          <span className="font-bold text-red-600">${(product.price - (product.price * ((product.discount_percentage || product.discount || 0) / 100))).toFixed(2)}</span>
                          {(product.discount_percentage || product.discount || 0) > 0 && (
                            <span className="ml-2 text-sm text-gray-500 line-through">${parseFloat(product.price).toFixed(2)}</span>
                          )}
                        </div>
                        <button 
                          onClick={async () => {
                              alert(`"Add to cart" for "${product.name}" needs to be fully implemented.`);
                              console.log("Attempting to add recommended product:", product);
                          }}
                          className="w-full mt-2 bg-red-600 text-white text-sm py-1 rounded hover:bg-red-700 transition">
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 mt-2">No recommendations available at the moment.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3"> {/* Cart Items */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-4 px-4 sm:px-6 text-sm font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="py-4 px-4 text-sm font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Price</th>
                      <th className="py-4 px-4 text-sm font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                      <th className="py-4 px-4 text-sm font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Subtotal</th>
                      <th className="py-4 px-4 text-sm font-medium text-gray-500 uppercase tracking-wider"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {cartItems.map((item) => {
                      const unitPrice = item.price_at_add; // This is the price customer pays per unit for this item
                      const itemSubtotal = unitPrice * item.quantity;
                      
                      return (
                        <tr key={item.id}>
                          <td className="py-4 px-4 sm:px-6">
                            <div className="flex items-center">
                              <img src={item.product?.image_url || item.product?.image || '/api/placeholder/100/100'} alt={item.product?.name} className="w-16 h-16 object-cover rounded" />
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{item.product?.name || 'Product Name Missing'}</div>
                                <div className="text-sm text-gray-500">Color: {item.product?.color || item.color || 'N/A'}</div>
                                {item.product?.stock === 0 && (
                                  <div className="text-xs text-red-600 mt-1">Out of stock</div>
                                )}
                                <div className="sm:hidden mt-1">
                                  <span className="font-medium text-gray-800">${unitPrice.toFixed(2)}</span>
                                  {(item.product?.original_price && parseFloat(item.product.original_price) > unitPrice) && (
                                    <span className="ml-2 text-xs text-gray-500 line-through">${parseFloat(item.product.original_price).toFixed(2)}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 hidden sm:table-cell">
                            <div>
                              <span className="font-medium text-gray-800">${unitPrice.toFixed(2)}</span>
                              {(item.product?.original_price && parseFloat(item.product.original_price) > unitPrice) && (
                                <div className="text-xs text-gray-500 line-through">${parseFloat(item.product.original_price).toFixed(2)}</div>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center border rounded-md">
                              <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)} className="px-3 py-1 focus:outline-none">-</button>
                              <span className="px-3 py-1 border-l border-r">{item.quantity}</span>
                              <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)} className="px-3 py-1 focus:outline-none">+</button>
                            </div>
                          </td>
                          <td className="py-4 px-4 font-medium text-gray-900 hidden sm:table-cell">${itemSubtotal.toFixed(2)}</td>
                          <td className="py-4 px-4 text-right text-sm font-medium">
                            <div className="flex items-center justify-end sm:justify-start">
                              <button onClick={() => handleMoveToWishlist(item.id)} className="text-gray-600 hover:text-red-600 mr-2 sm:mr-3" title="Move to Wishlist"><Heart size={18} /></button>
                              <button onClick={() => handleRemoveItem(item.id)} className="text-gray-600 hover:text-red-600" title="Remove Item"><Trash2 size={18} /></button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-center mt-6">
                <Link to="/" className="flex items-center text-red-600 hover:text-red-800 font-medium mb-4 sm:mb-0">
                  {/* Your original SVG for "Continue Shopping" or an icon */}
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                  Continue Shopping
                </Link>
                <button onClick={handleClearCart} className="text-sm text-gray-500 hover:text-red-600 font-medium">Clear Cart</button>
              </div>
            </div>
            <div className="lg:w-1/3"> {/* Order Summary */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h2>
                <div className="border-t pt-4">
                  <div className="flex justify-between mb-2"><span className="text-gray-600">Subtotal ({totalItemsCount} items)</span><span className="text-gray-800 font-medium">${subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between mb-2"><span className="text-gray-600">Shipping</span><span className="text-gray-800 font-medium">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span></div>
                  <div className="flex justify-between mb-2"><span className="text-gray-600">Tax (8%)</span><span className="text-gray-800 font-medium">${tax.toFixed(2)}</span></div>
                  {couponApplied && (<div className="flex justify-between mb-2 text-green-600"><span>Discount ({couponCode.toUpperCase() || 'COUPON'})</span><span>-${totalDiscountFromCoupon.toFixed(2)}</span></div>)}
                </div>
                <div className="border-t mt-4 pt-4"><div className="flex justify-between mb-2"><span className="font-semibold text-gray-800">Total</span><span className="font-bold text-xl text-red-600">${grandTotal.toFixed(2)}</span></div></div>
                <div className="mt-6">
                  <label htmlFor="coupon" className="block text-sm font-medium text-gray-700 mb-1">Have a coupon?</label>
                  <div className="flex"><input type="text" id="coupon" placeholder="Enter coupon code" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} className="flex-1 border rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500" /><button onClick={handleApplyCoupon} disabled={couponApplied} className={`bg-red-600 text-white px-4 py-2 rounded-r-md ${couponApplied ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'} transition`}>Apply</button></div>
                  {couponApplied && (<p className="text-xs text-green-600 mt-1">Coupon {couponCode.toUpperCase()} applied successfully!</p>)}
                  <p className="text-xs text-gray-500 mt-1">Try "STUDENT10" for 10% off</p>
                </div>
                <div className="mt-6"><Link to="/checkout" className="w-full bg-red-600 text-white py-3 px-4 rounded-md font-medium flex items-center justify-center hover:bg-red-700 transition"><CreditCard size={20} className="mr-2" />Proceed to Checkout</Link></div>
                <div className="mt-6 text-center text-sm text-gray-500"><p className="mb-2">Secure Checkout</p><div className="flex justify-center space-x-2"><div className="w-8 h-5 bg-gray-200 rounded"></div><div className="w-8 h-5 bg-gray-200 rounded"></div><div className="w-8 h-5 bg-gray-200 rounded"></div><div className="w-8 h-5 bg-gray-200 rounded"></div></div></div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 mt-6"><div className="flex items-center"><Tag size={20} className="text-red-600 mr-3" /><div><h3 className="font-medium text-gray-800">Student Discount Available</h3><p className="text-sm text-gray-600">Verify with your .edu email for extra 5% off!</p></div></div></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}