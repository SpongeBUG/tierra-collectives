// app/components/product/ProductGrid.tsx
import type { Product } from '~/types';
import { ProductCard } from './ProductCard';
import { cn } from '~/lib/utils';

interface ProductGridProps {
  products: Product[];
  className?: string;
  columns?: number;
}

export function ProductGrid({ products, className = '', columns = 4 }: ProductGridProps) {
  // Determine grid columns based on count or passed prop
  const gridCols = `grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-${Math.min(columns, 4)}`;

  if (!products || products.length === 0) {
    return (
      <div className="flex h-40 w-full items-center justify-center">
        <p className="text-center text-muted-foreground">No products found</p>
      </div>
    );
  }

  // Debug product data to help identify issues
  console.log(`Rendering ProductGrid with ${products.length} products`);
  
  return (
    <div className={cn(`grid gap-6 ${gridCols}`, className)}>
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          featured={product.tags.includes('Featured')}
        />
      ))}
    </div>
  );
}