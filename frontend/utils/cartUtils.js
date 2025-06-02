// // src/utils/cartUtils.js

// /**
//  * Generates a dynamic cart key based on the logged-in user.
//  * @returns {string|null} The cart key or null if no user is logged in.
//  */
// const getDynamicCartKey = () => {
//   const username = localStorage.getItem('username');
//   if (username) {
//     return `userCart_${username}`; // e.g., "userCart_johnDoe"
//   }
//   // If no username, it means no user is logged in.
//   // How to handle this depends on your app's requirements:
//   // Option A: No cart for guest users.
//   // Option B: A separate cart for guest users (e.g., 'guestUserCart').
//   // For now, let's assume cart is primarily for logged-in users.
//   // Operations might effectively become no-ops or return empty if no key.
//   console.warn("No logged-in user found for cart operations. Cart will not be user-specific or may use a guest key.");
//   return 'guestCart_temp'; // Or return null and handle it in getCart/saveCart
//                            // Using a guest key means guests share one cart, which clears if they log in.
// };

// /**
//  * Retrieves the user-specific cart from localStorage.
//  * @returns {Array} The array of cart items.
//  */
// export const getCart = () => {
//   const CART_KEY = getDynamicCartKey();
//   if (!CART_KEY) { // If getDynamicCartKey could return null
//     return [];
//   }
//   try {
//     const cart = localStorage.getItem(CART_KEY);
//     return cart ? JSON.parse(cart) : [];
//   } catch (error) {
//     console.error(`Error parsing cart from localStorage (key: ${CART_KEY}):`, error);
//     localStorage.removeItem(CART_KEY); // Attempt to clear corrupted cart data
//     return [];
//   }
// };

// /**
//  * Saves the user-specific cart to localStorage.
//  * @param {Array} cartItems - The array of cart items to save.
//  */
// export const saveCart = (cartItems) => {
//   const CART_KEY = getDynamicCartKey();
//   if (!CART_KEY) { // If getDynamicCartKey could return null
//     return;
//   }
//   try {
//     localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
//   } catch (error) {
//     console.error(`Error saving cart to localStorage (key: ${CART_KEY}):`, error);
//   }
// };

// /**
//  * Adds a product to the user-specific cart or updates its quantity.
//  * @param {Object} productDataForCart - Product data.
//  * @param {number} quantity - Quantity to add.
//  */
// export const addItemToCart = (productDataForCart, quantity) => {
//   const username = localStorage.getItem('username');
//   if (!username) {
//     // Or redirect to login, or show a message "Please log in to add items to cart"
//     alert("Please log in to add items to your cart.");
//     return; // Prevent adding to a 'guestCart_temp' if user must be logged in.
//   }

//   const cart = getCart(); // Will use the dynamic key based on current user
//   const existingItemIndex = cart.findIndex(item => item.id === productDataForCart.id);

//   if (existingItemIndex > -1) {
//     cart[existingItemIndex].quantity += quantity;
//   } else {
//     cart.push({
//       id: productDataForCart.id,
//       name: productDataForCart.name,
//       price: productDataForCart.price,
//       discount: productDataForCart.discount,
//       quantity: quantity,
//       image: productDataForCart.image_url || '/api/placeholder/100/100',
//       color: productDataForCart.color || 'N/A',
//       inStock: productDataForCart.stock === undefined || productDataForCart.stock === null || productDataForCart.stock > 0,
//       // seller: productDataForCart.seller // Optional
//     });
//   }
//   saveCart(cart); // Will use the dynamic key
// };