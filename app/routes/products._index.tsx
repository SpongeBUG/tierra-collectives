// app/routes/products._index.tsx
import { useState, useEffect, useRef } from 'react';
import type { LoaderFunction, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData, useSearchParams, useNavigation } from '@remix-run/react';
import { MainLayout } from '~/components/layout/MainLayout';
import { ProductGrid } from '~/components/product/ProductGrid';
import { ProductGridSkeleton } from '~/components/product/ProductGridSkeleton';
import { Button } from '~/components/ui/Button';
import { FadeIn } from '~/components/ui/animation/FadeIn';
import { SlideIn } from '~/components/ui/animation/SlideIn';
import { Filter, ChevronDown, X } from 'lucide-react';
import productService from '~/services/product.server';
import type { Product } from '~/types';
import { formatPrice } from '~/lib/utils';

export const meta: MetaFunction = () => {
  return [
    { title: 'All Products | Tierra Collectives' },
    { name: 'description', content: 'Browse our complete collection of handcrafted products made by skilled artisans from around the world.' },
  ];
};

type LoaderData = {
  products: Product[];
  error?: string;
};

export const loader: LoaderFunction = async () => {
  // In a real implementation, we would pass query parameters for filtering
  const response = await productService.getAllProducts(24);
  
  if (response.error) {
    console.error("Error fetching products:", response.error);
    return json<LoaderData>({ 
      products: [], 
      error: "Failed to load products. Please try again later." 
    });
  }
  
  return json<LoaderData>({ products: response.data.products });
};

// Product category options
const CATEGORIES = [
  'All Categories',
  'Home Decor',
  'Kitchen & Dining',
  'Textiles',
  'Jewelry',
  'Art',
  'Ceramics',
  'Woodwork'
];

// Product sort options
const SORT_OPTIONS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Popularity', value: 'popularity' },
];

