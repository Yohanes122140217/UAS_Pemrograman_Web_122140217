import { useState } from 'react';
import { ArrowLeft, Upload, X, Save, Eye, Camera, AlertCircle, Info, Star, TrendingUp, Image, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { IKContext, IKUpload } from 'imagekitio-react';

export default function AddProductForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    original_price: '',
    image_url: '',
    rating: 0.0,
    sold: 0
  });
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [isDraft, setIsDraft] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImages(prev => [...prev, {
          id: Date.now() + Math.random(),
          url: e.target.result,
          file: file
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImages(prev => [...prev, {
            id: Date.now() + Math.random(),
            url: e.target.result,
            file: file
          }]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (imageId) => {
    setImages(prev => prev.filter(img => img.id !== imageId));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    } else if (formData.name.length < 5) {
      newErrors.name = 'Product name must be at least 5 characters';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Product description is required';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }
    
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }
    
    if (formData.original_price && parseFloat(formData.original_price) <= parseFloat(formData.price)) {
      newErrors.original_price = 'Original price must be higher than sale price';
    }

    if (images.length === 0) {
      newErrors.images = 'At least 1 product image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log('Form submitted:', { ...formData, images });
      alert('Product successfully added!');
    }
  };

  const handleSaveAsDraft = () => {
    setIsDraft(true);
    console.log('Saved as draft:', { ...formData, images });
    alert('Product saved as draft!');
  };

  const getDiscountPercentage = () => {
    if (formData.price && formData.original_price && parseFloat(formData.original_price) > parseFloat(formData.price)) {
      return Math.round(((parseFloat(formData.original_price) - parseFloat(formData.price)) / parseFloat(formData.original_price)) * 100);
    }
    return 0;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Professional Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft size={20} className="text-gray-600"  onClick={() => navigate('/seller')} />
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
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Photo Upload */}
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
              
              <div className="grid grid-cols-5 gap-4 mb-6">
                {images.map((image, index) => (
                  <div key={image.id} className="relative aspect-square border border-gray-200 rounded-lg overflow-hidden group">
                    <img src={image.url} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                    <button
                      onClick={() => removeImage(image.id)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-md z-10"
                    >
                      <X size={12} />
                    </button>
                    {index === 0 && (
                      <div className="absolute bottom-2 left-2 bg-gray-900 text-white text-xs px-2 py-1 rounded font-medium">
                        Main
                      </div>
                    )}
                  </div>
                ))}
                
                {images.length < 5 && (
                  <div 
                    className={`aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${
                      dragOver ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:border-red-400'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer text-center p-4">
                      <div className="p-2 bg-gray-100 rounded-lg mb-2 mx-auto w-fit">
                        <Upload size={20} className="text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-600 mb-1">Add Photo</p>
                      <p className="text-xs text-gray-400">or drag & drop</p>
                    </label>
                  </div>
                )}
              </div>
              
              {errors.images && (
                <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
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
                    placeholder="Describe your product in detail...
                      • Key features and benefits
                      • Materials and specifications
                      • Size and dimensions
                      • Care instructions
                      • What's included in the package"
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

            {/* Pricing */}
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

            {/* Additional Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-red-100 rounded-lg">
                  <TrendingUp size={20} className="text-red-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Additional Information</h2>
                  <p className="text-gray-500 text-sm">Optional details to enhance your listing</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Initial Rating
                    <span className="text-gray-400 text-sm ml-2">(0.0 - 5.0)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="rating"
                      value={formData.rating}
                      onChange={handleInputChange}
                      step="0.1"
                      min="0"
                      max="5"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                      placeholder="0.0"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={14}
                          className={`${
                            star <= Math.floor(formData.rating) 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Units Sold
                  </label>
                  <input
                    type="number"
                    name="sold"
                    value={formData.sold}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    placeholder="0"
                  />
                  <p className="mt-1 text-gray-500 text-sm">Higher sold count builds customer trust</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tips Card */}
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

            {/* Action Buttons */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
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
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-600 leading-relaxed">
                    By publishing this product, you agree to our <a href="#" className="text-red-600 hover:text-red-700">Terms of Service</a> and <a href="#" className="text-red-600 hover:text-red-700">Seller Guidelines</a>
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Completion Progress</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Product Images</span>
                  <span className={`text-sm font-medium ${images.length > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                    {images.length > 0 ? '✓' : '○'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Product Name</span>
                  <span className={`text-sm font-medium ${formData.name.length >= 5 ? 'text-green-600' : 'text-gray-400'}`}>
                    {formData.name.length >= 5 ? '✓' : '○'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Description</span>
                  <span className={`text-sm font-medium ${formData.description.length >= 20 ? 'text-green-600' : 'text-gray-400'}`}>
                    {formData.description.length >= 20 ? '✓' : '○'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Price</span>
                  <span className={`text-sm font-medium ${formData.price && parseFloat(formData.price) > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                    {formData.price && parseFloat(formData.price) > 0 ? '✓' : '○'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}