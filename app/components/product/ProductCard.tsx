// app/components/product/ProductCard.tsx
import { useState, useEffect } from 'react';
import { Link } from '@remix-run/react';
import { Eye, ShoppingCart, Heart } from 'lucide-react';
import type { Product } from '~/types';
import { Card } from '~/components/ui/Card';
import { formatPrice, truncateText } from '~/lib/utils';
import { useCart } from '~/context/CartContext';
import { StarIcon } from '~/components/icons';

interface ProductCardProps {
  product: Product;
  className?: string;
  featured?: boolean;
}

// Create a map of product types to reliable image URLs
const RELIABLE_IMAGES = {
  'Home Decor': 'https://via.placeholder.com/400x500/f0e6dd/1e293b?text=Home+Decor',
  'Wall Art': 'https://via.placeholder.com/400x500/e6e2f0/1e293b?text=Wall+Art',
  'Kitchen & Dining': 'https://via.placeholder.com/400x500/e2f0e6/1e293b?text=Kitchen+Dining',
  'Jewelry': 'https://via.placeholder.com/400x500/f0e2e6/1e293b?text=Jewelry',
  'default': 'https://via.placeholder.com/400x500/e2e8f0/1e293b?text=Product+Image'
};

export function ProductCard({ product, className = '', featured = false }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [primaryImageSrc, setPrimaryImageSrc] = useState('');
  const { addItem } = useCart();
  
  // Set up reliable image sources
  useEffect(() => {
    // Get primary image from product or use reliable placeholder
    const productType = product.productType || 'default';
    const reliableImage = RELIABLE_IMAGES[productType as keyof typeof RELIABLE_IMAGES] || RELIABLE_IMAGES.default;
    
    // If product has images, use the first one, otherwise use placeholder
    if (product.images && product.images.length > 0) {
      setPrimaryImageSrc(product.images[0].url);
    } else {
      setPrimaryImageSrc(reliableImage);
    }
  }, [product]);
  
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

  return (
    <Card 
      className={`group overflow-hidden border border-border hover:shadow-md ${featured ? 'border-terracotta' : ''} ${className}`}
    >
      <Link 
        to={`/products/${product.handle}`} 
        prefetch="intent"
        className="block"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative overflow-hidden aspect-[3/4]">
          {/* Product image */}
          <img
            src={primaryImageSrc}
            alt={product.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          
          {/* Sale tag */}
          {discountPercentage && (
            <div className="absolute top-3 left-3 bg-terracotta text-ivory px-2 py-1 text-xs font-medium rounded-md">
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
          <div className={`absolute bottom-0 left-0 right-0 p-3 flex justify-center space-x-2 bg-gradient-to-t from-offblack/80 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <button 
              className="p-2 bg-ivory rounded-full text-offblack hover:bg-beige transition-colors"
              aria-label="Quick view"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
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