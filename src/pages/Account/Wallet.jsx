
import React, { useState, useEffect } from 'react';
import { Wallet, CreditCard, Clock, ArrowDownCircle, ArrowUpCircle, Search } from 'lucide-react';

// Account sidebar component for navigation
const AccountSidebar = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="font-bold text-lg mb-4 text-gray-800">My Account</h3>
      <ul className="space-y-2">
        <li>
          <a 
            href="/account/wallet" 
            className="flex items-center p-2 text-red-600 bg-red-50 rounded-md font-medium"
          >
            <Wallet className="mr-2 h-5 w-5" />
            My Wallet
          </a>
        </li>
        <li>
          <a 
            href="/account/orders" 
            className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-md"
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

// Transaction item component
const TransactionItem = ({ type, date, amount, description }) => {
  const isDeposit = type === 'deposit';
  
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center">
        {isDeposit ? (
          <ArrowDownCircle className="h-8 w-8 mr-4 text-green-500" />
        ) : (
          <ArrowUpCircle className="h-8 w-8 mr-4 text-red-500" />
        )}
        <div>
          <p className="font-medium">{description}</p>
          <p className="text-sm text-gray-500">{date}</p>
        </div>
      </div>
      <span className={`font-bold ${isDeposit ? 'text-green-500' : 'text-red-500'}`}>
        {isDeposit ? '+' : '-'} ${amount}
      </span>
    </div>
  );
};

const WalletPage = () => {
  const [balance, setBalance] = useState(250);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading transaction data
    const loadTransactions = setTimeout(() => {
      setTransactions([
        { id: 1, type: 'deposit', date: 'May 14, 2025', amount: '50.00', description: 'Deposit to Wallet' },
        { id: 2, type: 'payment', date: 'May 10, 2025', amount: '29.99', description: 'Payment for Order #39281' },
        { id: 3, type: 'deposit', date: 'May 5, 2025', amount: '100.00', description: 'Promotion Reward' },
        { id: 4, type: 'payment', date: 'May 2, 2025', amount: '15.50', description: 'Payment for Order #38712' },
        { id: 5, type: 'deposit', date: 'Apr 25, 2025', amount: '200.00', description: 'Deposit to Wallet' },
        { id: 6, type: 'payment', date: 'Apr 20, 2025', amount: '45.75', description: 'Payment for Order #37945' },
      ]);
      setLoading(false);
    }, 800);

    return () => clearTimeout(loadTransactions);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-2xl font-bold mb-6">My Account</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div>
          <AccountSidebar />
        </div>
        
        {/* Main content */}
        <div className="md:col-span-2 space-y-6">
          {/* Wallet Balance */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Wallet Balance</h2>
              <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
                Campus Bucks
              </span>
            </div>
            
            <div className="flex items-center mb-6">
              <div className="bg-red-100 p-4 rounded-full mr-4">
                <Wallet className="h-8 w-8 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Available Balance</p>
                <p className="text-3xl font-bold">${balance.toFixed(2)}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <button className="bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium transition">
                Add Money
              </button>
              <button className="border border-red-600 text-red-600 hover:bg-red-50 py-3 px-4 rounded-lg font-medium transition">
                Withdraw
              </button>
            </div>
          </div>
          
          {/* Payment Methods */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Payment Methods</h2>
              <button className="text-red-600 font-medium text-sm hover:underline">+ Add New</button>
            </div>
            
            <div className="border rounded-lg p-4 mb-4 flex items-center justify-between">
              <div className="flex items-center">
                <CreditCard className="h-6 w-6 mr-3 text-gray-600" />
                <div>
                  <p className="font-medium">•••• •••• •••• 4289</p>
                  <p className="text-sm text-gray-500">Expires 09/26</p>
                </div>
              </div>
              <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">Default</span>
            </div>
          </div>
          
          {/* Transaction History */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Transaction History</h2>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Search transactions" 
                    className="pl-9 pr-4 py-2 border rounded-lg text-sm w-full md:w-auto"
                  />
                  <Search className="h-4 w-4 text-gray-400 absolute left-3 top-2.5" />
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button className="bg-red-600 text-white px-3 py-1 rounded-md text-sm">
                  All
                </button>
                <button className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md text-sm">
                  Deposits
                </button>
                <button className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md text-sm">
                  Payments
                </button>
              </div>
            </div>
            
            <div className="divide-y">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-red-600 border-r-2 mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading transactions...</p>
                </div>
              ) : transactions.length > 0 ? (
                transactions.map(transaction => (
                  <TransactionItem
                    key={transaction.id}
                    type={transaction.type}
                    date={transaction.date}
                    amount={transaction.amount}
                    description={transaction.description}
                  />
                ))
              ) : (
                <div className="p-8 text-center">
                  <p className="text-gray-500">No transactions found</p>
                </div>
              )}
            </div>
            
            {transactions.length > 0 && (
              <div className="p-4 text-center">
                <button className="text-red-600 hover:text-red-700 font-medium">
                  View All Transactions
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;