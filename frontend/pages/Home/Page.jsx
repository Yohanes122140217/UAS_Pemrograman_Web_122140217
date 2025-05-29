import React, { useState, useEffect } from "react";
import ProductCard from "../../components/ProductCard";
import { SectionContainer, Banner, CategoryPill } from "../../components/UIComponents";
import { Link } from "react-router-dom";

function HomePage() {
  const [products, setProducts] = useState([]);

  // Fetch products once on component mount
  useEffect(() => {
    fetch("http://localhost:6543/api/get-products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((e) => console.error("Failed to fetch products:", e));
  }, []);

  // Categories stay static as before
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

  // Newsletter states & handler stay the same
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail("");
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
          {categories.map((category) => (
            <CategoryPill key={category.id} name={category.name} icon={category.icon} link={category.link} />
          ))}
        </div>
      </SectionContainer>

      {/* Products Section */}
      <SectionContainer title="All Products" className="mt-10">
        {products.length === 0 ? (
          <p className="text-center text-gray-500">No products available.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                image_url={product.image_url || product.image} // map correctly
                price={product.price}
                original_price={product.original_price || product.originalPrice}
                rating={product.rating}
                sold={product.sold}
                seller={product.seller}
              />
            ))}
          </div>
        )}
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
