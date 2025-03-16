// app/components/product/ProductCard.tsx
import { useState } from 'react';
import { Link } from '@remix-run/react';
import { Eye, ShoppingCart, Heart } from 'lucide-react';
import type { Product } from '~/types';
import { Card } from '~/components/ui/Card';
import { formatPrice, truncateText } from '~/lib/utils';
import { Button } from '~/components/ui/Button';
import { useCart } from '~/context/CartContext';
import { StarIcon } from '~/components/icons';

interface ProductCardProps {
  product: Product;
  className?: string;
  featured?: boolean;
}

export function ProductCard({ product, className = '', featured = false }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { addItem } = useCart();
  
  // Get primary image or use placeholder
  const primaryImage = product.images && product.images.length > 0 ? product.images[0] : {
    url: 'https://via.placeholder.com/400x500?text=No+Image',
    altText: product.title,
    width: 400,
    height: 500,
  };
  
  // Get second image for hover effect if available
  const secondaryImage = product.images && product.images.length > 1 ? product.images[1] : primaryImage;

  // Get primary variant for pricing
  const primaryVariant = product.variants[0];
  const price = primaryVariant?.price.amount || '0.00';
  const compareAtPrice = primaryVariant?.compareAtPrice?.amount;
  
  // Calculate discount percentage if there's a compareAtPrice
  const discountPercentage = compareAtPrice && parseFloat(compareAtPrice) > parseFloat(price) 
    ? Math.round(((parseFloat(compareAtPrice) - parseFloat(price)) / parseFloat(compareAtPrice)) * 100)
    : null;
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product.availableForSale && primaryVariant) {
      addItem(product, primaryVariant, 1);
    }
  };

  // For debugging
  console.log(`ProductCard for ${product.title}:`, { 
    primaryImageUrl: primaryImage.url,
    secondaryImageUrl: secondaryImage.url,
    hasImages: product.images?.length > 0
  });

  return (
    <Card 
      className={`group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${featured ? 'border-terracotta' : ''} ${className}`}
    >
      <Link 
        to={`/products/${product.handle}`} 
        prefetch="intent"
        className="block"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={() => setIsHovered(true)}
        onTouchEnd={() => setIsHovered(false)}
      >
        <div className="relative overflow-hidden aspect-[3/4]">
          {/* Product Image with hover effect */}
          <div className="absolute inset-0 w-full h-full transition-opacity duration-500">
            <img
              src={primaryImage.url}
              alt={primaryImage.altText || product.title}
              className={`h-full w-full object-cover transition-opacity duration-500 ${isHovered ? 'opacity-0' : 'opacity-100'}`}
              loading="lazy"
              onError={(e) => {
                // Fallback if image fails to load
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x500?text=Image+Not+Found';
              }}
            />
          </div>
          
          {/* Secondary image that appears on hover */}
          <div className="absolute inset-0 w-full h-full">
            <img
              src={secondaryImage.url}
              alt={secondaryImage.altText || `${product.title} alternate view`}
              className={`h-full w-full object-cover transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
              loading="lazy"
              onError={(e) => {
                // Fallback if image fails to load
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x500?text=Image+Not+Found';
              }}
            />
          </div>
          
          {/* Sale tag */}
          {discountPercentage && (
            <div className="absolute top-3 left-3 bg-terracotta text-ivory px-2 py-1 text-xs font-medium rounded-md shadow-sm">
              {discountPercentage}% OFF
            </div>
          )}

          {/* Sold out tag */}
          {!product.availableForSale && (
            <div className="absolute top-3 right-3 bg-offblack/80 text-ivory px-3 py-1 text-xs font-medium rounded-md">
              Sold Out
            </div>
          )}
          
          {/* Featured tag */}
          {featured && (
            <div className="absolute top-3 right-3 bg-beige text-offblack px-3 py-1 text-xs font-medium rounded-md flex items-center">
              <StarIcon className="h-3 w-3 mr-1" />
              Featured
            </div>
          )}
          
          {/* Quick action buttons that appear on hover */}
          <div className={`absolute bottom-0 left-0 right-0 p-3 flex justify-center space-x-2 bg-gradient-to-t from-offblack/80 to-transparent transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <button 
              className="p-2 bg-ivory rounded-full text-offblack hover:bg-beige transition-colors"
              aria-label="Quick view"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // Quick view functionality would go here
              }}
            >
              <Eye className="h-4 w-4" />
            </button>
            
            <button 
              className={`p-2 rounded-full text-offblack transition-colors ${
                !product.availableForSale 
                ? 'bg-ivory/60 cursor-not-allowed' 
                : 'bg-ivory hover:bg-beige'
              }`}
              aria-label="Add to cart"
              disabled={!product.availableForSale}
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4" />
            </button>
            
            <button 
              className="p-2 bg-ivory rounded-full text-offblack hover:bg-beige transition-colors"
              aria-label="Add to wishlist"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // Wishlist functionality would go here
              }}
            >
              <Heart className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <div className="p-4">
          {/* Product vendor */}
          <p className="text-sm text-muted-foreground mb-1">{product.vendor}</p>
          
          {/* Product title */}
          <h3 className="font-medium text-base mb-2 transition-colors group-hover:text-terracotta">
            {truncateText(product.title, 50)}
          </h3>
          
          {/* Pricing */}
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold">{formatPrice(price)}</span>
            {compareAtPrice && parseFloat(compareAtPrice) > parseFloat(price) && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(compareAtPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </Card>
  );
}