import { useState } from 'react';
import ProductCard from '../../components/ProductCard';
import { SectionContainer, Banner, CategoryPill } from '../../components/UIComponents';
import { Link } from 'react-router-dom';

function HomePage() {
  // Mock data for featured products
  const featuredProducts = [
    {
      id: 1,
      name: "Wireless Noise Cancelling Headphones",
      price: 149.99,
      originalPrice: 199.99,
      rating: 4.7,
      sold: 1250,
      image: "/api/placeholder/300/300",
    },
    {
      id: 2,
      name: "College Essential Backpack with USB Port",
      price: 49.99,
      originalPrice: 79.99,
      rating: 4.5,
      sold: 823,
      image: "/api/placeholder/300/300",
    },
    {
      id: 3,
      name: "Study Desk Lamp with Wireless Charger",
      price: 34.99,
      originalPrice: 44.99,
      rating: 4.3,
      sold: 628,
      image: "/api/placeholder/300/300",
    },
    {
      id: 4,
      name: "MacBook Pro 13-inch M1 Chip",
      price: 1199.99,
      rating: 4.9,
      sold: 456,
      image: "/api/placeholder/300/300",
    },
  ];

  // Mock data for flash sale products
  const flashSaleProducts = [
    {
      id: 5,
      name: "Bluetooth Mini Speaker",
      price: 19.99,
      originalPrice: 39.99,
      rating: 4.2,
      sold: 1802,
      image: "/api/placeholder/300/300",
    },
    {
      id: 6,
      name: "College Dorm Room Bedding Set",
      price: 39.99,
      originalPrice: 69.99,
      rating: 4.4,
      sold: 342,
      image: "/api/placeholder/300/300",
    },
    {
      id: 7,
      name: "Scientific Calculator",
      price: 14.99,
      originalPrice: 24.99,
      rating: 4.8,
      sold: 1205,
      image: "/api/placeholder/300/300",
    },
    {
      id: 8,
      name: "Water Bottle with Time Markers",
      price: 9.99,
      originalPrice: 17.99,
      rating: 4.6,
      sold: 2340,
      image: "/api/placeholder/300/300",
    },
  ];

  // Mock data for categories
  const categories = [
    { id: 1, name: "Electronics", icon: "📱", link: "/categories?cat=electronics" },
    { id: 2, name: "School Supplies", icon: "📚", link: "/categories?cat=school-supplies" },
    { id: 3, name: "Dorm Essentials", icon: "🛏️", link: "/categories?cat=dorm-essentials" },
    { id: 4, name: "Clothing", icon: "👕", link: "/categories?cat=clothing" },
    { id: 5, name: "Sports & Fitness", icon: "🏀", link: "/categories?cat=sports" },
    { id: 6, name: "Food & Snacks", icon: "🍕", link: "/categories?cat=food" },
    { id: 7, name: "Health & Beauty", icon: "💄", link: "/categories?cat=beauty" },
    { id: 8, name: "Entertainment", icon: "🎮", link: "/categories?cat=entertainment" },
    { id: 9, name: "Gift Cards", icon: "🎁", link: "/categories?cat=gift-cards" },
    { id: 10, name: "Textbooks", icon: "📘", link: "/categories?cat=textbooks" },
  ];

  // Newsletter subscription state
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Hero Banner */}
      <Banner 
        image="/api/placeholder/1200/400"
        title="Back to School Sale!"
        description="Get up to 50% off on essential items for the new semester. Limited time offer!"
        buttonText="Shop Now"
        buttonLink="/flash-sale"
      />

      {/* Categories Section */}
      <SectionContainer title="Browse Categories" viewAllLink="/categories" className="mt-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-3">
          {categories.map(category => (
            <CategoryPill 
              key={category.id} 
              name={category.name} 
              icon={category.icon} 
              link={category.link} 
            />
          ))}
        </div>
      </SectionContainer>

      {/* Flash Sale Section */}
      <SectionContainer title="Flash Sale" viewAllLink="/flash-sale" className="mt-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {flashSaleProducts.map(product => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </SectionContainer>

      {/* Featured Products Section */}
      <SectionContainer title="Recommended for You" viewAllLink="/categories" className="mt-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </SectionContainer>

      {/* Secondary Banner */}
      <div className="mt-10">
        <Banner 
          image="/api/placeholder/1200/300"
          title="Student Discount Available"
          description="Verify your student status and get an additional 10% off on all purchases!"
          buttonText="Verify Now"
          buttonLink="/account/wallet"
        />
      </div>

      {/* Newsletter Subscription */}
      <div className="bg-red-50 rounded-lg p-6 mt-10">
        <div className="text-center max-w-xl mx-auto">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Stay Updated</h3>
          <p className="text-gray-600 mb-4">
            Subscribe to our newsletter for exclusive offers and student tips!
          </p>
          
          {isSubscribed ? (
            <div className="bg-green-100 text-green-700 p-3 rounded">
              Thanks for subscribing! Keep an eye on your inbox for special offers.
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-grow px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded transition"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;