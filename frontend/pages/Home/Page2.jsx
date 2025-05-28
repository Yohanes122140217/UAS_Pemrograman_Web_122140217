import React, { useState, useEffect } from "react";
import ProductCard2 from "../../components/ProductCard2";

export default function HomePage2() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:6543/api/get-products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((e) => console.error("Failed to fetch products:", e));
  }, []);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <ProductCard2
            key={p.id}
            id={p.id}
            name={p.name}
            image_url={p.image}             // map your API field names properly
            price={p.price}
            original_price={p.originalPrice}
            rating={p.rating}
            sold={p.sold}
            seller={p.seller}
          />
        ))}
      </div>
    </main>
  );
}
