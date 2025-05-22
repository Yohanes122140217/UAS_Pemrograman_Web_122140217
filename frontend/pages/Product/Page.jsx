// import { useState } from 'react';
// import { Heart, ShoppingCart, Star, ArrowLeft, ArrowRight, Share2 } from 'lucide-react';
// import ProductCard from '../../components/ProductCard';

// export default function ProductPage() {
//   const [mainImage, setMainImage] = useState(0);
//   const [quantity, setQuantity] = useState(1);
//   const [activeTab, setActiveTab] = useState('description');
  
//   // Sample product data
//   const product = {
//     id: 1,
//     name: "College Essentials Backpack",
//     price: 89.99,
//     discount: 20, // percentage
//     rating: 4.8,
//     reviewCount: 235,
//     images: [
//       "/api/placeholder/500/500", 
//       "/api/placeholder/500/500", 
//       "/api/placeholder/500/500", 
//       "/api/placeholder/500/500"
//     ],
//     colors: ["Black", "Navy", "Gray"],
//     description: "Perfect backpack for college students with laptop compartment, water bottle holder, and multiple pockets for organization. Made with durable water-resistant material.",
//     features: [
//       "15.6\" padded laptop sleeve",
//       "USB charging port",
//       "Anti-theft design",
//       "Water-resistant material",
//       "Ergonomic padded straps"
//     ],
//     specifications: {
//       "Material": "600D Polyester",
//       "Dimensions": "18\" x 12\" x 7\"",
//       "Weight": "1.8 lbs",
//       "Capacity": "28L",
//       "Warranty": "2 years"
//     }
//   };

//   // Sample related products
//   const relatedProducts = [
//     {
//       id: 2,
//       name: "Wireless Noise-Cancelling Headphones",
//       price: 129.99,
//       discount: 15,
//       image: "/api/placeholder/200/200",
//       rating: 4.6,
//       reviewCount: 189
//     },
//     {
//       id: 3,
//       name: "College Ruled Notebook (5-Pack)",
//       price: 19.99,
//       discount: 0,
//       image: "/api/placeholder/200/200",
//       rating: 4.5,
//       reviewCount: 324
//     },
//     {
//       id: 4,
//       name: "USB-C to HDMI Adapter",
//       price: 24.99,
//       discount: 10,
//       image: "/api/placeholder/200/200",
//       rating: 4.7,
//       reviewCount: 114
//     },
//     {
//       id: 5,
//       name: "Portable Power Bank 20000mAh",
//       price: 49.99,
//       discount: 25,
//       image: "/api/placeholder/200/200",
//       rating: 4.9,
//       reviewCount: 567
//     }
//   ];

//   const finalPrice = product.price - (product.price * (product.discount / 100));

//   const handleQuantityChange = (change) => {
//     const newQuantity = quantity + change;
//     if (newQuantity >= 1) {
//       setQuantity(newQuantity);
//     }
//   };

//   const handleImageChange = (index) => {
//     setMainImage(index);
//   };

//   const handlePrevImage = () => {
//     setMainImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
//   };

//   const handleNextImage = () => {
//     setMainImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
//   };

//   return (
//     <div className="bg-gray-50 min-h-screen">
//       {/* Breadcrumb */}
//       <div className="container mx-auto px-4 py-2 text-sm text-gray-600">
//         <div className="flex items-center gap-2">
//           <span>Home</span>
//           <span>/</span>
//           <span>College Essentials</span>
//           <span>/</span>
//           <span className="font-medium text-red-600">Backpacks</span>
//         </div>
//       </div>

//       {/* Product details */}
//       <div className="container mx-auto px-4 py-6">
//         <div className="bg-white rounded-lg shadow-md overflow-hidden">
//           <div className="flex flex-col lg:flex-row">
//             {/* Product images */}
//             <div className="w-full lg:w-1/2 p-4">
//               <div className="relative">
//                 <img 
//                   src={product.images[mainImage]} 
//                   alt={product.name}
//                   className="w-full h-96 object-contain"
//                 />
//                 <button 
//                   onClick={handlePrevImage}
//                   className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 p-2 rounded-full"
//                 >
//                   <ArrowLeft size={20} />
//                 </button>
//                 <button 
//                   onClick={handleNextImage}
//                   className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 p-2 rounded-full"
//                 >
//                   <ArrowRight size={20} />
//                 </button>
//               </div>
//               <div className="flex justify-center mt-4 space-x-2">
//                 {product.images.map((img, index) => (
//                   <div 
//                     key={index}
//                     onClick={() => handleImageChange(index)}
//                     className={`w-16 h-16 border-2 cursor-pointer ${mainImage === index ? 'border-red-500' : 'border-gray-200'}`}
//                   >
//                     <img 
//                       src={img} 
//                       alt={`${product.name} thumbnail ${index + 1}`}
//                       className="w-full h-full object-cover"
//                     />
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Product info */}
//             <div className="w-full lg:w-1/2 p-6">
//               <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>
              
