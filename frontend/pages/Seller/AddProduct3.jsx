import React, { useState } from 'react';
import { ArrowLeft, Save, Eye, Camera, AlertCircle, Info, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { IKContext, IKUpload, IKImage } from 'imagekitio-react';

const publicKey = "public_/G/t0frWoOsGqqQ4fpDh0o8KfiY=";
const urlEndpoint = "https://ik.imagekit.io/wc6bpahhv/";

export default function AddProductForm3() {
  const navigate = useNavigate();

  // Form state except image_url
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    original_price: '',
    rating: 0,
    sold: 0,
  });

  // Selected file for local preview (not uploaded yet)
  const [selectedFile, setSelectedFile] = useState(null);

  // Validation errors
  const [errors, setErrors] = useState({});

  // ImageKit upload result URL
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');

  // Uploading indicator
  const [uploading, setUploading] = useState(false);

  // Async authenticator function for ImageKit upload
  const authenticator = async () => {
    const response = await fetch("http://localhost:6543/api/imagekit/auth");
    if (!response.ok) throw new Error('Authentication failed');
    const data = await response.json();
    return {
      signature: data.signature,
      expire: data.expire,
      token: data.token,
    };
  };

  // Handle input changes for form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // Handle file selection, only store locally
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setErrors(prev => ({ ...prev, images: '' }));
    }
  };

  // Validate form fields including local file selected
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    else if (formData.name.length < 5) newErrors.name = 'At least 5 characters required for name';

    if (!formData.description.trim()) newErrors.description = 'Description is required';
    else if (formData.description.length < 20) newErrors.description = 'At least 20 characters required for description';

    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Valid price is required';

    if (formData.original_price && parseFloat(formData.original_price) <= parseFloat(formData.price))
      newErrors.original_price = 'Original price must be higher than sale price';

    if (!selectedFile) newErrors.images = 'Product image is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Called on successful image upload
  const onUploadSuccess = (res) => {
    setUploading(false);
    setUploadedImageUrl(res.url);

    // After successful upload, submit product data to backend
    fetch('http://localhost:6543/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        price: parseFloat(formData.price),
        original_price: formData.original_price ? parseFloat(formData.original_price) : null,
        rating: parseFloat(formData.rating),
        sold: parseInt(formData.sold),
        image_url: res.url,
      }),
    }).then(res => {
      if (res.ok) {
        alert('Product successfully added!');
        // Reset form & state
        setFormData({
          name: '',
          description: '',
          price: '',
          original_price: '',
          rating: 0,
          sold: 0,
        });
        setSelectedFile(null);
        setUploadedImageUrl('');
      } else {
        alert('Failed to add product');
      }
    }).catch(err => {
      alert('Failed to add product: ' + err.message);
    });
  };

  // Called on upload error
  const onUploadError = (err) => {
    setUploading(false);
    setErrors(prev => ({ ...prev, images: 'Image upload failed. Please try again.' }));
    console.error('Image upload error:', err);
  };

  // On publish, start upload
  const handleSubmit = () => {
    if (!validateForm()) return;
    if (!selectedFile) return; // safety check

    setUploading(true);
  };

  // Save draft handler
  const handleSaveAsDraft = () => {
    setIsDraft(true);
    alert('Product saved as draft!');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <button onClick={() => navigate('/seller')} aria-label="Go back" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-semibold">Add New Product</h1>
          <p className="text-gray-500 text-sm">Create and publish your product listing</p>
        </div>
      </div>

      {/* Image preview and upload */}
      <div className="mb-6 bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center space-x-3 mb-4">
          <Camera size={20} className="text-red-600" />
          <h2 className="text-lg font-semibold">Product Image</h2>
          <span className="bg-red-50 text-red-600 px-2 py-1 rounded text-xs font-medium">Required</span>
        </div>

        {selectedFile ? (
          <img
            src={URL.createObjectURL(selectedFile)}
            alt="Selected preview"
            className="w-48 h-48 object-cover rounded-md border border-gray-300 mb-4"
          />
        ) : (
          <div className="w-48 h-48 flex items-center justify-center bg-gray-100 rounded-md border border-gray-300 mb-4 text-gray-400">
            No image selected
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mb-4"
          disabled={uploading}
        />

        {errors.images && (
          <p className="text-red-600 text-sm flex items-center">
            <AlertCircle size={16} className="mr-1" />
            {errors.images}
          </p>
        )}
      </div>

      {/* Product info inputs */}
      <div className="mb-6 bg-white rounded-lg border border-gray-200 p-4 space-y-4">
        <label className="block text-sm font-medium">
          Product Name <span className="text-red-500">*</span>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
            placeholder="e.g., Premium Wireless Bluetooth Headphones"
            disabled={uploading}
          />
          {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
        </label>

        <label className="block text-sm font-medium">
          Description <span className="text-red-500">*</span>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
            rows={4}
            placeholder="Detailed product description"
            disabled={uploading}
          />
          {errors.description && <p className="text-red-600 text-xs mt-1">{errors.description}</p>}
        </label>

        <label className="block text-sm font-medium">
          Sale Price ($) <span className="text-red-500">*</span>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
            step="0.01"
            disabled={uploading}
          />
          {errors.price && <p className="text-red-600 text-xs mt-1">{errors.price}</p>}
        </label>

        <label className="block text-sm font-medium">
          Original Price ($)
          <input
            type="number"
            name="original_price"
            value={formData.original_price}
            onChange={handleInputChange}
            className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
            step="0.01"
            disabled={uploading}
          />
          {errors.original_price && <p className="text-red-600 text-xs mt-1">{errors.original_price}</p>}
        </label>
      </div>

      {/* Publish and Draft buttons */}
      <div className="flex space-x-4">
        <button
          onClick={handleSubmit}
          disabled={uploading}
          className={`px-6 py-2 rounded text-white font-medium ${
            uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
          }`}
        >
          {uploading ? 'Uploading...' : 'Publish Product'}
        </button>
        <button
          onClick={handleSaveAsDraft}
          disabled={uploading}
          className="px-6 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
        >
          Save as Draft
        </button>
      </div>

      {/* Hidden IKUpload to do actual upload on Publish */}
      {uploading && (
        <IKContext
          publicKey={publicKey}
          urlEndpoint={urlEndpoint}
          authenticator={authenticator}
        >
          <IKUpload
            fileName={`product-image-${Date.now()}`}
            file={selectedFile}
            onSuccess={onUploadSuccess}
            onError={onUploadError}
          />
        </IKContext>
      )}
    </div>
  );
}
