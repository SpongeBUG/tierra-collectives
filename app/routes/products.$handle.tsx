// app/routes/products.$handle.tsx
import { useState, useEffect } from 'react';
import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData, useNavigation, Link } from '@remix-run/react';
import { ArrowLeft, Heart, Share2, Check, AlertTriangle } from 'lucide-react';
import { MainLayout } from '~/components/layout/MainLayout';
import { ProductDetailSkeleton } from '~/components/product/ProductDetailSkeleton';
import { ImageGallery } from '~/components/product/ImageGallery';
import { Button } from '~/components/ui/Button';
import { useCart } from '~/context/CartContext';
import { useRecentlyViewed } from '~/components/product/RecentlyViewed';
import { RecentlyViewed } from '~/components/product/RecentlyViewed';
import { ProductRecommendations } from '~/components/product/ProductRecommendations';
import { FadeIn } from '~/components/ui/animation/FadeIn';
import { SlideIn } from '~/components/ui/animation/SlideIn';
import productService from '~/services/product.server';
import { formatPrice } from '~/lib/utils';
import type { Product, ProductVariant } from '~/types';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.product) {
    return [
      { title: 'Product Not Found | Tierra Collectives' },
      { name: 'description', content: 'The requested product could not be found.' },
    ];
  }

  return [
    { title: `${data.product.title} | Tierra Collectives` },
    { name: 'description', content: data.product.description.substring(0, 160) },
  ];
};

type LoaderData = {
  product: Product | null;
  relatedProducts: Product[];
  error?: string;
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { handle } = params;

  if (!handle) {
    return json<LoaderData>({ 
      product: null, 
      relatedProducts: [],
      error: 'Product handle is required' 
    }, { status: 400 });
  }

  const response = await productService.getProductByHandle(handle);
  
  if (response.error || !response.data.product) {
    console.error("Error fetching product:", response.error);
    return json<LoaderData>({ 
      product: null, 
      relatedProducts: [],
      error: response.error || 'Product not found' 
    }, { status: response.status });
  }
  
  // Fetch some related products (in a real app, this would be more sophisticated)
  const allProductsResponse = await productService.getAllProducts(12);
  const relatedProducts = allProductsResponse.data.products.filter(
    p => p.id !== response.data.product?.id
  );
  
  return json<LoaderData>({ 
    product: response.data.product,
    relatedProducts
  });
};

