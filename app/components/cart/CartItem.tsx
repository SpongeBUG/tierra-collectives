// app/components/cart/CartItem.tsx
import { Link } from '@remix-run/react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '~/context/CartContext';
import { formatPrice } from '~/lib/utils';
import type { CartItem as CartItemType } from '~/types/cart';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateItem, removeItem } = useCart();
  
  return (
    <li className="flex py-6">
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
        <img
          src={item.imageSrc}
          alt={item.imageAlt}
          className="h-full w-full object-cover object-center"
        />
      </div>
      
      <div className="ml-4 flex flex-1 flex-col">
        <div>
          <div className="flex justify-between text-base font-medium text-gray-900">
            <h3>
              <Link to={`/products/${item.handle}`} prefetch="intent">
                {item.title}
              </Link>
            </h3>
            <p className="text-sm text-gray-600">
              {formatPrice(parseFloat(item.price.amount))} each
            </p>
          </div>
          <p className="mt-1 text-sm text-gray-500">{item.variantTitle}</p>
        </div>
        
        <div className="flex flex-1 items-end justify-between text-sm">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => updateItem(item.id, item.quantity - 1)}
              className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </button>
            
            <span className="font-medium text-gray-700">{item.quantity}</span>
            
            <button
              onClick={() => updateItem(item.id, item.quantity + 1)}
              className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          
          <button
            type="button"
            onClick={() => removeItem(item.id)}
            className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-red-500"
            aria-label="Remove item"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </li>
  );
}