'use client';
import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useAppSelector} from '../../hooks';


const CartIcon: React.FC = () => {
  
  const { totalItems } = useAppSelector((state) => state.cart);

  return (
    <button
     
      className="relative p-2 hover:bg-white/10 rounded-lg transition-colors"
    >
      <ShoppingCart className="w-6 h-6 text-white" />
      {totalItems > 0 && ( 
        <span className="absolute -top-1 -right-1 bg-[#C15364] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </button>
  );
};

export default CartIcon;
                