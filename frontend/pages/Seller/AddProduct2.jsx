import React, { useState } from 'react';
import {
  ArrowLeft, Save, Eye, Camera, AlertCircle, Info, Image, DollarSign,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { IKContext, IKUpload, IKImage } from 'imagekitio-react';

const publicKey = "public_/G/t0frWoOsGqqQ4fpDh0o8KfiY=";
const urlEndpoint = "https://ik.imagekit.io/wc6bpahhv/";

export default function AddProductForm() {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    original_price: '',
    image_url: '',
    rating: 0.0,
    sold: 0,
  });

  // Validation errors
  const [errors, setErrors] = useState({});

  // Draft flag
  const [isDraft, setIsDraft] = useState(false);

  // Async authenticator function for ImageKit
  const authenticator = async () => {
    try {
      const response = await fetch("http://localhost:6543/api/imagekit/auth");
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Request failed with status ${response.status}: ${errorText}`);
      }
      const data = await response.json();
      const { signature, expire, token } = data;
      return { signature, expire, token };
    } catch (error) {
      console.error("Authentication request failed:", error);
      throw error;
    }
  };

  // Handle input changes for form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Form validation logic
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    else if (formData.name.length < 5) newErrors.name = 'Product name must be at least 5 characters';

    if (!formData.description.trim()) newErrors.description = 'Product description is required';
    else if (formData.description.length < 20) newErrors.description = 'Description must be at least 20 characters';

    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Valid price is required';

    if (formData.original_price && parseFloat(formData.original_price) <= parseFloat(formData.price))
      newErrors.original_price = 'Original price must be higher than sale price';

    if (!formData.image_url) newErrors.images = 'At least 1 product image is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handler
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const res = await fetch('http://localhost:6543/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          original_price: formData.original_price ? parseFloat(formData.original_price) : null,
          image_url: formData.image_url,
          rating: formData.rating,
          sold: formData.sold,
        }),
      });

      if (res.ok) {
        alert('Product successfully added!');
        // Optionally reset or redirect here
      } else {
        alert('Failed to add product');
      }
    } catch (err) {
      alert('Error submitting product: ' + err.message);
    }
  };

  // Save draft handler
  const handleSaveAsDraft = () => {
    setIsDraft(true);
    alert('Product saved as draft!');
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/seller')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Add New Product</h1>
              <p className="text-gray-500 text-sm mt-1">Create and publish your product listing</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleSaveAsDraft}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <Save size={16} />
              <span>Save Draft</span>
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
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
                  <p className="text-gray-500 text-sm">Upload high-quality images</p>
                </div>
                <span className="bg-red-50 text-red-600 px-2 py-1 rounded text-xs font-medium">Required</span>
              </div>

              <IKContext
                publicKey={publicKey}
                urlEndpoint={urlEndpoint}
                authenticator={authenticator}
                transformationPosition="path"
              >
                {!formData.image_url && (
                  <IKImage
                    path="/default-image.jpg"
                    transformation={[{ height: '300', width: '400' }]}
                  />
                )}

                <IKUpload
                  fileName={`product-image-${Date.now()}`}
                  onSuccess={(res) => {
                    setFormData(prev => ({ ...prev, image_url: res.url }));
                    setErrors(prev => ({ ...prev, images: '' }));
                  }}
                  onError={(err) => {
                    console.error('Image upload error:', err);
                    setErrors(prev => ({ ...prev, images: 'Image upload failed. Please try again.' }));
                  }}
                  className="cursor-pointer px-4 py-2 border border-dashed border-gray-300 rounded-lg text-center text-gray-600 hover:border-red-600 hover:text-red-600 transition-colors"
                />
              </IKContext>

              {formData.image_url && (
                <img
                  src={`${formData.image_url}?tr=w-300,h-300,fo-auto`}
                  alt="Uploaded product preview"
                  className="mt-4 rounded-lg border border-gray-300 max-w-xs"
                />
              )}

              {errors.images && (
                <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg mt-4">
                  <AlertCircle size={16} className="text-red-500" />
                  <p className="text-red-600 text-sm">{errors.images}</p>
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
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${
                    errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Premium Wireless Bluetooth Headphones"
                />
                <div className="flex justify-between mt-1">
                  {errors.name ? (
                    <p className="text-red-500 text-sm flex items-center">
                      <AlertCircle size={14} className="mr-1" />
                      {errors.name}
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
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors resize-none ${
                    errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Describe your product in detail..."
                />
                <div className="flex justify-between mt-1">
                  {errors.description ? (
                    <p className="text-red-500 text-sm flex items-center">
                      <AlertCircle size={14} className="mr-1" />
                      {errors.description}
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
                <h2 className="text-lg font-semibold text-gray-900">Pricing</h2>
                <p className="text-gray-500 text-sm">Set competitive prices for your product</p>
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
                    className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${
                      errors.price ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                  />
                </div>
                {errors.price && (
                  <p className="mt-1 text-red-500 text-sm flex items-center">
                    <AlertCircle size={14} className="mr-1" />
                    {errors.price}
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
                    className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${
                      errors.original_price ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                  />
                </div>
                {errors.original_price && (
                  <p className="mt-1 text-red-500 text-sm flex items-center">
                    <AlertCircle size={14} className="mr-1" />
                    {errors.original_price}
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
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleSubmit}
              className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Publish Product
            </button>
            <button
              onClick={handleSaveAsDraft}
              className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Save as Draft
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
        </div>
      </div>
    </div>
  );
}