export default function Products() {
  const { products, error } = useLoaderData<LoaderData>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigation = useNavigation();
  const isLoading = navigation.state === 'loading';
  
  // Filter and sort states
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All Categories');
  const [selectedSort, setSelectedSort] = useState(searchParams.get('sort') || 'newest');
  const [priceRange, setPriceRange] = useState({
    min: searchParams.get('min') ? parseInt(searchParams.get('min')!) : 0,
    max: searchParams.get('max') ? parseInt(searchParams.get('max')!) : 1000,
  });
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [isFiltering, setIsFiltering] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Apply filters and sorting
  useEffect(() => {
    if (isLoading) return;
    
    setIsFiltering(true);
    
    // Use a timeout to simulate server filtering and create a smoother UX
    const filterTimeout = setTimeout(() => {
      // This is a simplified version; in a real app, you would fetch filtered data from the server
      let filtered = [...products];
      
      // Filter by category
      if (selectedCategory && selectedCategory !== 'All Categories') {
        filtered = filtered.filter(product => 
          product.productType === selectedCategory || 
          product.tags.includes(selectedCategory)
        );
      }
      
      // Filter by price
      filtered = filtered.filter(product => {
        const price = parseFloat(product.variants[0]?.price.amount || '0');
        return price >= priceRange.min && price <= priceRange.max;
      });
      
      // Sort products
      switch (selectedSort) {
        case 'price-asc':
          filtered.sort((a, b) => {
            const priceA = parseFloat(a.variants[0]?.price.amount || '0');
            const priceB = parseFloat(b.variants[0]?.price.amount || '0');
            return priceA - priceB;
          });
          break;
        case 'price-desc':
          filtered.sort((a, b) => {
            const priceA = parseFloat(a.variants[0]?.price.amount || '0');
            const priceB = parseFloat(b.variants[0]?.price.amount || '0');
            return priceB - priceA;
          });
          break;
        case 'newest':
          filtered.sort((a, b) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          });
          break;
        // Additional sort options would go here
        default:
          break;
      }
      
      setFilteredProducts(filtered);
      setIsFiltering(false);
      
      // Update URL params
      const newParams = new URLSearchParams();
      if (selectedCategory !== 'All Categories') {
        newParams.set('category', selectedCategory);
      }
      if (selectedSort !== 'newest') {
        newParams.set('sort', selectedSort);
      }
      if (priceRange.min > 0) {
        newParams.set('min', priceRange.min.toString());
      }
      if (priceRange.max < 1000) {
        newParams.set('max', priceRange.max.toString());
      }
      
      // Only update if params have changed
      if (newParams.toString() !== searchParams.toString()) {
        setSearchParams(newParams);
      }
    }, 400); // Debounce time for better UX
    
    return () => clearTimeout(filterTimeout);
  }, [selectedCategory, selectedSort, priceRange, products, searchParams, setSearchParams, isLoading]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSort(e.target.value);
  };

  const handlePriceChange = (min: number, max: number) => {
    setPriceRange({ min, max });
  };

  const handleResetFilters = () => {
    setSelectedCategory('All Categories');
    setSelectedSort('newest');
    setPriceRange({ min: 0, max: 1000 });
    setSearchParams(new URLSearchParams());
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <div className="bg-offblack text-ivory py-16">
        <div className="container-custom text-center">
          <h1 className="font-serif text-5xl font-bold mb-4">All Products</h1>
          <p className="text-xl max-w-2xl mx-auto text-ivory/80">
            Discover our curated collection of handcrafted products made by 
            skilled artisans from around the world.
          </p>
        </div>
      </div>
      
      <div className="bg-ivory dark:bg-offblack py-12">
        <div className="container-custom">
          {error ? (
            <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-6 text-center">
              <p className="text-red-700 dark:text-red-300 text-lg">{error}</p>
              <Button 
                onClick={() => window.location.reload()}
                className="mt-4 bg-red-600 hover:bg-red-700 text-white"
              >
                Try Again
              </Button>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-muted-foreground" />
                  <button
                    onClick={() => setShowFilters(!showFilters)} 
                    className="text-sm font-medium flex items-center gap-1 md:hidden"
                  >
                    Filters
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <div className="hidden md:block">
                    <span className="text-muted-foreground">
                      Showing {filteredProducts.length} products
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <label className="text-sm text-muted-foreground">Sort by:</label>
                  <select
                    value={selectedSort}
                    onChange={handleSortChange}
                    className="rounded-md border border-border bg-background px-3 py-2 text-sm"
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Filters Sidebar */}
                <div className={`${showFilters ? 'block' : 'hidden'} md:block`}>
                  <div className="bg-white dark:bg-offblack-light p-6 rounded-lg border border-border">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-serif font-medium">Filters</h2>
                      <Button 
                        variant="link" 
                        onClick={handleResetFilters} 
                        className="text-terracotta text-sm"
                      >
                        Reset All
                      </Button>
                    </div>
                    
                    {/* Categories */}
                    <div className="mb-6">
                      <h3 className="text-base font-medium mb-3">Categories</h3>
                      <div className="space-y-2">
                        {CATEGORIES.map((category) => (
                          <button
                            key={category}
                            onClick={() => handleCategoryChange(category)}
                            className={`block w-full text-left py-1 px-2 rounded ${
                              selectedCategory === category
                                ? 'bg-terracotta/10 text-terracotta font-medium'
                                : 'hover:bg-muted/60'
                            }`}
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Price Range */}
                    <div>
                      {/* <h3 className="text-base font-medium mb-3">Price Range</h3>
                      <div className="flex space-x-4 mb-4">
                        <div className="w-1/2">
                          <label htmlFor="min-price" className="sr-only">Min Price</label>
                          <input
                            id="min-price"
                            type="number"
                            value={priceRange.min}
                            onChange={(e) => handlePriceChange(parseInt(e.target.value) || 0, priceRange.max)}
                            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                            placeholder="Min"
                          />
                        </div>
                        <div className="w-1/2">
                          <label htmlFor="max-price" className="sr-only">Max Price</label>
                          <input
                            id="max-price"
                            type="number"
                            value={priceRange.max}
                            onChange={(e) => handlePriceChange(priceRange.min, parseInt(e.target.value) || 1000)}
                            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                            placeholder="Max"
                          />
                        </div>
                      </div> */}
                      
                      {/* Applied Filters */}
                      {(selectedCategory !== 'All Categories' || priceRange.min > 0 || priceRange.max < 1000) && (
                        <div className="mt-6 pt-6 border-t border-border">
                          <h3 className="text-base font-medium mb-3">Applied Filters</h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedCategory !== 'All Categories' && (
                              <div className="bg-terracotta/10 text-terracotta text-sm px-3 py-1 rounded-full flex items-center">
                                {selectedCategory}
                                <button onClick={() => handleCategoryChange('All Categories')} className="ml-2">
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            )}
                            
                            {(priceRange.min > 0 || priceRange.max < 1000) && (
                              <div className="bg-terracotta/10 text-terracotta text-sm px-3 py-1 rounded-full flex items-center">
                                {formatPrice(priceRange.min)} - {formatPrice(priceRange.max)}
                                <button onClick={() => handlePriceChange(0, 1000)} className="ml-2">
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Products Grid */}
                <div className="md:col-span-3">
                  {isLoading || isFiltering ? (
                    <ProductGridSkeleton count={8} />
                  ) : filteredProducts.length > 0 ? (
                    <ProductGrid products={filteredProducts} />
                  ) : (
                    <div className="text-center py-16 bg-muted/30 rounded-lg">
                      <h3 className="text-xl font-medium mb-2">No Products Found</h3>
                      <p className="text-muted-foreground mb-4">Try adjusting your filters to find what you're looking for.</p>
                      <Button onClick={handleResetFilters}>Reset Filters</Button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
}