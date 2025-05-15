
import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Bell, Package, DollarSign, Users, PieChart, Settings, HelpCircle, ChevronDown } from 'lucide-react';

// Sample data for the sales chart
const salesData = [
  { name: 'Jan', sales: 4000 },
  { name: 'Feb', sales: 3000 },
  { name: 'Mar', sales: 5000 },
  { name: 'Apr', sales: 2780 },
  { name: 'May', sales: 1890 },
  { name: 'Jun', sales: 2390 },
];

// Sample data for recent orders
const recentOrders = [
  { id: '#1234', customer: 'John Smith', date: '2025-05-12', total: '$75.99', status: 'Shipped' },
  { id: '#1235', customer: 'Sarah Lee', date: '2025-05-11', total: '$124.50', status: 'Processing' },
  { id: '#1236', customer: 'Mike Chen', date: '2025-05-10', total: '$49.99', status: 'Delivered' },
  { id: '#1237', customer: 'Emma Wilson', date: '2025-05-09', total: '$89.99', status: 'Pending' },
];

// Sample product data
const products = [
  { id: 1, name: 'College Notebook Pro', stock: 28, price: '$24.99', sales: 125 },
  { id: 2, name: 'Wireless Earbuds', stock: 14, price: '$59.99', sales: 87 },
  { id: 3, name: 'Backpack XL', stock: 32, price: '$74.99', sales: 63 },
  { id: 4, name: 'Water Bottle 750ml', stock: 8, price: '$19.99', sales: 54 },
];

export default function SellerPage() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab />;
      case 'products':
        return <ProductsTab />;
      case 'orders':
        return <OrdersTab />;
      default:
        return <DashboardTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex bg-white shadow">
        <SideNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1 p-8">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}

function SideNavigation({ activeTab, setActiveTab }) {
  return (
    <div className="w-64 bg-red-700 text-white min-h-screen p-4">
      <div className="mb-8">
        <h2 className="text-xl font-bold">Seller Center</h2>
        <p className="text-sm text-red-200">Manage your store</p>
      </div>

      <nav>
        <ul className="space-y-2">
          <li>
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'dashboard' ? 'bg-red-800' : 'hover:bg-red-600'}`}
            >
              <PieChart size={18} className="mr-3" />
              Dashboard
            </button>
          </li>
          <li>
            <button 
              onClick={() => setActiveTab('products')}
              className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'products' ? 'bg-red-800' : 'hover:bg-red-600'}`}
            >
              <Package size={18} className="mr-3" />
              Products
            </button>
          </li>
          <li>
            <button 
              onClick={() => setActiveTab('orders')}
              className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'orders' ? 'bg-red-800' : 'hover:bg-red-600'}`}
            >
              <DollarSign size={18} className="mr-3" />
              Orders
            </button>
          </li>
          <li>
            <button 
              className="flex items-center w-full p-3 rounded-lg hover:bg-red-600"
            >
              <Users size={18} className="mr-3" />
              Customers
            </button>
          </li>
          <li>
            <button 
              className="flex items-center w-full p-3 rounded-lg hover:bg-red-600"
            >
              <Settings size={18} className="mr-3" />
              Settings
            </button>
          </li>
          <li>
            <button 
              className="flex items-center w-full p-3 rounded-lg hover:bg-red-600"
            >
              <HelpCircle size={18} className="mr-3" />
              Help
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

function DashboardTab() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <div className="flex items-center">
          <button className="p-2 rounded-full bg-gray-100 mr-2">
            <Bell size={20} />
          </button>
          <div className="flex items-center space-x-2">
            <img src="/api/placeholder/40/40" alt="Store avatar" className="rounded-full" />
            <span className="font-medium">My College Store</span>
            <ChevronDown size={16} />
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard icon={<DollarSign size={20} className="text-green-500" />} title="Today's Sales" value="$1,246" change="+12%" />
        <StatCard icon={<Package size={20} className="text-blue-500" />} title="Orders" value="28" change="+5%" />
        <StatCard icon={<Users size={20} className="text-purple-500" />} title="Customers" value="312" change="+2%" />
        <StatCard icon={<DollarSign size={20} className="text-yellow-500" />} title="Revenue (May)" value="$14,892" change="+18%" />
      </div>

      {/* Sales Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Monthly Sales</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="sales" fill="#e53e3e" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 pb-0">
          <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left bg-gray-50 border-b">
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.customer}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.total}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                      order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' : 
                      order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ProductsTab() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Products</h1>
        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
          Add New Product
        </button>
      </div>

      <div className="flex justify-between bg-white p-4 rounded-lg shadow">
        <div className="flex space-x-2">
          <input 
            type="text" 
            placeholder="Search products..." 
            className="px-4 py-2 border rounded-lg w-64"
          />
          <select className="px-4 py-2 border rounded-lg">
            <option>All Categories</option>
            <option>Electronics</option>
            <option>Books</option>
            <option>Stationery</option>
            <option>Furniture</option>
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Sort by:</span>
          <select className="px-4 py-2 border rounded-lg">
            <option>Best Selling</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Newest</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left bg-gray-50 border-b">
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Sales</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-md"></div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">SKU: PRD-{product.id}0{product.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm ${product.stock < 10 ? 'text-red-600' : 'text-gray-700'}`}>
                      {product.stock} units
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.sales}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">Edit</button>
                      <button className="text-red-600 hover:text-red-900">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing 1 to 4 of 4 entries
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border rounded-md bg-gray-50">Previous</button>
            <button className="px-3 py-1 border rounded-md bg-red-600 text-white">1</button>
            <button className="px-3 py-1 border rounded-md bg-gray-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrdersTab() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
        <div className="flex space-x-2">
          <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">Export</button>
          <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">Print</button>
        </div>
      </div>

      <div className="flex justify-between bg-white p-4 rounded-lg shadow">
        <div className="flex space-x-2">
          <input 
            type="text" 
            placeholder="Search order ID or customer..." 
            className="px-4 py-2 border rounded-lg w-64"
          />
          <select className="px-4 py-2 border rounded-lg">
            <option>All Status</option>
            <option>Processing</option>
            <option>Shipped</option>
            <option>Delivered</option>
            <option>Cancelled</option>
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Date Range:</span>
          <input type="date" className="px-4 py-2 border rounded-lg" />
          <span>-</span>
          <input type="date" className="px-4 py-2 border rounded-lg" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left bg-gray-50 border-b">
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.customer}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.total}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                      order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' : 
                      order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">View</button>
                      <button className="text-gray-600 hover:text-gray-900">Invoice</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing 1 to 4 of 24 entries
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border rounded-md bg-gray-50">Previous</button>
            <button className="px-3 py-1 border rounded-md bg-red-600 text-white">1</button>
            <button className="px-3 py-1 border rounded-md bg-gray-50">2</button>
            <button className="px-3 py-1 border rounded-md bg-gray-50">3</button>
            <button className="px-3 py-1 border rounded-md bg-gray-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, change }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div>
          {icon}
        </div>
      </div>
      <div className="mt-2">
        <span className={`text-xs font-medium ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
          {change} from last period
        </span>
      </div>
    </div>
  );
}