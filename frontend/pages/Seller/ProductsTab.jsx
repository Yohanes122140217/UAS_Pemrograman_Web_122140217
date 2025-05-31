import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import EditProduct from "./ProductEdit"; // Not directly used here, but good to keep if you import it elsewhere

function ProductsTab() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All Categories"); // If you're not using categories, you can remove this and related logic
    const [sort, setSort] = useState("Best Selling");
    const navigate = useNavigate();

    // State for managing deletion confirmation modal
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    // Function to fetch products
    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        if (!token) {
            setError("You are not logged in.");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("http://localhost:6543/api/seller/products", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to fetch products");
            }
            const data = await res.json();
            setProducts(data);
        } catch (e) {
            console.error("Error fetching products:", e);
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []); // Run once on component mount

    const filteredProducts = products
        .filter((p) =>
            p.name.toLowerCase().includes(search.toLowerCase()) &&
            (category === "All Categories" || (p.category === category)) // Keep or remove category filter based on your product model
        )
        .sort((a, b) => {
            switch (sort) {
                case "Price: Low to High":
                    return a.price - b.price;
                case "Price: High to Low":
                    return b.price - a.price;
                case "Newest":
                    return b.id - a.id;
                case "Best Selling":
                default:
                    return b.sold - a.sold;
            }
        });

    if (loading)
        return (
            <p className="text-center py-10 text-gray-600 text-lg font-medium">
                Loading products...
            </p>
        );
    if (error)
        return (
            <p className="text-center py-10 text-red-600 text-lg font-semibold">
                Error: {error}
            </p>
        );

    // Function to handle the Edit button click
    const handleEditClick = (productId) => {
        navigate(`/edit-product/${productId}`);
    };

    // Function to trigger deletion confirmation
    const handleDeleteClick = (product) => {
    console.log("Attempting to delete product:", product);
    console.log("Product ID to delete:", product.id);
    setProductToDelete(product);
    setShowDeleteConfirm(true);
    };

    // Function to confirm and execute deletion
    const confirmDelete = async () => {
        if (!productToDelete) return;

        const token = localStorage.getItem("token");
        if (!token) {
            alert("Authentication required. Please log in.");
            navigate('/login');
            return;
        }

        try {
            const response = await fetch(`http://localhost:6543/api/products/${productToDelete.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 204) { // 204 No Content is the expected success for DELETE
                alert(`Product "${productToDelete.name}" deleted successfully!`);
                // Remove the deleted product from the state to update UI
                setProducts(prevProducts => prevProducts.filter(p => p.id !== productToDelete.id));
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || `Failed to delete product: ${response.statusText}`);
            }
        } catch (e) {
            console.error("Error deleting product:", e);
            alert(`Error deleting product: ${e.message}`);
        } finally {
            setShowDeleteConfirm(false); // Close confirmation modal
            setProductToDelete(null);    // Clear product to delete
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-8 font-sans text-gray-900">
            <header className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
                <button
                    onClick={() => navigate("/add-product")}
                    className="bg-red-700 hover:bg-red-800 text-white font-semibold px-5 py-2 rounded-md shadow-sm transition"
                    aria-label="Add new product"
                >
                    + Add New Product
                </button>
            </header>

            <section className="flex flex-wrap justify-between gap-4 bg-white p-5 rounded-md shadow-sm border border-gray-200">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-grow min-w-[220px] px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-600 focus:outline-none transition"
                    aria-label="Search products"
                />

                {/* Keep or remove category filter based on your product model */}
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-600 focus:outline-none transition"
                    aria-label="Filter by category"
                >
                    <option>All Categories</option>
                    <option>Electronics</option>
                    <option>Books</option>
                    <option>Stationery</option>
                    <option>Furniture</option>
                </select>

                <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-600 focus:outline-none transition"
                    aria-label="Sort products"
                >
                    <option>Best Selling</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Newest</option>
                </select>
            </section>

            <section className="bg-white rounded-md shadow-sm border border-gray-200 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                                Product
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                                Stock
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                                Price
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                                Sales
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-100">
                                    <td className="px-6 py-4 whitespace-nowrap flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 flex items-center justify-center">
                                            {product.image ? (
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-gray-400 text-sm">No Image</span>
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900">{product.name}</div>
                                            <div className="text-xs text-gray-500">
                                                SKU: PRD-{product.id}0{product.id}
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">
                                        {product.stock ?? 0} units
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">
                                        ${product.price.toFixed(2)}
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {product.sold ?? 0}
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                                        <button
                                            type="button"
                                            className="text-gray-700 bg-gray-200 hover:bg-gray-300 font-medium px-3 py-1 rounded-md transition"
                                            onClick={() => handleEditClick(product.id)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            className="text-white bg-red-600 hover:bg-red-700 font-medium px-3 py-1 rounded-md transition"
                                            onClick={() => handleDeleteClick(product)} // Pass the whole product object
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="text-center py-8 text-gray-500 italic"
                                >
                                    No products found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </section>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && productToDelete && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-auto">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Confirm Deletion</h2>
                        <p className="text-gray-700 mb-6">
                            Are you sure you want to delete the product "
                            <span className="font-bold">{productToDelete.name}</span>"?
                            This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProductsTab;