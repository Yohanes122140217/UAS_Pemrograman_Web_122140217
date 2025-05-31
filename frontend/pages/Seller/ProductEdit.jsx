// frontend/src/components/ProductEdit.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Save, Eye, Camera, AlertCircle, Info, Image, DollarSign,
} from 'lucide-react';

// ImageKit configuration (replace with your actual credentials)
const publicKey = "public_/G/t0frWoOsGqqQ4fpDh0o8KfiY=";
const urlEndpoint = "https://ik.imagekit.io/wc6bpahhv/"; // Ensure this is correct

function ProductEdit() {
    const { productId } = useParams();
    const navigate = useNavigate();

    // Corrected: Declare product and its setter
    const [product, setProduct] = useState(null);
    // Corrected: Declare error and its setter
    const [error, setError] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        original_price: '',
        stock: '',
        rating: 0,
        sold: 0,
    });

    // Store selected file for new upload, and preview for UI
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null); // This will hold Blob URL or fetched image URL
    const fileInputRef = useRef(null);

    // Validation errors for individual fields
    const [fieldErrors, setFieldErrors] = useState({}); // Renamed to avoid clash with 'error' state

    // Loading states for fetch and publish
    const [isLoadingInitialData, setIsLoadingInitialData] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false); // Renamed from isPublishing for clarity in edit context

    // --- ImageKit Specific Logic ---
    const authenticator = async () => {
        try {
            const response = await fetch("http://localhost:6543/api/imagekit/auth");
            if (!response.ok) throw new Error('Authentication failed for ImageKit');
            const data = await response.json();
            return {
                signature: data.signature,
                expire: data.expire,
                token: data.token,
            };
        } catch (error) {
            console.error('ImageKit Authentication error:', error);
            throw error;
        }
    };

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            const maxSize = 10 * 1024 * 1024; // 10MB

            if (!validTypes.includes(file.type)) {
                setFieldErrors(prev => ({ ...prev, images: 'Please select a valid image file (.jpg, .jpeg, .png)' }));
                setSelectedFile(null);
                setImagePreview(null);
                return;
            }

            if (file.size > maxSize) {
                setFieldErrors(prev => ({ ...prev, images: 'File size must be less than 10MB' }));
                setSelectedFile(null);
                setImagePreview(null);
                return;
            }

            setSelectedFile(file);
            const previewURL = URL.createObjectURL(file);
            setImagePreview(previewURL);
            setFieldErrors(prev => ({ ...prev, images: '' })); // Clear any previous errors
        } else {
            // If user cancels file selection, revert to existing image if any
            if (formData.image_url) {
                setImagePreview(formData.image_url);
                setSelectedFile(null); // No new file selected
            } else {
                setImagePreview(null);
            }
        }
    };

    const uploadToImageKit = async (file) => {
        try {
            const authDetails = await authenticator();
            const formDataToUpload = new FormData();
            formDataToUpload.append('file', file);
            formDataToUpload.append('fileName', `product-image-${Date.now()}-${file.name}`); // Use file.name for better identification
            formDataToUpload.append('publicKey', publicKey);
            formDataToUpload.append('signature', authDetails.signature);
            formDataToUpload.append('expire', authDetails.expire);
            formDataToUpload.append('token', authDetails.token);

            const uploadResponse = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
                method: 'POST',
                body: formDataToUpload,
            });

            if (!uploadResponse.ok) {
                const errorText = await uploadResponse.text();
                throw new Error(`Image upload failed: ${uploadResponse.status} ${errorText}`);
            }

            const result = await uploadResponse.json();
            return { url: result.url };
        } catch (error) {
            console.error('ImageKit upload error:', error);
            throw error;
        }
    };
    // --- End ImageKit Specific Logic ---

    // Fetch initial product data
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Authentication required. Please log in.');
            alert('Authentication required. Please log in.');
            navigate('/login');
            setIsLoadingInitialData(false); // Set loading to false if not authenticated
            return;
        }

        setIsLoadingInitialData(true);
        fetch(`http://localhost:6543/api/products/${productId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
        .then(res => {
            if (res.status === 404) {
                throw new Error('Product not found.');
            }
            if (!res.ok) {
                return res.json().then(err => {
                    throw new Error(err.error || err.message || `Failed to fetch product: ${res.statusText}`);
                });
            }
            return res.json();
        })
        .then(data => {
            setProduct(data); // Corrected: set the product state
            // Populate form data with existing product details, matching backend schema names
            setFormData({
                name: data.name || '',
                description: data.description || '',
                price: data.price || '',
                original_price: data.originalPrice || '', // Assumes GET endpoint sends originalPrice
                image_url: data.image || '',             // Assumes GET endpoint sends image
                stock: data.stock || '',
                rating: data.rating || 0,
                sold: data.sold || 0,
            });
            // Set image preview from fetched URL
            setImagePreview(data.image || null);
            setIsLoadingInitialData(false);
            setError(null); // Clear any previous errors if data is loaded successfully
        })
        .catch(e => {
            console.error("Fetch product error:", e);
            setError(e.message); // Corrected: set the error state
            setIsLoadingInitialData(false);
            alert(`Error loading product: ${e.message}`);
        });
    }, [productId, navigate]); // Added navigate to dependency array

    // Handle input changes for form fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (fieldErrors[name]) { // Check against fieldErrors
            setFieldErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    // Form validation logic for saving changes
    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = 'Product name is required';
        else if (formData.name.length < 5) newErrors.name = 'Product name must be at least 5 characters';

        if (!formData.description.trim()) newErrors.description = 'Product description is required';
        else if (formData.description.length < 20) newErrors.description = 'Description must be at least 20 characters';

        if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Valid price is required';

        if (formData.original_price && parseFloat(formData.original_price) <= parseFloat(formData.price))
            newErrors.original_price = 'Original price must be higher than sale price';
        
        // Ensure stock is a valid non-negative number
        const stockValue = parseInt(formData.stock);
        if (isNaN(stockValue) || stockValue < 0) {
            newErrors.stock = 'Stock must be a non-negative number';
        }


        // Check for image only if no current image AND no new file selected
        if (!formData.image_url && !selectedFile) {
            newErrors.images = 'A product image is required.';
        }

        setFieldErrors(newErrors); // Update fieldErrors state
        return Object.keys(newErrors).length === 0;
    };


    // Submit handler for updating product
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            alert('Please correct the form errors before saving.');
            return;
        }

        setIsSubmitting(true);
        setError(null); // Clear general error before submission

        let finalImageUrl = formData.image_url; // Start with current image URL from formData

        try {
            // If a new file is selected, upload it first
            if (selectedFile) {
                console.log('New image selected, uploading to ImageKit:', selectedFile.name);
                const uploadResult = await uploadToImageKit(selectedFile);
                console.log('Image uploaded successfully:', uploadResult.url);
                finalImageUrl = uploadResult.url; // Use the newly uploaded image URL
            } else if (!formData.image_url) {
                // If no new file selected and no existing image URL (should be caught by validateForm, but as a safeguard)
                throw new Error("No product image provided.");
            }

            const productData = {
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                original_price: formData.original_price ? parseFloat(formData.original_price) : null,
                stock: parseInt(formData.stock),
                // Only include rating and sold if you want to allow editing them,
                // otherwise they'd be managed by the backend
                rating: parseFloat(formData.rating),
                sold: parseInt(formData.sold),
                image_url: finalImageUrl, // Send the final image URL
            };

            console.log('Submitting updated product data to backend:', productData);

            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:6543/api/products/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(productData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = errorData.error || (errorData.errors && Object.values(errorData.errors).flat().join(', ')) || 'Failed to update product.';
                throw new Error(errorMessage);
            }

            const updatedProduct = await response.json();
            alert('Product updated successfully!');
            console.log('Updated product:', updatedProduct);
            navigate('/seller?tab=products');

        } catch (err) {
            console.error('Error updating product:', err);
            setError('Update failed: ' + err.message); // Set general error for display
            alert('Error updating product: ' + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Calculate discount percentage for UI
    const getDiscountPercentage = () => {
        if (
            formData.price &&
            formData.original_price &&
            parseFloat(formData.original_price) > parseFloat(formData.price)
        ) {
            return Math.round(
                ((parseFloat(formData.original_price) - parseFloat(formData.price)) /
                    parseFloat(formData.original_price)) *
                100
            );
        }
        return 0;
    };

    // Handle back navigation
    const handleGoBack = () => {
        navigate('/seller?tab=products'); // Navigate back to the products tab
    };

    if (isLoadingInitialData) {
        return (
            <div className="flex justify-center items-center h-full min-h-[500px]">
                <p className="text-lg text-gray-600">Loading product details...</p>
            </div>
        );
    }

    // Use the general 'error' state for top-level error display
    if (error) { // Only show error if an initial product couldn't be loaded at all or a general error occurred
        return (
            <div className="flex justify-center items-center h-full min-h-[500px]">
                <p className="text-lg text-red-600">Error: {error}</p>
            </div>
        );
    }

    // This condition means loading is done, but product is null/undefined, indicating not found/unauthorized
    if (!product && !isLoadingInitialData) {
        return (
            <div className="flex justify-center items-center h-full min-h-[500px]">
                <p className="text-lg text-gray-600">Product not found or access denied.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={handleGoBack}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            aria-label="Go back"
                        >
                            <ArrowLeft size={20} className="text-gray-600" />
                        </button>
                        <div>
                            <h1 className="text-xl font-semibold text-gray-900">Edit Product: {product?.name || 'Loading...'}</h1>
                            <p className="text-gray-500 text-sm mt-1">Update your product listing details</p>
                        </div>
                    </div>
                    <div className="flex space-x-3">
                        <button
                            disabled={isSubmitting}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2 disabled:opacity-50"
                        >
                            <Eye size={16} />
                            <span>Preview</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Form Body */}
            <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Section - Upload & Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Image Upload */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <Camera size={20} className="text-red-600" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Product Images</h2>
                                <p className="text-gray-500 text-sm">Select high-quality images (will upload to ImageKit when saved)</p>
                            </div>
                            <span className="bg-red-50 text-red-600 px-2 py-1 rounded text-xs font-medium">Required</span>
                        </div>

                        <div className="space-y-4">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/jpg,image/png"
                                onChange={handleFileSelect}
                                disabled={isSubmitting}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-red-50 file:text-red-700 hover:file:bg-red-100 cursor-pointer disabled:opacity-50"
                            />

                            {imagePreview && (
                                <div className="mt-4">
                                    <img
                                        src={imagePreview}
                                        alt="Selected product preview"
                                        className="rounded-lg border border-gray-300 max-w-xs max-h-64 object-cover"
                                    />
                                    <p className="text-sm text-gray-600 mt-2">
                                        {selectedFile ?
                                            `New image selected: ${selectedFile.name} (${(selectedFile.size / 1024 / 1024).toFixed(2)} MB)` :
                                            `Current image: ${formData.image_url ? formData.image_url.split('/').pop() : 'N/A'}` // Display filename from URL
                                        }
                                    </p>
                                    <div className="mt-2 flex items-center space-x-2">
                                        {selectedFile ? (
                                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                                                New image ready to upload
                                            </span>
                                        ) : (
                                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                                                Using existing image
                                            </span>
                                        )}
                                        <span className="text-gray-500 text-xs">Will update ImageKit if a new image is selected</span>
                                    </div>
                                </div>
                            )}

                            {!imagePreview && ( // Show placeholder if no image (neither existing nor selected)
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                    <Camera size={48} className="mx-auto text-gray-400 mb-4" />
                                    <p className="text-gray-600">No image selected</p>
                                    <p className="text-gray-400 text-sm">Choose a file to upload</p>
                                </div>
                            )}
                        </div>

                        {fieldErrors.images && ( // Use fieldErrors here
                            <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg mt-4">
                                <AlertCircle size={16} className="text-red-500" />
                                <p className="text-red-600 text-sm">{fieldErrors.images}</p>
                            </div>
                        )}

                        <div className="bg-gray-50 rounded-lg p-4 mt-4">
                            <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                                <Info size={16} className="mr-2 text-gray-600" />
                                Image Guidelines
                            </h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                                <li>• Use .jpg, .jpeg, .png formats with minimum 300x300px resolution</li>
                                <li>• For optimal results, use minimum 700x700px images</li>
                                <li>• Upload 3-5 attractive and different photos</li>
                                <li>• Maximum file size: 10MB per image</li>
                                <li>• Image will be uploaded/updated on ImageKit when you save the product</li>
                            </ul>
                        </div>
                    </div>

                    {/* Product Information */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <Image size={20} className="text-red-600" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Product Information</h2>
                                <p className="text-gray-500 text-sm">Provide detailed product information</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Product Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    maxLength={70}
                                    disabled={isSubmitting}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors disabled:opacity-50 ${
                                        fieldErrors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                    placeholder="e.g., Premium Wireless Bluetooth Headphones"
                                />
                                <div className="flex justify-between mt-1">
                                    {fieldErrors.name ? ( // Use fieldErrors here
                                        <p className="text-red-500 text-sm flex items-center">
                                            <AlertCircle size={14} className="mr-1" />
                                            {fieldErrors.name}
                                        </p>
                                    ) : (
                                        <p className="text-gray-500 text-sm">Use descriptive keywords that buyers would search for</p>
                                    )}
                                    <span className={`text-sm ${formData.name.length > 60 ? 'text-red-500' : 'text-gray-400'}`}>
                                        {formData.name.length}/70
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Product Description <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={6}
                                    maxLength={2000}
                                    disabled={isSubmitting}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors resize-none disabled:opacity-50 ${
                                        fieldErrors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                    placeholder="Describe your product in detail..."
                                />
                                <div className="flex justify-between mt-1">
                                    {fieldErrors.description ? ( // Use fieldErrors here
                                        <p className="text-red-500 text-sm flex items-center">
                                            <AlertCircle size={14} className="mr-1" />
                                            {fieldErrors.description}
                                        </p>
                                    ) : (
                                        <p className="text-gray-500 text-sm">Detailed descriptions help buyers make informed decisions</p>
                                    )}
                                    <span className={`text-sm ${formData.description.length > 1800 ? 'text-red-500' : 'text-gray-400'}`}>
                                        {formData.description.length}/2000
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pricing Section */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <DollarSign size={20} className="text-red-600" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Pricing & Stock</h2>
                                <p className="text-gray-500 text-sm">Set competitive prices and manage inventory</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Sale Price <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">$</span>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        step="0.01"
                                        disabled={isSubmitting}
                                        className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors disabled:opacity-50 ${
                                            fieldErrors.price ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                        }`}
                                        placeholder="0.00"
                                    />
                                </div>
                                {fieldErrors.price && ( // Use fieldErrors here
                                    <p className="mt-1 text-red-500 text-sm flex items-center">
                                        <AlertCircle size={14} className="mr-1" />
                                        {fieldErrors.price}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Original Price
                                    <span className="text-gray-400 text-sm ml-2">(Optional)</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">$</span>
                                    <input
                                        type="number"
                                        name="original_price"
                                        value={formData.original_price}
                                        onChange={handleInputChange}
                                        step="0.01"
                                        disabled={isSubmitting}
                                        className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors disabled:opacity-50 ${
                                            fieldErrors.original_price ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                        }`}
                                        placeholder="0.00"
                                    />
                                </div>
                                {fieldErrors.original_price && ( // Use fieldErrors here
                                    <p className="mt-1 text-red-500 text-sm flex items-center">
                                        <AlertCircle size={14} className="mr-1" />
                                        {fieldErrors.original_price}
                                    </p>
                                )}
                                {getDiscountPercentage() > 0 && (
                                    <div className="mt-2 flex items-center space-x-2">
                                        <span className="bg-red-600 text-white px-2 py-1 rounded text-sm font-medium">
                                            {getDiscountPercentage()}% OFF
                                        </span>
                                        <span className="text-green-600 text-sm">Great discount!</span>
                                    </div>
                                )}
                            </div>

                            {/* Stock Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Stock <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleInputChange}
                                    min="0"
                                    disabled={isSubmitting}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors disabled:opacity-50 ${
                                        fieldErrors.stock ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                    placeholder="e.g., 100"
                                    required
                                />
                                {fieldErrors.stock && ( // Use fieldErrors here
                                    <p className="mt-1 text-red-500 text-sm flex items-center">
                                        <AlertCircle size={14} className="mr-1" />
                                        {fieldErrors.stock}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed transition-colors font-medium"
                        >
                            {isSubmitting ? 'Saving Product...' : 'Save Changes'}
                        </button>
                        <button
                            type="button"
                            onClick={handleGoBack}
                            disabled={isSubmitting}
                            className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                        <div className="flex items-start space-x-3">
                            <div className="p-2 bg-red-100 rounded-lg flex-shrink-0">
                                <Info size={18} className="text-red-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-red-900 mb-3">Best Practices</h3>
                                <ul className="text-sm text-red-800 space-y-2">
                                    <li>• Use high-quality, well-lit product photos</li>
                                    <li>• Write clear, searchable product names</li>
                                    <li>• Provide detailed, honest descriptions</li>
                                    <li>• Set competitive, fair pricing</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {isSubmitting && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                            <div className="flex items-center space-x-3">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                                <div>
                                    <h3 className="font-semibold text-blue-900">Saving in Progress</h3>
                                    <p className="text-blue-800 text-sm mt-1">
                                        {selectedFile ? 'Uploading new image and updating product...' : 'Updating product...'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {error && ( // Display general error from the 'error' state
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                            <div className="flex items-center space-x-3">
                                <AlertCircle size={20} className="text-red-600" />
                                <div>
                                    <h3 className="font-semibold text-red-900">Error!</h3>
                                    <p className="text-red-800 text-sm mt-1">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProductEdit;