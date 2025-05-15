import { ShoppingBag, Search, ArrowLeft, Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-md w-full mx-auto">
        <div className="text-center">
          {/* 404 Icon */}
          <div className="mb-8 flex justify-center">
            <div className="h-32 w-32 rounded-full bg-red-100 flex items-center justify-center">
              <ShoppingBag size={64} className="text-red-600" />
            </div>
          </div>

          {/* 404 Message */}
          <h1 className="text-6xl font-extrabold text-red-600 mb-2">404</h1>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h2>
          <p className="text-xl text-gray-600 mb-8">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-xs mx-auto mb-8">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={20} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="w-full py-3 pl-10 pr-4 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Search our store..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <Home size={18} className="mr-2" />
              Back to Home
            </a>
            <a 
              href="/help"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <ArrowLeft size={18} className="mr-2" />
              Help Center
            </a>
          </div>
        </div>

        {/* Suggested Pages */}
        <div className="mt-12">
          <h3 className="text-lg font-medium text-gray-900 mb-4">You might be looking for:</h3>
          <div className="space-y-3">
            <SuggestedLink to="/" text="Homepage" />
            <SuggestedLink to="/categories" text="Product Categories" />
            <SuggestedLink to="/flash-sale" text="Flash Sales & Deals" />
            <SuggestedLink to="/account/orders" text="Your Orders" />
          </div>
        </div>

        {/* Support Contact */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Need assistance? Contact our{' '}
            <a href="/help" className="text-red-600 font-medium hover:text-red-500">
              support team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

function SuggestedLink({ to, text }) {
  return (
    <a 
      href={to}
      className="flex items-center p-3 bg-white border border-gray-200 rounded-lg hover:bg-red-50 hover:border-red-200 transition-colors"
    >
      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-3">
        <ChevronRight />
      </div>
      <span className="font-medium text-gray-800">{text}</span>
    </a>
  );
}

function ChevronRight() {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className="w-4 h-4 text-red-600"
    >
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  );
}