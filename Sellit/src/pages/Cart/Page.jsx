import { useState } from 'react';
import { Trash2, Heart, ShoppingBag, Tag, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CartPage() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "College Essentials Backpack",
      price: 89.99,
      discount: 20,
      quantity: 1,
      image: "/api/placeholder/100/100",
      color: "Black",
      inStock: true
    },
    {
      id: 2,
      name: "Wireless Noise-Cancelling Headphones",
      price: 129.99,
      discount: 15,
      quantity: 1,
      image: "/api/placeholder/100/100",
      color: "Silver",
      inStock: true
    },
    {
      id: 3,
      name: "USB-C Hub Adapter",
      price: 45.99,
      discount: 0,
      quantity: 2,
      image: "/api/placeholder/100/100",
      color: "White",
      inStock: true
    }
  ]);

  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);

  const handleQuantityChange = (id, change) => {
    const updatedCart = cartItems.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + change;
        return {
          ...item,
          quantity: newQuantity > 0 ? newQuantity : 1
        };
      }
      return item;
    });
    setCartItems(updatedCart);
  };

  const handleRemoveItem = (id) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
  };

  const handleMoveToWishlist = (id) => {
    // This would actually move the item to wishlist in a real app
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
  };

  const handleApplyCoupon = () => {
    // Mock coupon logic - in a real app this would validate with backend
    if (couponCode.toUpperCase() === 'STUDENT10') {
      setCouponApplied(true);
      setCouponDiscount(10); // 10% discount
    } else {
      alert('Invalid coupon code');
    }
  };

  // Calculate subtotal
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const itemPrice = item.price - (item.price * (item.discount / 100));
      return total + (itemPrice * item.quantity);
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.08; // 8% tax rate
  
  // Apply coupon discount if valid
  const discount = couponApplied ? (subtotal * (couponDiscount / 100)) : 0;
  
  // Calculate final total
  const total = subtotal + shipping + tax - discount;

  // Recommended products for empty cart or upsell
  const recommendedProducts = [
    {
      id: 101,
      name: "Scientific Calculator",
      price: 29.99,
      discount: 10,
      image: "/api/placeholder/150/150"
    },
    {
      id: 102,
      name: "College Ruled Notebook (5-Pack)",
      price: 19.99,
      discount: 0,
      image: "/api/placeholder/150/150"
    },
    {
      id: 103,
      name: "Wireless Mouse",
      price: 24.99,
      discount: 15,
      image: "/api/placeholder/150/150"
    },
    {
      id: 104,
      name: "Portable Power Bank 20000mAh",
      price: 49.99,
      discount: 20,
      image: "/api/placeholder/150/150"
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-6">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="mb-6">
              <ShoppingBag size={64} className="mx-auto text-gray-300" />
              <h2 className="text-xl font-semibold mt-4">Your cart is empty</h2>
              <p className="text-gray-600 mt-2">Looks like you haven't added anything to your cart yet.</p>
            </div>
            <Link 
              to="/" 
              className="inline-block bg-red-600 text-white px-6 py-3 rounded-md font-medium hover:bg-red-700 transition"
            >
              Continue Shopping
            </Link>
            
            <div className="mt-12">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Recommended For You</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {recommendedProducts.map(product => (
                  <div key={product.id} className="bg-white border rounded-lg overflow-hidden hover:shadow-md transition">
                    <img src={product.image} alt={product.name} className="w-full h-32 object-cover" />
                    <div className="p-3">
                      <h4 className="font-medium text-gray-800 truncate">{product.name}</h4>
                      <div className="flex items-center mt-1">
                        <span className="font-bold text-red-600">${(product.price - (product.price * (product.discount / 100))).toFixed(2)}</span>
                        {product.discount > 0 && (
                          <span className="ml-2 text-sm text-gray-500 line-through">${product.price.toFixed(2)}</span>
                        )}
                      </div>
                      <button className="w-full mt-2 bg-red-600 text-white text-sm py-1 rounded hover:bg-red-700 transition">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="lg:w-2/3">
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
                      const itemPrice = item.price - (item.price * (item.discount / 100));
                      const itemSubtotal = itemPrice * item.quantity;
                      
                      return (
                        <tr key={item.id}>
                          <td className="py-4 px-4 sm:px-6">
                            <div className="flex items-center">
                              <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                <div className="text-sm text-gray-500">Color: {item.color}</div>
                                {!item.inStock && (
                                  <div className="text-xs text-red-600 mt-1">Out of stock</div>
                                )}
                                <div className="sm:hidden mt-1">
                                  <span className="font-medium text-gray-800">${itemPrice.toFixed(2)}</span>
                                  {item.discount > 0 && (
                                    <span className="ml-2 text-xs text-gray-500 line-through">${item.price.toFixed(2)}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 hidden sm:table-cell">
                            <div>
                              <span className="font-medium text-gray-800">${itemPrice.toFixed(2)}</span>
                              {item.discount > 0 && (
                                <div className="text-xs text-gray-500 line-through">${item.price.toFixed(2)}</div>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center border rounded-md">
                              <button 
                                onClick={() => handleQuantityChange(item.id, -1)}
                                className="px-3 py-1 focus:outline-none"
                              >
                                -
                              </button>
                              <span className="px-3 py-1 border-l border-r">{item.quantity}</span>
                              <button 
                                onClick={() => handleQuantityChange(item.id, 1)}
                                className="px-3 py-1 focus:outline-none"
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="py-4 px-4 font-medium text-gray-900 hidden sm:table-cell">
                            ${itemSubtotal.toFixed(2)}
                          </td>
                          <td className="py-4 px-4 text-right text-sm font-medium">
                            <div className="flex items-center">
                              <button 
                                onClick={() => handleMoveToWishlist(item.id)}
                                className="text-gray-600 hover:text-red-600 mr-3"
                                title="Move to Wishlist"
                              >
                                <Heart size={18} />
                              </button>
                              <button 
                                onClick={() => handleRemoveItem(item.id)}
                                className="text-gray-600 hover:text-red-600"
                                title="Remove Item"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between mt-6">
                <Link to="/" className="flex items-center text-red-600 hover:text-red-800">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                  </svg>
                  Continue Shopping
                </Link>
                <button 
                  onClick={() => setCartItems([])}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h2>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Subtotal ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
                    <span className="text-gray-800 font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-gray-800 font-medium">
                      {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Tax</span>
                    <span className="text-gray-800 font-medium">${tax.toFixed(2)}</span>
                  </div>
                  {couponApplied && (
                    <div className="flex justify-between mb-2 text-green-600">
                      <span>Discount (STUDENT10)</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                </div>
                
                <div className="border-t mt-4 pt-4">
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-gray-800">Total</span>
                    <span className="font-bold text-xl text-red-600">${total.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <label htmlFor="coupon" className="block text-sm font-medium text-gray-700 mb-1">Have a coupon?</label>
                  <div className="flex">
                    <input
                      type="text"
                      id="coupon"
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 border rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={couponApplied}
                      className={`bg-red-600 text-white px-4 py-2 rounded-r-md ${
                        couponApplied ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'
                      } transition`}
                    >
                      Apply
                    </button>
                  </div>
                  {couponApplied && (
                    <p className="text-xs text-green-600 mt-1">Coupon STUDENT10 applied successfully!</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">Try "STUDENT10" for 10% off</p>
                </div>
                
                <div className="mt-6">
                  <Link
                    to="/checkout"
                    className="w-full bg-red-600 text-white py-3 px-4 rounded-md font-medium flex items-center justify-center hover:bg-red-700 transition"
                  >
                    <CreditCard size={20} className="mr-2" />
                    Proceed to Checkout
                  </Link>
                </div>
                
                <div className="mt-6 text-center text-sm text-gray-500">
                  <p className="mb-2">Secure Checkout</p>
                  <div className="flex justify-center space-x-2">
                    <div className="w-8 h-5 bg-gray-200 rounded"></div>
                    <div className="w-8 h-5 bg-gray-200 rounded"></div>
                    <div className="w-8 h-5 bg-gray-200 rounded"></div>
                    <div className="w-8 h-5 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                <div className="flex items-center">
                  <Tag size={20} className="text-red-600 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-800">Student Discount Available</h3>
                    <p className="text-sm text-gray-600">Verify with your .edu email for extra 5% off!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}