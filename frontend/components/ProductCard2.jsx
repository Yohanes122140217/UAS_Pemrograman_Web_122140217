import { Image } from '@imagekit/react';
import { Link } from 'react-router-dom';

const IMAGE_WIDTH = 300;
const IMAGE_HEIGHT = 200;

export default function ProductCard2({
  id,
  name,
  image_url,
  price,
  original_price,
  rating = 0,
  sold = 0,
  seller = "Unknown",
}) {
  const discount = original_price
    ? Math.round(((original_price - price) / original_price) * 100)
    : 0;

  const validImage = image_url && image_url.trim() !== "" ? image_url : "/default-image.jpg";

  return (
    <Link to={`/product/${id}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition transform hover:scale-[1.02] hover:shadow-lg">
        <div className="relative h-48 bg-gray-200">
          <Image
            urlEndpoint="https://ik.imagekit.io/wc6bpahhv"
            src={validImage}
            width={IMAGE_WIDTH}
            height={IMAGE_HEIGHT}
            alt={name}
            loading="lazy"
            className="w-full h-full object-cover"
            transformation={[{ width: IMAGE_WIDTH, height: IMAGE_HEIGHT }]}
          />
          {discount > 0 && (
            <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">
              {discount}% OFF
            </div>
          )}
        </div>
        <div className="p-4 flex flex-col">
          <h3 className="text-gray-800 font-semibold text-sm mb-1 group-hover:text-red-600 line-clamp-2">
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
          <p className="mt-auto text-xs text-gray-600 pt-3">
            <span className="font-medium">{seller}</span>
          </p>
        </div>
      </div>
    </Link>
  );
}
