import React, { useState, useEffect } from 'react';
import { Wallet, Clock, Search, Package, ChevronDown, Star, Filter } from 'lucide-react';

// Account sidebar component for navigation
const AccountSidebar = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="font-bold text-lg mb-4 text-gray-800">My Account</h3>
      <ul className="space-y-2">
        <li>
          <a 
            href="/account/wallet" 
            className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-md"
          >
            <Wallet className="mr-2 h-5 w-5" />
            My Wallet
          </a>
        </li>
        <li>
          <a 
            href="/account/orders" 
            className="flex items-center p-2 text-red-600 bg-red-50 rounded-md font-medium"
          >
            <Clock className="mr-2 h-5 w-5" />
            My Orders
          </a>
        </li>
        <li className="border-t my-2 pt-2">
          <a 
            href="/help" 
            className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-md"
          >
            Help Center
          </a>
        </li>
      </ul>
    </div>
  );
};

// Order status badge component
const OrderStatusBadge = ({ status }) => {
  let bgColor = "bg-gray-100";
  let textColor = "text-gray-600";
  
  switch (status.toLowerCase()) {
    case "delivered":
      bgColor = "bg-green-100";
      textColor = "text-green-600";
      break;
    case "shipped":
      bgColor = "bg-blue-100";
      textColor = "text-blue-600";
      break;
    case "processing":
      bgColor = "bg-yellow-100";
      textColor = "text-yellow-600";
      break;
    case "cancelled":
      bgColor = "bg-red-100";
      textColor = "text-red-600";
      break;
  }
  
  return (
    <span className={`${bgColor} ${textColor} px-3 py-1 rounded-full text-xs font-medium`}>
      {status}
    </span>
  );
};

