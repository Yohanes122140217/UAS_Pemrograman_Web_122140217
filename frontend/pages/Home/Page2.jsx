import { useState } from 'react';
import ProductCard from '../../components/ProductCard';
import { SectionContainer, Banner, CategoryPill } from '../../components/UIComponents';
import { Link } from 'react-router-dom';

function HomePage2() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  // Optionally, you can fetch flashSaleProducts or categories similarly

  useEffect(() => {
    // Fetch products from backend API
    fetch('http://localhost:6543/api/get-products')
      .then(res => res.json())
      .then(data => {
        setFeaturedProducts(data);
      })
      .catch(err => {
        console.error('Failed to fetch products:', err);
      });
  }, []);

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

    {/* Featured Products Section */}
      <SectionContainer title="Recommended for You" viewAllLink="/categories" className="mt-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} {...product} />
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