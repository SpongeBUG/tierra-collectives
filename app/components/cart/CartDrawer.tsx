// app/components/cart/CartDrawer.tsx
import { Dialog, Transition } from '@headlessui/react';
import { Link } from '@remix-run/react';
import { X } from 'lucide-react';
import { Fragment } from 'react';

import { Button } from '~/components/ui/Button';
import { useCart } from '~/context/CartContext';

import { CartItem } from './CartItem';

export function CartDrawer() {
  const { cart, isOpen, closeCart, createCheckout } = useCart();
  
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
          <div className="fixed inset-0 bg-black bg-opacity-40 transition-opacity" />
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
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900">
                          Shopping cart ({cart.itemCount})
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="-m-2 p-2 text-gray-400 hover:text-gray-500"
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
                            <ul className="-my-6 divide-y divide-gray-200">
                              {cart.items.map((item) => (
                                <CartItem key={item.id} item={item} />
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-12">
                            <p className="text-center text-lg text-gray-500">
                              Your cart is empty
                            </p>
                            <Button
                              onClick={closeCart}
                              className="mt-4"
                            >
                              Continue Shopping
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {cart.items.length > 0 && (
                      <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <p>Subtotal</p>
                          <p>{cart.subtotal}</p>
                        </div>
                        <p className="mt-0.5 text-sm text-gray-500">
                          Shipping and taxes calculated at checkout.
                        </p>
                        <div className="mt-6">
                          <Button
                            className="w-full"
                            onClick={handleCheckout}
                          >
                            Checkout
                          </Button>
                        </div>
                        <div className="mt-3">
                          <Button
                            variant="outline"
                            className="w-full"
                            asChild
                            onClick={closeCart}
                          >
                            <Link to="/cart">View Cart</Link>
                          </Button>
                        </div>
                        <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                          <p>
                            or{' '}
                            <button
                              type="button"
                              className="font-medium text-black hover:text-gray-800"
                              onClick={closeCart}
                            >
                              Continue Shopping
                              <span aria-hidden="true"> &rarr;</span>
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