// Order item component
const OrderItem = ({ order, onViewDetails }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center">
          <Package className="h-5 w-5 mr-2 text-red-600" />
          <span className="font-medium">Order #{order.id}</span>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>
      
      <div className="mb-3">
        <div className="text-sm text-gray-500 mb-1">Placed on {order.date}</div>
        <div className="flex flex-wrap gap-2 items-center">
          {order.items.map((item, index) => (
            <div key={index} className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded overflow-hidden">
              <img 
                src={`/api/placeholder/48/48`} 
                alt={item.name} 
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          {order.items.length > 4 && (
            <div className="text-sm text-gray-500">+{order.items.length - 4} more</div>
          )}
        </div>
      </div>
      
      <div className="flex justify-between items-center pt-3 border-t">
        <div>
          <div className="text-sm text-gray-500">Total</div>
          <div className="font-bold">${order.total}</div>
        </div>
        <button 
          onClick={() => onViewDetails(order.id)}
          className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 font-medium text-sm transition"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

// Order details modal component
const OrderDetailsModal = ({ order, onClose }) => {
  if (!order) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-full overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">Order Details</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex justify-between mb-6">
            <div>
              <div className="text-sm text-gray-500">Order Number</div>
              <div className="font-bold">#{order.id}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Order Date</div>
              <div>{order.date}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Status</div>
              <OrderStatusBadge status={order.status} />
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="font-bold mb-3">Items</h4>
            <div className="border rounded-lg overflow-hidden">
              {order.items.map((item, index) => (
                <div key={index} className={`flex p-4 ${index !== order.items.length - 1 ? 'border-b' : ''}`}>
                  <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden mr-4">
                    <img 
                      src={`/api/placeholder/64/64`} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-grow">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-gray-500">{item.variant}</div>
                    <div className="text-sm">${item.price} × {item.quantity}</div>
                  </div>
                  <div className="font-bold">${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="font-bold mb-3">Shipping Address</h4>
            <div className="border rounded-lg p-4">
              <div className="font-medium">{order.shipping.name}</div>
              <div className="text-gray-600">
                {order.shipping.address1}<br />
                {order.shipping.address2 && <>{order.shipping.address2}<br /></>}
                {order.shipping.city}, {order.shipping.state} {order.shipping.zip}<br />
                {order.shipping.country}
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="font-bold mb-3">Payment Details</h4>
            <div className="border rounded-lg p-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span>${order.payment.subtotal}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Shipping</span>
                <span>${order.payment.shipping}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Tax</span>
                <span>${order.payment.tax}</span>
              </div>
              <div className="flex justify-between pt-2 border-t font-bold">
                <span>Total</span>
                <span>${order.total}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {order.status === "Delivered" && (
              <button className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition">
                <div className="flex items-center justify-center">
                  <Star className="h-4 w-4 mr-2" />
                  Write a Review
                </div>
              </button>
            )}
            <button className="flex-1 border border-gray-300 hover:bg-gray-50 py-2 px-4 rounded-lg font-medium transition">
              Track Package
            </button>
            <button className="flex-1 border border-gray-300 hover:bg-gray-50 py-2 px-4 rounded-lg font-medium transition">
              Get Help
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock order data
  const mockOrders = [
    {
      id: '39281',
      date: 'May 10, 2025',
      status: 'Processing',
      total: '29.99',
      items: [
        { name: 'College Hoodie', variant: 'Red / Medium', price: 29.99, quantity: 1 }
      ],
      shipping: {
        name: 'John Doe',
        address1: '123 Campus Ave',
        address2: 'Apt 4B',
        city: 'University City',
        state: 'CA',
        zip: '92093',
        country: 'United States'
      },
      payment: {
        subtotal: '29.99',
        shipping: '0.00',
        tax: '2.40',
        total: '32.39'
      }
    },
    {
      id: '38712',
      date: 'May 2, 2025',
      status: 'Shipped',
      total: '15.50',
      items: [
        { name: 'Campus Notebook', variant: 'Black', price: 8.50, quantity: 1 },
        { name: 'Pen Set', variant: 'Multicolor', price: 7.00, quantity: 1 }
      ],
      shipping: {
        name: 'John Doe',
        address1: '123 Campus Ave',
        address2: 'Apt 4B',
        city: 'University City',
        state: 'CA',
        zip: '92093',
        country: 'United States'
      },
      payment: {
        subtotal: '15.50',
        shipping: '0.00',
        tax: '1.24',
        total: '16.74'
      }
    },
    {
      id: '37945',
      date: 'Apr 20, 2025',
      status: 'Delivered',
      total: '45.75',
      items: [
        { name: 'Textbook - Introduction to Computer Science', variant: 'Paperback', price: 45.75, quantity: 1 }
      ],
      shipping: {
        name: 'John Doe',
        address1: '123 Campus Ave',
        address2: 'Apt 4B',
        city: 'University City',
        state: 'CA',
        zip: '92093',
        country: 'United States'
      },
      payment: {
        subtotal: '45.75',
        shipping: '0.00',
        tax: '3.66',
        total: '49.41'
      }
    },
    {
      id: '36782',
      date: 'Mar 15, 2025',
      status: 'Delivered',
      total: '78.25',
      items: [
        { name: 'Campus Backpack', variant: 'Red', price: 59.99, quantity: 1 },
        { name: 'Water Bottle', variant: 'Blue / 32oz', price: 18.26, quantity: 1 }
      ],
      shipping: {
        name: 'John Doe',
        address1: '123 Campus Ave',
        address2: 'Apt 4B',
        city: 'University City',
        state: 'CA',
        zip: '92093',
        country: 'United States'
      },
      payment: {
        subtotal: '78.25',
        shipping: '0.00',
        tax: '6.26',
        total: '84.51'
      }
    }
  ];

  useEffect(() => {
    // Simulate loading orders data
    const loadOrders = setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 800);

    return () => clearTimeout(loadOrders);
  }, []);

  const handleViewDetails = (orderId) => {
    const order = orders.find(o => o.id === orderId);
    setSelectedOrder(order);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status.toLowerCase() === filterStatus.toLowerCase());

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-2xl font-bold mb-6">My Account</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div>
          <AccountSidebar />
        </div>
        
        {/* Main content */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">My Orders</h2>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search orders" 
                  className="pl-9 pr-4 py-2 border rounded-lg text-sm w-full md:w-auto"
                />
                <Search className="h-4 w-4 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>
            
            <div className="flex items-center mb-6 overflow-x-auto pb-2">
              <button 
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap mr-2 ${
                  filterStatus === 'all' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Orders
              </button>
              <button 
                onClick={() => setFilterStatus('processing')}
                className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap mr-2 ${
                  filterStatus === 'processing' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Processing
              </button>
              <button 
                onClick={() => setFilterStatus('shipped')}
                className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap mr-2 ${
                  filterStatus === 'shipped' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Shipped
              </button>
              <button 
                onClick={() => setFilterStatus('delivered')}
                className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap mr-2 ${
                  filterStatus === 'delivered' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Delivered
              </button>
              <button 
                onClick={() => setFilterStatus('cancelled')}
                className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap mr-2 ${
                  filterStatus === 'cancelled' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Cancelled
              </button>
            </div>
            
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-red-600 border-r-2 mx-auto mb-4"></div>
                <p className="text-gray-500">Loading orders...</p>
              </div>
            ) : filteredOrders.length > 0 ? (
              <div>
                {filteredOrders.map(order => (
                  <OrderItem 
                    key={order.id} 
                    order={order} 
                    onViewDetails={handleViewDetails} 
                  />
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-gray-50 rounded-lg">
                <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Package className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium mb-1">No orders found</h3>
                <p className="text-gray-500 mb-4">
                  {filterStatus === 'all' 
                    ? "You haven't placed any orders yet." 
                    : `You don't have any ${filterStatus} orders.`}
                </p>
                <a 
                  href="/" 
                  className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium inline-block transition"
                >
                  Continue Shopping
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Order details modal */}
      {selectedOrder && (
        <OrderDetailsModal 
          order={selectedOrder} 
          onClose={handleCloseModal} 
        />
      )}
    </div>
  );
};

export default OrdersPage;