//               <div className="flex items-center mt-2">
//                 <div className="flex">
//                   {[...Array(5)].map((_, i) => (
//                     <Star
//                       key={i}
//                       size={16}
//                       className={i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
//                     />
//                   ))}
//                 </div>
//                 <span className="ml-2 text-sm text-gray-600">{product.rating} ({product.reviewCount} reviews)</span>
//               </div>

//               <div className="mt-4">
//                 <div className="flex items-center">
//                   {product.discount > 0 && (
//                     <span className="text-base text-gray-500 line-through mr-2">${product.price.toFixed(2)}</span>
//                   )}
//                   <span className="text-2xl font-bold text-red-600">${finalPrice.toFixed(2)}</span>
//                   {product.discount > 0 && (
//                     <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 text-sm font-semibold rounded">
//                       {product.discount}% OFF
//                     </span>
//                   )}
//                 </div>
//               </div>

//               <div className="mt-6">
//                 <h3 className="text-sm font-medium text-gray-700">Colors</h3>
//                 <div className="flex space-x-2 mt-2">
//                   {product.colors.map((color, index) => (
//                     <div key={index} className="border p-2 px-4 rounded cursor-pointer hover:border-red-500">
//                       {color}
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <div className="mt-6">
//                 <h3 className="text-sm font-medium text-gray-700">Quantity</h3>
//                 <div className="flex items-center mt-2">
//                   <button 
//                     onClick={() => handleQuantityChange(-1)}
//                     className="p-2 border rounded-l w-10 focus:outline-none hover:bg-gray-100"
//                   >
//                     -
//                   </button>
//                   <input 
//                     type="text" 
//                     value={quantity}
//                     readOnly
//                     className="p-2 border-t border-b w-12 text-center"
//                   />
//                   <button 
//                     onClick={() => handleQuantityChange(1)}
//                     className="p-2 border rounded-r w-10 focus:outline-none hover:bg-gray-100"
//                   >
//                     +
//                   </button>
//                 </div>
//               </div>

//               <div className="mt-8 space-y-3">
//                 <button className="w-full bg-red-600 text-white py-3 px-4 rounded-md font-medium flex items-center justify-center hover:bg-red-700 transition">
//                   <ShoppingCart size={20} className="mr-2" />
//                   Add to Cart
//                 </button>

//                 <button className="w-full border border-red-600 text-red-600 py-3 px-4 rounded-md font-medium flex items-center justify-center hover:bg-red-50 transition">
//                   <Heart size={20} className="mr-2" />
//                   Add to Wishlist
//                 </button>

//                 <button className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-md font-medium flex items-center justify-center hover:bg-gray-50 transition">
//                   <Share2 size={20} className="mr-2" />
//                   Share Product
//                 </button>
//               </div>

