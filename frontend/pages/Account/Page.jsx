// import { useState } from 'react';
// import { User, CreditCard, ShoppingBag, ArrowRight } from 'lucide-react';

// const AccountPage = () => {
//   const [user] = useState({
//     name: 'John Doe',
//     email: 'john.doe@university.edu',
//     balance: 250000, // Balance in points/OVO
//     joinDate: 'Aug 2023'
//   });

//   const recentOrders = [
//     {
//       id: 'ORD-12345',
//       date: '12 May 2025',
//       total: 125000,
//       status: 'Delivered'
//     },
//     {
//       id: 'ORD-12344',
//       date: '5 May 2025',
//       total: 75000,
//       status: 'Processing'
//     }
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50 pt-16 pb-12">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="pb-5 border-b border-gray-200">
//           <h1 className="text-2xl font-bold leading-6 text-gray-900">My Account</h1>
//         </div>
        
//         {/* Account Overview Card */}
//         <div className="mt-6 bg-white rounded-lg shadow">
//           <div className="p-6 flex flex-col md:flex-row items-start md:items-center">
//             <div className="flex-shrink-0">
//               <div className="h-16 w-16 rounded-full bg-red-600 flex items-center justify-center text-white">
//                 <User size={32} />
//               </div>
//             </div>
//             <div className="mt-4 md:mt-0 md:ml-6 flex-grow">
//               <h2 className="text-xl font-semibold">{user.name}</h2>
//               <p className="text-gray-600">{user.email}</p>
//               <p className="text-sm text-gray-500">Member since {user.joinDate}</p>
//             </div>
//           </div>
//         </div>
        
//         {/* Quick Actions */}
//         <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Wallet Card */}
//           <div className="bg-white rounded-lg shadow overflow-hidden">
//             <div className="bg-red-100 px-6 py-4">
//               <div className="flex items-center">
//                 <CreditCard className="text-red-600" />
//                 <h3 className="ml-2 text-lg font-medium text-red-800">My Wallet</h3>
//               </div>
//             </div>
//             <div className="p-6">
//               <div className="flex justify-between items-center mb-4">
//                 <span className="text-gray-600">Available Balance</span>
//                 <span className="text-xl font-bold">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(user.balance)}</span>
//               </div>
//               <a href="/account/wallet" className="w-full bg-red-600 text-white py-2 px-4 rounded flex items-center justify-center hover:bg-red-700 transition">
//                 <span>Manage Wallet</span>
//                 <ArrowRight size={16} className="ml-2" />
//               </a>
//             </div>
//           </div>
          
//           {/* Orders Card */}
//           <div className="bg-white rounded-lg shadow overflow-hidden">
//             <div className="bg-red-100 px-6 py-4">
//               <div className="flex items-center">
//                 <ShoppingBag className="text-red-600" />
//                 <h3 className="ml-2 text-lg font-medium text-red-800">My Orders</h3>
//               </div>
//             </div>
//             <div className="p-6">
//               <div className="space-y-3 mb-4">
//                 {recentOrders.length > 0 ? (
//                   recentOrders.map(order => (
//                     <div key={order.id} className="flex justify-between text-sm">
//                       <div>
//                         <span className="font-medium">{order.id}</span>
//                         <span className="text-gray-500 ml-2">{order.date}</span>
//                       </div>
//                       <div>
//                         <span className={`px-2 py-1 rounded text-xs ${
//                           order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
//                           order.status === 'Processing' ? 'bg-blue-100 text-blue-800' : 
//                           'bg-yellow-100 text-yellow-800'
//                         }`}>
//                           {order.status}
//                         </span>
//                       </div>
//                     </div>
//                   ))
//                 ) : (
//                   <p className="text-gray-500 text-center">No recent orders</p>
//                 )}
//               </div>
//               <a href="/account/orders" className="w-full bg-red-600 text-white py-2 px-4 rounded flex items-center justify-center hover:bg-red-700 transition">
//                 <span>View All Orders</span>
//                 <ArrowRight size={16} className="ml-2" />
//               </a>
//             </div>
//           </div>
//         </div>
        
//         {/* Additional Account Settings */}
//         <div className="mt-8 bg-white rounded-lg shadow">
//           <div className="p-6">
//             <h3 className="text-lg font-medium mb-4">Account Settings</h3>
//             <div className="space-y-2">
//               <div className="p-3 hover:bg-gray-50 rounded flex justify-between items-center cursor-pointer">
//                 <span>Personal Information</span>
//                 <ArrowRight size={16} className="text-gray-400" />
//               </div>
//               <div className="p-3 hover:bg-gray-50 rounded flex justify-between items-center cursor-pointer">
//                 <span>Addresses</span>
//                 <ArrowRight size={16} className="text-gray-400" />
//               </div>
//               <div className="p-3 hover:bg-gray-50 rounded flex justify-between items-center cursor-pointer">
//                 <span>Payment Methods</span>
//                 <ArrowRight size={16} className="text-gray-400" />
//               </div>
//               <div className="p-3 hover:bg-gray-50 rounded flex justify-between items-center cursor-pointer">
//                 <span>Notifications</span>
//                 <ArrowRight size={16} className="text-gray-400" />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AccountPage;