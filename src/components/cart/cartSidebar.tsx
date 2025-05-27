
// components/cart/CartSidebar.tsx
'use client';
import React from 'react';
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { closeCart, removeFromCart, updateQuantity, clearCart } from '../../store/slices/cartSlice';

const CartSidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, totalItems, totalAmount, isOpen } = useAppSelector((state) => state.cart);

  const handleUpdateQuantity = (id: string, quantity: number) => {
    dispatch(updateQuantity({ id, quantity }));
  };

  const handleRemoveItem = (id: string) => {
    dispatch(removeFromCart(id));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleCheckout = () => {
    // Implement checkout logic
    console.log('Proceeding to checkout with items:', items);
    alert('Proceeding to checkout!');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={() => dispatch(closeCart())}
      />
      
      {/* Cart Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-[#1A1D23] shadow-2xl z-50 transform transition-transform duration-300">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <ShoppingBag className="w-6 h-6 text-[#C15364]" />
              <h2 className="text-xl font-bold text-white">
                Cart ({totalItems})
              </h2>
            </div>
            <button
              onClick={() => dispatch(closeCart())}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="w-16 h-16 text-[#858B95] mx-auto mb-4" />
                <p className="text-[#858B95] text-lg mb-2">Your cart is empty</p>
                <p className="text-[#858B95] text-sm">Add some programs to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#0A0B0F]/50 rounded-xl p-4 border border-white/5"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#C15364]/20 to-[#858B95]/20 rounded-lg flex-shrink-0" />
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold text-sm mb-1 truncate">
                          {item.title}
                        </h3>
                        <p className="text-[#858B95] text-xs mb-2">
                          by {item.instructor}
                        </p>
                        <p className="text-[#858B95] text-xs mb-3">
                          {item.duration} • {item.category}
                        </p>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              className="p-1 hover:bg-white/10 rounded"
                            >
                              <Minus className="w-4 h-4 text-[#858B95]" />
                            </button>
                            <span className="text-white font-medium px-2">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              className="p-1 hover:bg-white/10 rounded"
                            >
                              <Plus className="w-4 h-4 text-[#858B95]" />
                            </button>
                          </div>
                          
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="p-1 hover:bg-red-500/20 rounded text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        {item.originalPrice && (
                          <p className="text-[#858B95] text-xs line-through">
                            ${item.originalPrice}
                          </p>
                        )}
                        <p className="text-white font-bold">
                          ${item.price}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Clear Cart Button */}
                {items.length > 0 && (
                  <button
                    onClick={handleClearCart}
                    className="w-full py-2 text-red-400 hover:text-red-300 text-sm border border-red-400/30 hover:border-red-300/50 rounded-lg transition-colors"
                  >
                    Clear Cart
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-white/10 p-6 space-y-4">
              {/* Total */}
              <div className="flex items-center justify-between text-lg font-bold text-white">
                <span>Total:</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
              
              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full py-4 bg-gradient-to-r from-[#C15364] to-[#858B95] text-white font-bold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                Proceed to Checkout
              </button>
              
              {/* Continue Shopping */}
              <button
                onClick={() => dispatch(closeCart())}
                className="w-full py-3 border border-white/20 text-white rounded-xl hover:bg-white/5 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;