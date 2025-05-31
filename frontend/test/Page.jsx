import React, { useEffect, useState } from "react";

export default function TestSellerProducts() {
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token from localStorage:", token);

    if (!token) {
      setError("No token found. Please login first.");
      setLoading(false);
      return;
    }

    fetch("http://localhost:6543/api/seller/products", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        console.log("Response status:", res.status);
        const text = await res.text();
        console.log("Raw response text:", text);
        if (!res.ok) {
          // Try to parse JSON error if possible
          try {
            const data = JSON.parse(text);
            throw new Error(data.error || JSON.stringify(data));
          } catch {
            throw new Error(text || "Unknown error");
          }
        }
        return JSON.parse(text);
      })
      .then((data) => {
        console.log("Parsed JSON data:", data);
        setProducts(data);
        setLoading(false);
      })
      .catch((e) => {
        console.error("Fetch error:", e);
        setError(e.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading seller products...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  if (!products || products.length === 0) {
    return <p>No products found for this seller.</p>;
  }

  return (
    <div>
      <h2>Seller's Products:</h2>
      <ul>
        {products.map((p) => (
          <li key={p.id}>
            <strong>{p.name}</strong> - ${p.price} - Seller: {p.seller}
          </li>
        ))}
      </ul>
    </div>
  );
}
