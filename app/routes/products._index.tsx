// app/routes/products._index.tsx
import { useState, useEffect } from 'react';
import type { LoaderFunction, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData, useSearchParams, useNavigate, useNavigation } from '@remix-run/react';
import { MainLayout } from '~/components/layout/MainLayout';
import { ProductGrid } from '~/components/product/ProductGrid';
import { ProductGridSkeleton } from '~/components/product/ProductGridSkeleton';
import { Button } from '~/components/ui/Button';
import { FadeIn } from '~/components/ui/animation/FadeIn';
import productService from '~/services/product.server';
import type { Product } from '~/types';

export const meta: MetaFunction = () => {
  return [
    { title: 'All Products | Tierra Collectives' },
    { name: 'description', content: 'Browse our complete collection of handcrafted products.' },
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
  const navigate = useNavigate();
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
      <div className="container mx-auto py-12">
        <FadeIn>
          <h1 className="mb-8 text-3xl font-bold">All Products</h1>
        </FadeIn>
        
        {error ? (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-red-700">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            {/* Filters Sidebar */}
            <div className="space-y-6">
              <div>
                <h3 className="mb-4 text-lg font-medium">Categories</h3>
                <div className="space-y-2">
                  {CATEGORIES.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryChange(category)}
                      className={`block w-full text-left ${
                        selectedCategory === category
                          ? 'font-medium text-blue-600'
                          : 'text-gray-600 hover:text-blue-600'
                      }`}
                      disabled={isLoading || isFiltering}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="mb-4 text-lg font-medium">Price Range</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={priceRange.min}
                      onChange={(e) => handlePriceChange(parseInt(e.target.value) || 0, priceRange.max)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                      min="0"
                      placeholder="Min"
                      disabled={isLoading || isFiltering}
                    />
                    <span>to</span>
                    <input
                      type="number"
                      value={priceRange.max}
                      onChange={(e) => handlePriceChange(priceRange.min, parseInt(e.target.value) || 1000)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                      min="0"
                      placeholder="Max"
                      disabled={isLoading || isFiltering}
                    />
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => handlePriceChange(0, 1000)}
                    size="sm"
                    className="w-full"
                    disabled={isLoading || isFiltering}
                  >
                    Reset Price
                  </Button>
                </div>
              </div>
              
              <div>
                <Button
                  variant="outline"
                  onClick={handleResetFilters}
                  className="w-full"
                  disabled={isLoading || isFiltering}
                >
                  Reset All Filters
                </Button>
              </div>
            </div>
            
            {/* Products Grid */}
            <div className="md:col-span-3">
              <div className="mb-6 flex items-center justify-between">
                <p className="text-gray-600">
                  {isLoading || isFiltering ? 'Loading products...' : 
                    `Showing ${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''}`}
                </p>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Sort by:</span>
                  <select
                    value={selectedSort}
                    onChange={handleSortChange}
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                    disabled={isLoading || isFiltering}
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {isLoading || isFiltering ? (
                <ProductGridSkeleton count={12} />
              ) : (
                <ProductGrid products={filteredProducts} />
              )}
              
              {!isLoading && !isFiltering && filteredProducts.length === 0 && (
                <div className="mt-12 rounded-md bg-gray-50 p-8 text-center">
                  <p className="text-gray-500">No products match your filter criteria.</p>
                  <Button 
                    variant="outline" 
                    onClick={handleResetFilters}
                    className="mt-4"
                  >
                    Reset Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}