import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Truck, CheckCircle } from 'lucide-react';

const CheckoutPage = () => {
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [shippingMethod, setShippingMethod] = useState('standard');

  // Mock cart items
  const cartItems = [
    { id: 1, name: 'College Textbook - Economics 101', price: 79.99, quantity: 1 },
    { id: 2, name: 'Wireless Headphones', price: 129.99, quantity: 1 },
    { id: 3, name: 'Notebook Bundle', price: 24.99, quantity: 2 },
  ];

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = shippingMethod === 'express' ? 9.99 : 4.99;
  const tax = subtotal * 0.07;
  const total = subtotal + shipping + tax;

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Checkout Steps */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div className={`flex flex-col items-center ${step >= 1 ? 'text-red-600' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-red-600 text-white' : 'bg-gray-200'}`}>1</div>
            <span className="mt-2">Shipping</span>
          </div>
          <div className={`flex-1 h-1 mx-4 ${step >= 2 ? 'bg-red-600' : 'bg-gray-200'}`}></div>
          <div className={`flex flex-col items-center ${step >= 2 ? 'text-red-600' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-red-600 text-white' : 'bg-gray-200'}`}>2</div>
            <span className="mt-2">Payment</span>
          </div>
          <div className={`flex-1 h-1 mx-4 ${step >= 3 ? 'bg-red-600' : 'bg-gray-200'}`}></div>
          <div className={`flex flex-col items-center ${step >= 3 ? 'text-red-600' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-red-600 text-white' : 'bg-gray-200'}`}>3</div>
            <span className="mt-2">Review</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Checkout Form */}
        <div className="w-full lg:w-2/3 bg-white rounded-lg shadow-md p-6">
          {step === 1 && (
            <div className="shipping-form">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Shipping Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">First Name</label>
                  <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2" />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Last Name</label>
                  <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700 mb-2">Address</label>
                  <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2" />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">City</label>
                  <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2" />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">State/Province</label>
                  <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2" />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Postal Code</label>
                  <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2" />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Country</label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                    <option>United States</option>
                    <option>Canada</option>
                    <option>Mexico</option>
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Shipping Method</h3>
                <div className="space-y-3">
                  <div 
                    className={`border rounded-md p-4 cursor-pointer ${shippingMethod === 'standard' ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}
                    onClick={() => setShippingMethod('standard')}
                  >
                    <div className="flex items-center">
                      <Truck size={20} className={shippingMethod === 'standard' ? 'text-red-600' : 'text-gray-500'} />
                      <div className="ml-4">
                        <h4 className="font-medium">Standard Shipping</h4>
                        <p className="text-sm text-gray-500">3-5 business days - $4.99</p>
                      </div>
                    </div>
                  </div>
                  <div 
                    className={`border rounded-md p-4 cursor-pointer ${shippingMethod === 'express' ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}
                    onClick={() => setShippingMethod('express')}
                  >
                    <div className="flex items-center">
                      <Truck size={20} className={shippingMethod === 'express' ? 'text-red-600' : 'text-gray-500'} />
                      <div className="ml-4">
                        <h4 className="font-medium">Express Shipping</h4>
                        <p className="text-sm text-gray-500">1-2 business days - $9.99</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="payment-form">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Payment Information</h2>
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Payment Method</h3>
                <div className="space-y-3">
                  <div 
                    className={`border rounded-md p-4 cursor-pointer ${paymentMethod === 'credit' ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}
                    onClick={() => setPaymentMethod('credit')}
                  >
                    <div className="flex items-center">
                      <CreditCard size={20} className={paymentMethod === 'credit' ? 'text-red-600' : 'text-gray-500'} />
                      <div className="ml-4">
                        <h4 className="font-medium">Credit / Debit Card</h4>
                      </div>
                    </div>
                  </div>
                  <div 
                    className={`border rounded-md p-4 cursor-pointer ${paymentMethod === 'paypal' ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}
                    onClick={() => setPaymentMethod('paypal')}
                  >
                    <div className="flex items-center">
                      <div className="text-blue-600 font-bold text-lg">Pay</div>
                      <div className="text-blue-800 font-bold text-lg">Pal</div>
                      <div className="ml-4">
                        <h4 className="font-medium">PayPal</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {paymentMethod === 'credit' && (
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Cardholder Name</label>
                    <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Card Number</label>
                    <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="XXXX XXXX XXXX XXXX" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-2">Expiration Date</label>
                      <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="MM/YY" />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">CVV</label>
                      <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="XXX" />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'paypal' && (
                <div className="mt-4 bg-gray-50 p-4 rounded-md text-center">
                  <p className="text-gray-700">You'll be redirected to PayPal after reviewing your order.</p>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="review-order">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Review Your Order</h2>
              
              <div className="border-b pb-4 mb-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Shipping Information</h3>
                <p className="text-gray-700">John Doe</p>
                <p className="text-gray-700">123 Campus Street</p>
                <p className="text-gray-700">College Town, ST 12345</p>
                <p className="text-gray-700">United States</p>
              </div>
              
              <div className="border-b pb-4 mb-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Shipping Method</h3>
                <p className="text-gray-700">
                  {shippingMethod === 'standard' ? 'Standard Shipping (3-5 business days)' : 'Express Shipping (1-2 business days)'}
                </p>
              </div>
              
              <div className="border-b pb-4 mb-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Payment Method</h3>
                <p className="text-gray-700">
                  {paymentMethod === 'credit' ? 'Credit Card ending in 1234' : 'PayPal'}
                </p>
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Items in your order</h3>
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between py-2 border-b">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-gray-500 text-sm">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-between">
            {step > 1 ? (
              <button onClick={prevStep} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                Back
              </button>
            ) : (
              <Link to="/cart" className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                Return to Cart
              </Link>
            )}
            
            {step < 3 ? (
              <button onClick={nextStep} className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                {step === 1 ? 'Continue to Payment' : 'Review Order'}
              </button>
            ) : (
              <button className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                Place Order
              </button>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">Order Summary</h2>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estimated Tax</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg">Total</span>
                <span className="font-bold text-xl text-red-600">${total.toFixed(2)}</span>
              </div>
            </div>

            {step === 3 && (
              <div className="mt-6 bg-green-50 border border-green-200 rounded-md p-4">
                <div className="flex items-center">
                  <CheckCircle size={20} className="text-green-500" />
                  <p className="ml-2 text-green-800">Your order is eligible for free campus delivery with Student Prime!</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;