//               <div className="mt-6 border-t pt-4">
//                 <div className="flex text-sm">
//                   <div className="mr-2">✓</div>
//                   <div>Free shipping for orders over $50</div>
//                 </div>
//                 <div className="flex text-sm mt-1">
//                   <div className="mr-2">✓</div>
//                   <div>30-day money-back guarantee</div>
//                 </div>
//                 <div className="flex text-sm mt-1">
//                   <div className="mr-2">✓</div>
//                   <div>Student discount available</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Product tabs */}
//         <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
//           <div className="border-b">
//             <nav className="flex">
//               <button
//                 onClick={() => setActiveTab('description')}
//                 className={`py-4 px-6 focus:outline-none ${
//                   activeTab === 'description'
//                     ? 'border-b-2 border-red-600 font-medium text-red-600'
//                     : 'text-gray-600 hover:text-red-600'
//                 }`}
//               >
//                 Description
//               </button>
//               <button
//                 onClick={() => setActiveTab('features')}
//                 className={`py-4 px-6 focus:outline-none ${
//                   activeTab === 'features'
//                     ? 'border-b-2 border-red-600 font-medium text-red-600'
//                     : 'text-gray-600 hover:text-red-600'
//                 }`}
//               >
//                 Features
//               </button>
//               <button
//                 onClick={() => setActiveTab('specifications')}
//                 className={`py-4 px-6 focus:outline-none ${
//                   activeTab === 'specifications'
//                     ? 'border-b-2 border-red-600 font-medium text-red-600'
//                     : 'text-gray-600 hover:text-red-600'
//                 }`}
//               >
//                 Specifications
//               </button>
//               <button
//                 onClick={() => setActiveTab('reviews')}
//                 className={`py-4 px-6 focus:outline-none ${
//                   activeTab === 'reviews'
//                     ? 'border-b-2 border-red-600 font-medium text-red-600'
//                     : 'text-gray-600 hover:text-red-600'
//                 }`}
//               >
//                 Reviews ({product.reviewCount})
//               </button>
//             </nav>
//           </div>

//           <div className="p-6">
//             {activeTab === 'description' && (
//               <div>
//                 <p className="text-gray-700">{product.description}</p>
//               </div>
//             )}

//             {activeTab === 'features' && (
//               <div>
//                 <ul className="list-disc pl-5 space-y-2">
//                   {product.features.map((feature, index) => (
//                     <li key={index} className="text-gray-700">{feature}</li>
//                   ))}
//                 </ul>
//               </div>
//             )}

//             {activeTab === 'specifications' && (
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {Object.entries(product.specifications).map(([key, value], index) => (
//                   <div key={index} className="flex border-b pb-2">
//                     <span className="font-medium w-32 text-gray-700">{key}:</span>
//                     <span className="text-gray-600">{value}</span>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {activeTab === 'reviews' && (
//               <div>
//                 <div className="flex items-center">
//                   <div className="flex">
//                     {[...Array(5)].map((_, i) => (
//                       <Star
//                         key={i}
//                         size={20}
//                         className={i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
//                       />
//                     ))}
//                   </div>
//                   <span className="ml-2 text-xl font-bold text-gray-900">{product.rating}</span>
//                   <span className="mx-2 text-gray-600">out of 5</span>
//                 </div>
                
//                 <p className="mt-2 text-gray-600">Based on {product.reviewCount} reviews</p>
                
//                 <button className="mt-4 px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition">
//                   Write a Review
//                 </button>
                
//                 <div className="mt-8">
//                   <p className="italic text-gray-500">Review feature would display here with pagination, filter options, and individual reviews...</p>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Related products */}
//         <div className="mt-12">
//           <h2 className="text-2xl font-bold text-gray-800 mb-6">You May Also Like</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//             {relatedProducts.map(product => (
//               <ProductCard key={product.id} product={product} />
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// Updated ProductPage that connects to the backend

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/products/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Product not found');
          }
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        setProduct(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError(error.message || 'Failed to load product details.');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    // This would normally add the product to the cart
    alert(`Added ${product.name} to cart!`);
    // Redirect to cart page
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center p-4">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-red-700 font-medium">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md border-t-4 border-red-500 max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-700 mb-4">Error</h2>
          <p className="text-gray-700">{error}</p>
          <div className="mt-6 flex gap-4">
            <button 
              onClick={() => navigate('/')}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded transition-colors duration-300"
            >
              Go Home
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition-colors duration-300"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center p-4">
          <h2 className="text-2xl font-bold text-red-700 mb-4">Product Not Found</h2>
          <p className="text-gray-700">The product you're looking for does not exist.</p>
          <button 
            onClick={() => navigate('/')}
            className="mt-6 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition-colors duration-300"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="md:w-1/2 p-6">
              <div className="mb-4">
                <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  {product.category}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
              <p className="text-2xl font-bold text-red-600 mb-6">${product.price.toFixed(2)}</p>
              <div className="border-t border-gray-200 pt-4 mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Description</h2>
                <p className="text-gray-600">{product.description}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleAddToCart}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300 flex-1 text-center"
                >
                  Add to Cart
                </button>
                <button 
                  onClick={() => navigate('/checkout')}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded-lg transition-colors duration-300 flex-1 text-center"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;