// app/components/cart/CartDrawer.tsx
import { Dialog, Transition } from '@headlessui/react';
import { Link } from '@remix-run/react';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { Fragment } from 'react';

import { Button } from '~/components/ui/Button';
import { useCart } from '~/context/CartContext';

import { CartItem } from './CartItem';

export function CartDrawer() {
  const { cart, isOpen, closeCart, createCheckout, updateItem, removeItem } = useCart();
  
  const handleCheckout = async () => {
    try {
      const checkoutUrl = await createCheckout();
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Error creating checkout:', error);
      alert('There was an error processing your checkout. Please try again.');
    }
  };
  
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeCart}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 transition-opacity" />
        </Transition.Child>
        
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-offblack text-ivory">
                    <div className="flex-1 overflow-y-auto pt-6 pb-4 px-4 sm:px-6">
                      <div className="flex items-center justify-between pb-4 border-b border-ivory/10">
                        <Dialog.Title className="text-lg font-medium text-ivory">
                          Shopping cart ({cart.itemCount})
                        </Dialog.Title>
                        <div className="flex h-7 items-center">
                          <button
                            type="button"
                            className="p-2 text-ivory/70 hover:text-ivory"
                            onClick={closeCart}
                          >
                            <span className="sr-only">Close panel</span>
                            <X className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="mt-8">
                        {cart.items.length > 0 ? (
                          <div className="flow-root">
                            <ul className="divide-y divide-ivory/10">
                              {cart.items.map((item) => (
                                <li key={item.id} className="py-6">
                                  <div className="flex items-start space-x-4">
                                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded bg-ivory/10">
                                      <img
                                        src={item.imageSrc}
                                        alt={item.imageAlt || item.title}
                                        className="h-full w-full object-cover"
                                      />
                                    </div>
                                    <div className="flex flex-1 flex-col">
                                      <div>
                                        <div className="flex justify-between">
                                          <h3 className="text-base text-ivory">
                                            <Link to={`/products/${item.handle}`} onClick={closeCart}>
                                              {item.title}
                                            </Link>
                                          </h3>
                                          <p className="ml-4 text-base text-ivory">
                                            ${parseFloat(item.price.amount).toFixed(2)}
                                            <span className="text-ivory/70 text-sm ml-1">each</span>
                                          </p>
                                        </div>
                                        <p className="mt-1 text-sm text-ivory/70">{item.variantTitle}</p>
                                      </div>
                                      <div className="flex flex-1 items-end justify-between text-sm mt-2">
                                        <div className="flex items-center border border-ivory/30 rounded">
                                          <button
                                            onClick={() => updateItem(item.id, item.quantity - 1)}
                                            disabled={item.quantity <= 1}
                                            className="px-2 py-1 text-ivory/70 hover:text-ivory disabled:opacity-50"
                                          >
                                            <Minus className="h-4 w-4" />
                                          </button>
                                          <span className="w-8 text-center">{item.quantity}</span>
                                          <button
                                            onClick={() => updateItem(item.id, item.quantity + 1)}
                                            className="px-2 py-1 text-ivory/70 hover:text-ivory"
                                          >
                                            <Plus className="h-4 w-4" />
                                          </button>
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => removeItem(item.id)}
                                          className="text-ivory/50 hover:text-terracotta"
                                        >
                                          <Trash2 className="h-5 w-5" />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-12">
                            <p className="text-center text-lg text-ivory/70">
                              Your cart is empty
                            </p>
                            <Button
                              onClick={closeCart}
                              className="mt-4 bg-terracotta hover:bg-terracotta-dark text-ivory"
                            >
                              Continue Shopping
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {cart.items.length > 0 && (
                      <div className="border-t border-ivory/10 py-6 px-4 sm:px-6">
                        <div className="flex justify-between text-base font-medium text-ivory">
                          <p>Subtotal</p>
                          <p>${parseFloat(cart.subtotal.replace(/[^0-9.]/g, '')).toFixed(2)}</p>
                        </div>
                        <p className="mt-0.5 text-sm text-ivory/70">
                          Shipping and taxes calculated at checkout.
                        </p>
                        <div className="mt-6">
                          <Button
                            className="w-full bg-terracotta hover:bg-terracotta-dark text-ivory py-3 rounded-sm"
                            onClick={handleCheckout}
                          >
                            Checkout
                          </Button>
                        </div>
                        <div className="mt-3">
                          <Button
                            variant="outline"
                            className="w-full border-ivory/20 text-ivory hover:bg-ivory/10 py-3 rounded-sm"
                            asChild
                            onClick={closeCart}
                          >
                            <Link to="/cart">View Cart</Link>
                          </Button>
                        </div>
                        <div className="mt-6 flex justify-center text-center text-sm text-ivory/70">
                          <p>
                            or{' '}
                            <button
                              type="button"
                              className="font-medium text-terracotta hover:text-terracotta-light"
                              onClick={closeCart}
                            >
                              Continue Shopping →
                            </button>
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}