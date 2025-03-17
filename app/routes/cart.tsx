// app/routes/cart.tsx
import { useState } from 'react';
import { Link } from '@remix-run/react';
import { ArrowLeft, Trash2, MinusCircle, PlusCircle, ShoppingBag } from 'lucide-react';
import { MainLayout } from '~/components/layout/MainLayout';
import { Button } from '~/components/ui/Button';
import { useCart } from '~/context/CartContext';
import { formatPrice } from '~/lib/utils';
import { FadeIn } from '~/components/ui/animation/FadeIn';

export default function CartPage() {
  const { cart, updateItem, removeItem, clearCart, createCheckout } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

 const handleProceedToCheckout = async () => {
    setIsProcessing(true);
    try {
      const checkoutUrl = await createCheckout();
      // In a real implementation, redirect to the checkout URL
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Error creating checkout:', error);
      alert('There was an error processing your checkout. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  return (
    <MainLayout>
      <div className="container-custom py-12">
        <FadeIn>
          <h1 className="mb-8 text-3xl font-bold font-serif">Your Cart</h1>
        </FadeIn>

        {cart.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg bg-muted/30 dark:bg-offblack-light/50 py-16 text-center">
            <ShoppingBag className="mb-4 h-16 w-16 text-muted-foreground" />
            <h2 className="mb-2 text-xl font-medium">Your cart is empty</h2>
            <p className="mb-6 text-muted-foreground">Looks like you haven't added any products to your cart yet.</p>
            <Button asChild className="bg-terracotta hover:bg-terracotta-dark text-ivory">
              <Link to="/products">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="rounded-lg border border-border bg-background shadow-sm">
                <div className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-medium">
                      {cart.itemCount} {cart.itemCount === 1 ? 'Item' : 'Items'}
                    </h2>
                    <button
                      onClick={clearCart}
                      className="text-sm text-muted-foreground hover:text-red-500 dark:hover:text-red-400"
                    >
                      Clear Cart
                    </button>
                  </div>

                  <div className="divide-y divide-border">
                    {cart.items.map((item) => (
                      <div key={item.id} className="py-6 first:pt-0 last:pb-0">
                        <div className="flex flex-wrap items-start gap-4 sm:flex-nowrap">
                          <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-border">
                            <Link to={`/products/${item.handle}`} prefetch="intent">
                              <img
                                src={item.imageSrc}
                                alt={item.imageAlt || item.title}
                                className="h-full w-full object-cover"
                              />
                            </Link>
                          </div>

                          <div className="flex flex-1 flex-col gap-1">
                            <div className="flex justify-between">
                              <Link
                                to={`/products/${item.handle}`}
                                prefetch="intent"
                                className="text-lg font-medium hover:text-terracotta"
                              >
                                {item.title}
                              </Link>
                              <p className="font-medium">
                                {formatPrice(parseFloat(item.price.amount) * item.quantity)}
                              </p>
                            </div>

                            <p className="text-sm text-muted-foreground">{item.variantTitle}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatPrice(item.price.amount)} each
                            </p>

                            <div className="mt-2 flex items-center justify-between">
                              <div className="flex items-center">
                                <button
                                  onClick={() => updateItem(item.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                  className="text-muted-foreground hover:text-foreground disabled:opacity-50"
                                  aria-label="Decrease quantity"
                                >
                                  <MinusCircle className="h-5 w-5" />
                                </button>
                                <span className="mx-3 min-w-[2rem] text-center font-medium">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateItem(item.id, item.quantity + 1)}
                                  className="text-muted-foreground hover:text-foreground"
                                  aria-label="Increase quantity"
                                >
                                  <PlusCircle className="h-5 w-5" />
                                </button>
                              </div>

                              <button
                                onClick={() => removeItem(item.id)}
                                className="text-muted-foreground hover:text-red-500 dark:hover:text-red-400"
                                aria-label="Remove item"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Link 
                  to="/products"
                  className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-terracotta"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <div className="rounded-lg border border-border bg-background p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-medium">Order Summary</h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <p className="text-muted-foreground">Subtotal</p>
                    <p className="font-medium">{cart.subtotal}</p>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <p className="text-muted-foreground">Shipping</p>
                    <p className="font-medium">Calculated at checkout</p>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <p className="text-muted-foreground">Tax</p>
                    <p className="font-medium">Calculated at checkout</p>
                  </div>
                  
                  <div className="border-t border-border pt-3">
                    <div className="flex justify-between">
                      <p className="font-medium">Estimated Total</p>
                      <p className="font-bold">{cart.subtotal}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button 
                    onClick={handleProceedToCheckout}
                    disabled={isProcessing}
                    className="w-full bg-terracotta hover:bg-terracotta-dark text-ivory"
                  >
                    {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
                  </Button>
                </div>
                
                <div className="mt-4 text-center text-xs text-muted-foreground">
                  <p>Secure checkout powered by Shopify</p>
                </div>
              </div>
              
              <div className="mt-6 rounded-lg border border-border bg-background p-6 shadow-sm">
                <h3 className="text-sm font-medium">Shipping Information</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Free shipping on all orders over $75. International shipping available.
                </p>
              </div>
              
              <div className="mt-6 rounded-lg border border-border bg-background p-6 shadow-sm">
                <h3 className="text-sm font-medium">Return Policy</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  We accept returns within 30 days of delivery. Items must be unused and in original packaging.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}