export default function ProductDetail() {
  const { product, relatedProducts, error } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const isLoading = navigation.state === 'loading';
  
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product?.variants?.[0] || null
  );
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addItem, isItemInCart } = useCart();
  
  // Use recently viewed hook
  const { addToRecentlyViewed } = useRecentlyViewed(product?.id || '');
  
  // Add current product to recently viewed
  useEffect(() => {
    if (product) {
      addToRecentlyViewed(product);
    }
  }, [product, addToRecentlyViewed]);
  
  if (isLoading) {
    return <ProductDetailSkeleton />;
  }
  
  if (error || !product) {
    return (
      <MainLayout>
        <div className="container-custom py-12">
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-red-700">{error || 'Product not found'}</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  const handleVariantChange = (variantId: string) => {
    const variant = product.variants.find(v => v.id === variantId);
    if (variant) {
      setSelectedVariant(variant);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (product && selectedVariant) {
      setIsAddingToCart(true);
      // Add a slight delay to give feedback to user
      setTimeout(() => {
        addItem(product, selectedVariant, quantity);
        setIsAddingToCart(false);
        setAddedToCart(true);
        
        // Reset the "Added to cart" message after 3 seconds
        setTimeout(() => {
          setAddedToCart(false);
        }, 3000);
      }, 600);
    }
  };
  
  const isCurrentVariantInCart = selectedVariant ? isItemInCart(selectedVariant.id) : false;
  
  // Calculate stock level for messaging
  const stockLevel = selectedVariant?.available 
    ? 'In stock'  // This is simplified, in a real app you'd have actual inventory counts
    : 'Out of stock';
  
  // Calculate shipping estimate (this would come from your backend in a real app)
  const today = new Date();
  const deliveryDate = new Date(today);
  deliveryDate.setDate(today.getDate() + 7); // 7 days from now
  const formattedDeliveryDate = deliveryDate.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <MainLayout>
      <div className="container-custom py-12">
        <div className="mb-6">
          <Link 
            to="/products"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </div>
        
        <div className="grid gap-12 md:grid-cols-2">
          {/* Product Images */}
          <SlideIn direction="left">
            <ImageGallery 
              images={product.images} 
              productTitle={product.title} 
            />
          </SlideIn>
          
          {/* Product Details */}
          <SlideIn direction="right">
            <div className="space-y-6">
              {/* Product Brand & Title */}
              <div>
                <p className="text-sm font-medium text-terracotta">{product.vendor}</p>
                <h1 className="text-3xl font-serif font-bold tracking-tight">{product.title}</h1>
              </div>
              
              {/* Price */}
              <div className="border-b border-border pb-6">
                <div className="flex items-center gap-3">
                  <p className="text-2xl font-semibold">
                    {selectedVariant && formatPrice(selectedVariant.price.amount)}
                  </p>
                  {selectedVariant && selectedVariant.compareAtPrice && 
                   parseFloat(selectedVariant.compareAtPrice.amount) > parseFloat(selectedVariant.price.amount) && (
                    <p className="text-muted-foreground line-through">
                      {formatPrice(selectedVariant.compareAtPrice.amount)}
                    </p>
                  )}
                  
                  {/* Discount percentage */}
                  {selectedVariant && selectedVariant.compareAtPrice && 
                   parseFloat(selectedVariant.compareAtPrice.amount) > parseFloat(selectedVariant.price.amount) && (
                    <p className="rounded-md bg-terracotta/10 px-2 py-1 text-sm font-medium text-terracotta">
                      {Math.round(((parseFloat(selectedVariant.compareAtPrice.amount) - parseFloat(selectedVariant.price.amount)) / 
                        parseFloat(selectedVariant.compareAtPrice.amount)) * 100)}% OFF
                    </p>
                  )}
                </div>
              </div>
              
              {/* Variants */}
              {product.variants.length > 1 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Options</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => handleVariantChange(variant.id)}
                        className={`rounded-md border px-4 py-2 text-sm transition-all ${
                          selectedVariant?.id === variant.id
                            ? 'border-terracotta bg-terracotta text-ivory'
                            : 'border-border bg-background hover:border-terracotta/50'
                        } ${!variant.available ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={!variant.available}
                      >
                        {variant.title}
                        {!variant.available && ' (Sold out)'}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Quantity & Add to Cart */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <h3 className="text-sm font-medium">Quantity</h3>
                  
                  {/* Stock level indicator */}
                  <span className={`flex items-center text-sm ${
                    selectedVariant?.available ? 'text-green-600' : 'text-red-500'
                  }`}>
                    {selectedVariant?.available ? (
                      <>
                        <Check className="mr-1 h-4 w-4" />
                        {stockLevel}
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="mr-1 h-4 w-4" />
                        {stockLevel}
                      </>
                    )}
                  </span>
                </div>
                
                <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                  <div className="flex">
                    <button
                      onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                      className="rounded-l-md border border-r-0 border-border bg-background px-3 py-2 text-foreground transition-colors hover:bg-muted disabled:opacity-50"
                      disabled={quantity <= 1 || !selectedVariant?.available}
                      aria-label="Decrease quantity"
                    >
                      <span aria-hidden="true">−</span>
                    </button>
                    
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={handleQuantityChange}
                      className="w-16 border-y border-border bg-background px-3 py-2 text-center focus:outline-none focus:ring-1 focus:ring-terracotta disabled:opacity-50"
                      disabled={!selectedVariant?.available}
                    />
                    
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="rounded-r-md border border-l-0 border-border bg-background px-3 py-2 text-foreground transition-colors hover:bg-muted disabled:opacity-50"
                      disabled={!selectedVariant?.available}
                      aria-label="Increase quantity"
                    >
                      <span aria-hidden="true">+</span>
                    </button>
                  </div>
                  
                  <Button 
                    onClick={handleAddToCart}
                    disabled={!selectedVariant?.available || isAddingToCart}
                    isLoading={isAddingToCart}
                    className="flex-1 bg-terracotta hover:bg-terracotta-dark text-ivory transition-all"
                  >
                    {!selectedVariant?.available 
                      ? 'Sold Out' 
                      : addedToCart 
                      ? 'Added to Cart!' 
                      : isCurrentVariantInCart 
                      ? 'Add More to Cart' 
                      : 'Add to Cart'}
                  </Button>
                  
                  {/* Wishlist button */}
                  <Button 
                    variant="outline" 
                    className="h-11 w-11 p-0 flex items-center justify-center border-border"
                    aria-label="Add to wishlist"
                  >
                    <Heart className="h-5 w-5" />
                  </Button>
                  
                  {/* Share button */}
                  <Button 
                    variant="outline" 
                    className="h-11 w-11 p-0 flex items-center justify-center border-border"
                    aria-label="Share product"
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
                
                {/* Cart feedback message */}
                {addedToCart && (
                  <div className="animated-fade-in rounded-md bg-green-50 p-3 text-sm text-green-600">
                    Item successfully added to your cart!
                  </div>
                )}
                
                {/* In cart message */}
                {isCurrentVariantInCart && !addedToCart && (
                  <p className="text-sm text-terracotta">
                    This item is already in your cart. You can add more or adjust quantity in the cart.
                  </p>
                )}
              </div>
              
              {/* Shipping information */}
              <div className="rounded-md bg-muted/50 p-4 text-sm">
                <p className="mb-2 font-medium">Shipping Information</p>
                <p className="text-muted-foreground">
                  {selectedVariant?.available 
                    ? `Free shipping available. Estimated delivery: ${formattedDeliveryDate}.` 
                    : 'This item is currently out of stock.'}
                </p>
              </div>
              
              {/* Description */}
              <div className="border-t border-border pt-6">
                <h3 className="mb-4 text-lg font-medium">Description</h3>
                <div className="prose prose-sm max-w-none text-muted-foreground" dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
              </div>
              
              {/* Product Details */}
              <div className="border-t border-border pt-6">
                <h3 className="mb-4 text-lg font-medium">Product Details</h3>
                <dl className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
                  {product.vendor && (
                    <div className="flex justify-between sm:block">
                      <dt className="font-medium text-muted-foreground">Brand</dt>
                      <dd>{product.vendor}</dd>
                    </div>
                  )}
                  {product.productType && (
                    <div className="flex justify-between sm:block">
                      <dt className="font-medium text-muted-foreground">Type</dt>
                      <dd>{product.productType}</dd>
                    </div>
                  )}
                  {selectedVariant?.sku && (
                    <div className="flex justify-between sm:block">
                      <dt className="font-medium text-muted-foreground">SKU</dt>
                      <dd>{selectedVariant.sku}</dd>
                    </div>
                  )}
                  {product.tags && product.tags.length > 0 && (
                    <div className="sm:col-span-2 flex justify-between sm:block">
                      <dt className="font-medium text-muted-foreground">Tags</dt>
                      <dd className="flex flex-wrap justify-end gap-1 sm:justify-start">
                        {product.tags.map(tag => (
                          <span key={tag} className="rounded-full bg-muted px-2 py-1 text-xs">
                            {tag}
                          </span>
                        ))}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
              
              {/* Care Instructions - this would be custom content specific to your products */}
              <div className="border-t border-border pt-6">
                <button 
                  className="flex w-full items-center justify-between"
                  aria-expanded="false"
                  aria-controls="care-instructions"
                >
                  <h3 className="text-lg font-medium">Care Instructions</h3>
                  <svg className="h-5 w-5 transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div id="care-instructions" className="mt-4 text-sm text-muted-foreground hidden">
                  <p>Handcrafted with care. Please handle with gentle care to preserve the artisan quality.</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Clean with a soft, dry cloth</li>
                    <li>Avoid direct sunlight and extreme temperatures</li>
                    <li>Store in a cool, dry place</li>
                  </ul>
                </div>
              </div>
            </div>
          </SlideIn>
        </div>
        
        {/* Product Recommendations */}
        {relatedProducts.length > 0 && (
          <ProductRecommendations 
            currentProductId={product.id}
            currentProductTags={product.tags}
            allProducts={relatedProducts}
          />
        )}
        
        {/* Recently Viewed */}
        <RecentlyViewed currentProductId={product.id} />
      </div>
    </MainLayout>
  );
}