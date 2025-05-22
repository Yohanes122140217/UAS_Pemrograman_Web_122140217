// This is a higher-order component that adds sections to the page
import { useState } from 'react';

function SectionContainer({ title, viewAllLink, children, className = '' }) {
  return (
    <div className={`mb-8 ${className}`}>
      {title && (
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          {viewAllLink && (
            <a 
              href={viewAllLink} 
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              View All
            </a>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

// Banner component
function Banner({ image, title, description, buttonText, buttonLink }) {
  return (
    <div className="relative rounded-lg overflow-hidden h-64 md:h-80">
      <img 
        src={image || "/api/placeholder/1200/400"} 
        alt={title} 
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
        <div className="text-white p-6 md:p-10 max-w-lg">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">{title}</h2>
          <p className="mb-4 text-sm md:text-base">{description}</p>
          {buttonText && (
            <a 
              href={buttonLink} 
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded inline-block transition"
            >
              {buttonText}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// Category pill component
function CategoryPill({ name, icon, link }) {
  return (
    <a 
      href={link} 
      className="flex flex-col items-center justify-center px-4 py-3 rounded-lg bg-white shadow-sm hover:shadow-md transition border border-gray-100"
    >
      <div className="text-2xl mb-1">{icon}</div>
      <span className="text-xs font-medium text-gray-700">{name}</span>
    </a>
  );
}

// Badge component
function Badge({ text, variant = 'default' }) {
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-red-100 text-red-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
  };
  
  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${variantClasses[variant] || variantClasses.default}`}>
      {text}
    </span>
  );
}

// Rating component
function Rating({ value, max = 5 }) {
  return (
    <div className="flex items-center">
      {[...Array(max)].map((_, i) => (
        <span 
          key={i} 
          className={`text-lg ${i < value ? 'text-yellow-400' : 'text-gray-300'}`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

// Button component
function Button({ children, variant = 'primary', className = '', ...props }) {
  const variantClasses = {
    primary: 'bg-red-600 hover:bg-red-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    outline: 'bg-white hover:bg-gray-50 text-red-600 border border-red-600',
  };
  
  return (
    <button 
      className={`px-4 py-2 rounded font-medium transition ${variantClasses[variant] || variantClasses.primary} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

// Quantity selector
function QuantitySelector({ value, onChange, min = 1, max = 99 }) {
  const decrease = () => {
    if (value > min) onChange(value - 1);
  };
  
  const increase = () => {
    if (value < max) onChange(value + 1);
  };
  
  return (
    <div className="flex items-center border border-gray-300 rounded">
      <button 
        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition"
        onClick={decrease}
      >
        -
      </button>
      <input 
        type="text" 
        value={value} 
        className="w-12 text-center border-none focus:outline-none"
        readOnly
      />
      <button 
        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition"
        onClick={increase}
      >
        +
      </button>
    </div>
  );
}

// Export all components
export { 
  SectionContainer, 
  Banner, 
  CategoryPill, 
  Badge, 
  Rating, 
  Button,
  QuantitySelector
};