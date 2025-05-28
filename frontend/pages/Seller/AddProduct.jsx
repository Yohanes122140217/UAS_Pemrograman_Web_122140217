import React, { useState, useRef } from 'react';
import {
  ArrowLeft, Save, Eye, Camera, AlertCircle, Info, Image, DollarSign,
} from 'lucide-react';

// ImageKit configuration (replace with your actual credentials)
const publicKey = "public_/G/t0frWoOsGqqQ4fpDh0o8KfiY=";
const urlEndpoint = "https://ik.imagekit.io/wc6bpahhv/";

export default function AddProductForm() {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    original_price: '',
    rating: 0,
    sold: 0,
  });

  // Store selected file without uploading
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  // Validation errors
  const [errors, setErrors] = useState({});

  // Loading state
  const [isPublishing, setIsPublishing] = useState(false);

  // ImageKit upload result URL
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');

  // Real authenticator function for ImageKit
  const authenticator = async () => {
    try {
      const response = await fetch("http://localhost:6543/api/imagekit/auth");
      if (!response.ok) throw new Error('Authentication failed');
      const data = await response.json();
      return {
        signature: data.signature,
        expire: data.expire,
        token: data.token,
      };
    } catch (error) {
      console.error('Authentication error:', error);
      throw error;
    }
  };

  // Handle file selection (without uploading)
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type and size
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, images: 'Please select a valid image file (.jpg, .jpeg, .png)' }));
        return;
      }

      if (file.size > maxSize) {
        setErrors(prev => ({ ...prev, images: 'File size must be less than 10MB' }));
        return;
      }

      setSelectedFile(file);
      
      // Create preview URL
      const previewURL = URL.createObjectURL(file);
      setImagePreview(previewURL);
      
      // Clear any previous errors
      setErrors(prev => ({ ...prev, images: '' }));
    }
  };

  // Upload image to ImageKit using native fetch
  const uploadToImageKit = async (file) => {
    try {
      // Get authentication details
      const authDetails = await authenticator();
      
      // Create FormData for upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', `product-image-${Date.now()}`);
      formData.append('publicKey', publicKey);
      formData.append('signature', authDetails.signature);
      formData.append('expire', authDetails.expire);
      formData.append('token', authDetails.token);

      // Upload to ImageKit
      const uploadResponse = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Image upload failed');
      }

      const result = await uploadResponse.json();
      return { url: result.url };
    } catch (error) {
      console.error('ImageKit upload error:', error);
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

    if (!selectedFile) newErrors.images = 'At least 1 product image is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handler with real ImageKit upload
  const handleSubmit = async () => {
    if (!validateForm()) return;
    if (!selectedFile) return; // safety check

    setIsPublishing(true);

    try {
      // First upload the image to ImageKit
      console.log('Uploading image to ImageKit:', selectedFile.name);
      const uploadResult = await uploadToImageKit(selectedFile);
      console.log('Image uploaded successfully:', uploadResult.url);
      setUploadedImageUrl(uploadResult.url);
      
      // Then submit the product with the uploaded image URL
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        original_price: formData.original_price ? parseFloat(formData.original_price) : null,
        rating: parseFloat(formData.rating),
        sold: parseInt(formData.sold),
        image_url: uploadResult.url,
      };

      console.log('Submitting product data to backend:', productData);
      
      // Submit to your backend API
      const response = await fetch('http://localhost:6543/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        alert('Product successfully added!');
        
        // Reset form
        setFormData({
          name: '',
          description: '',
          price: '',
          original_price: '',
          rating: 0,
          sold: 0,
        });
        setSelectedFile(null);
        setImagePreview(null);
        setUploadedImageUrl('');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        throw new Error('Failed to add product');
      }
    } catch (err) {
      console.error('Error:', err);
      setErrors(prev => ({ ...prev, images: 'Upload failed. Please try again.' }));
      alert('Error publishing product: ' + err.message);
    } finally {
      setIsPublishing(false);
    }
  };

  // Save draft handler
  const handleSaveAsDraft = () => {
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

  // Handle back navigation
  const handleGoBack = () => {
    // You can implement navigation logic here
    // For demo, just show alert
    alert('Going back to seller dashboard');
  };

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
              <h1 className="text-xl font-semibold text-gray-900">Add New Product</h1>
              <p className="text-gray-500 text-sm mt-1">Create and publish your product listing</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleSaveAsDraft}
              disabled={isPublishing}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              <Save size={16} />
              <span>Save Draft</span>
            </button>
            <button 
              disabled={isPublishing}
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
                <p className="text-gray-500 text-sm">Select high-quality images (will upload to ImageKit when published)</p>
              </div>
              <span className="bg-red-50 text-red-600 px-2 py-1 rounded text-xs font-medium">Required</span>
            </div>

            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleFileSelect}
                disabled={isPublishing}
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
                    Image selected: {selectedFile?.name} ({(selectedFile?.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                  <div className="mt-2 flex items-center space-x-2">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                      Ready to upload
                    </span>
                    <span className="text-gray-500 text-xs">Will upload to ImageKit when you publish</span>
                  </div>
                </div>
              )}

              {!selectedFile && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Camera size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No image selected</p>
                  <p className="text-gray-400 text-sm">Choose a file to see preview</p>
                </div>
              )}
            </div>

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
                <li>• Images will be uploaded to ImageKit when you publish the product</li>
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
                  disabled={isPublishing}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors disabled:opacity-50 ${
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
                  disabled={isPublishing}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors resize-none disabled:opacity-50 ${
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
                    disabled={isPublishing}
                    className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors disabled:opacity-50 ${
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
                    disabled={isPublishing}
                    className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors disabled:opacity-50 ${
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
              disabled={isPublishing}
              className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isPublishing ? 'Publishing Product...' : 'Publish Product'}
            </button>
            <button
              onClick={handleSaveAsDraft}
              disabled={isPublishing}
              className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
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

          {isPublishing && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                <div>
                  <h3 className="font-semibold text-blue-900">Publishing in Progress</h3>
                  <p className="text-blue-800 text-sm mt-1">
                    {selectedFile ? 'Uploading image to ImageKit and creating product...' : 'Creating product...'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {uploadedImageUrl && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                  <Image size={18} className="text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-900 mb-2">Image Uploaded Successfully</h3>
                  <p className="text-green-800 text-sm">
                    Your image has been uploaded to ImageKit and is ready for use.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}