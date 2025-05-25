// // API utilities for connecting to the backend

// const API_URL = 'http://localhost:6543/api';

// /**
//  * Helper function to make API requests
//  * @param {string} endpoint - API endpoint
//  * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
//  * @param {object} data - Request body data (for POST/PUT)
//  * @param {boolean} authenticated - Whether request needs authentication
//  * @returns {Promise} - Response data
//  */
// async function apiRequest(endpoint, method = 'GET', data = null, authenticated = false) {
//   const url = `${API_URL}${endpoint}`;
  
//   const headers = {
//     'Content-Type': 'application/json',
//   };
  
//   // Add authentication token if required
//   if (authenticated) {
//     const token = localStorage.getItem('authToken');
//     if (!token) {
//       throw new Error('Authentication required but no token found');
//     }
//     headers['Authorization'] = `Bearer ${token}`;
//   }
  
//   const config = {
//     method,
//     headers,
//   };
  
//   if (data && (method === 'POST' || method === 'PUT')) {
//     config.body = JSON.stringify(data);
//   }
  
//   try {
//     const response = await fetch(url, config);
//     const responseData = await response.json();
    
//     if (!response.ok) {
//       throw new Error(responseData.message || 'Something went wrong');
//     }
    
//     return responseData;
//   } catch (error) {
//     console.error('API Error:', error);
//     throw error;
//   }
// }

// /**
//  * User Authentication API
//  */
// export const AuthAPI = {
//   /**
//    * Register a new user
//    * @param {object} userData - User registration data
//    * @returns {Promise} - Response with new user data
//    */
//   signup: (userData) => {
//     return apiRequest('/signup', 'POST', userData);
//   },
  
//   /**
//    * Login user
//    * @param {object} credentials - User login credentials
//    * @returns {Promise} - Response with auth token and user data
//    */
//   login: (credentials) => {
//     return apiRequest('/login', 'POST', credentials);
//   },
  
//   /**
//    * Logout user (client-side only)
//    */
//   logout: () => {
//     localStorage.removeItem('authToken');
//   },
  
//   /**
//    * Check if user is authenticated
//    * @returns {boolean} - True if user is authenticated
//    */
//   isAuthenticated: () => {
//     return !!localStorage.getItem('authToken');
//   }
// };

// /**
//  * Products API
//  */
// export const ProductsAPI = {
//   /**
//    * Get all products
//    * @param {object} filters - Optional filter parameters
//    * @returns {Promise} - Response with products data
//    */
//   getAll: (filters = {}) => {
//     const queryParams = new URLSearchParams(filters).toString();
//     const endpoint = `/products${queryParams ? `?${queryParams}` : ''}`;
//     return apiRequest(endpoint);
//   },
  
//   /**
//    * Get a specific product by ID
//    * @param {string|number} id - Product ID
//    * @returns {Promise} - Response with product data
//    */
//   getById: (id) => {
//     return apiRequest(`/products/${id}`);
//   }
// };

// /**
//  * Cart API
//  */
// export const CartAPI = {
//   /**
//    * Get current user's cart
//    * @returns {Promise} - Response with cart data
//    */
//   getCart: () => {
//     return apiRequest('/cart', 'GET', null, true);
//   },
  
//   /**
//    * Add an item to cart
//    * @param {object} item - Item to add (product_id, quantity)
//    * @returns {Promise} - Response with updated cart
//    */
//   addItem: (item) => {
//     return apiRequest('/cart/add', 'POST', item, true);
//   },
  
//   /**
//    * Remove an item from cart
//    * @param {object} item - Item to remove (cart_item_id)
//    * @returns {Promise} - Response with updated cart
//    */
//   removeItem: (item) => {
//     return apiRequest('/cart/remove', 'POST', item, true);
//   }
// };

// /**
//  * Orders API
//  */
// export const OrdersAPI = {
//   /**
//    * Get user's orders
//    * @returns {Promise} - Response with orders data
//    */
//   getOrders: () => {
//     return apiRequest('/account/orders', 'GET', null, true);
//   },
  
//   /**
//    * Get a specific order by ID
//    * @param {string|number} id - Order ID
//    * @returns {Promise} - Response with order data
//    */
//   getById: (id) => {
//     return apiRequest(`/orders/${id}`, 'GET', null, true);
//   },
  
//   /**
//    * Create a new order (checkout)
//    * @param {object} checkoutData - Checkout data
//    * @returns {Promise} - Response with new order
//    */
//   checkout: (checkoutData) => {
//     return apiRequest('/checkout', 'POST', checkoutData, true);
//   }
// };

// export default {
//   AuthAPI,
//   ProductsAPI,
//   CartAPI,
//   OrdersAPI
// };