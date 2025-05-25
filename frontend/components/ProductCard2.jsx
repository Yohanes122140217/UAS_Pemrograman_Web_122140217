import { Link } from 'react-router-dom';

export default function ProductCard({ id, name, image_url, price, original_price, rating = 0, sold = 0 }) {
  const discount = original_price
    ? Math.round(((original_price - price) / original_price) * 100)
    : 0;

  return (
    <Link to={`/product/${id}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition transform hover:scale-[1.02] hover:shadow-lg">
        <div className="relative h-48 bg-gray-200">
          <img
            src={image_url || '/api/placeholder/300/200'}
            alt={name}
            className="w-full h-full object-cover"
          />
          {discount > 0 && (
            <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">
              {discount}% OFF
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-gray-800 font-medium text-sm mb-1 group-hover:text-red-600 line-clamp-2">
            {name}
          </h3>
          <div className="flex items-baseline mt-1 space-x-2">
            <p className="text-red-600 font-semibold">${price.toFixed(2)}</p>
            {original_price && (
              <p className="text-gray-400 text-xs line-through">${original_price.toFixed(2)}</p>
            )}
          </div>
          <div className="flex items-center mt-2 text-xs text-gray-500">
            <span className="text-yellow-400 mr-1">★</span>
            <span>{rating.toFixed(1)}</span>
            <span className="mx-2">•</span>
            <span>{sold} sold</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
