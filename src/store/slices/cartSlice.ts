// store/slices/cartSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';


export const syncCartWithServer = createAsyncThunk(
  'cart/syncWithServer',
  async (cart: CartState, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/cart/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          items: cart.items,
          totalItems: cart.totalItems,
          totalAmount: cart.totalAmount,
          appliedPromo: cart.appliedPromo,
          discountAmount: cart.discountAmount
        })
      });
      
      if (!response.ok) {
        throw new Error('Sync failed');
      }
      
      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const validateCart = createAsyncThunk(
  'cart/validate',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { cart } = getState() as { cart: CartState };
      const response = await fetch('/api/cart/get', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Validation failed');
      }
      
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totalItems: 0,
    totalAmount: 0,
    isOpen: false,
    appliedPromo: null,
    discountAmount: 0,
    lastSynced: null,
    status: 'idle',
    error: null
  } as CartState,
  reducers: {
   addToCart: (state, action: PayloadAction<Omit<CartItem, 'quantity'>>) => {
  if (!Array.isArray(state.items)) {
    state.items = []; // In case of invalid state
  }

  const payload = {
    ...action.payload,
    originalPrice: action.payload.originalPrice ?? action.payload.price ?? 0
  };

  const existingItem = state.items.find((item: CartItem) => item.id === payload.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    state.items.push({ ...payload, quantity: 1 });
  }

  cartSlice.caseReducers.calculateTotals(state);
},

    
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item: CartItem) => item.id !== action.payload);
      cartSlice.caseReducers.calculateTotals(state);
    },
    
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item: CartItem) => item.id === id);
      
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter((item: CartItem) => item.id !== id);
        } else {
          item.quantity = quantity;
        }
      }
      
      cartSlice.caseReducers.calculateTotals(state);
    },
    
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalAmount = 0;
      state.appliedPromo = null;
      state.discountAmount = 0;
    },
    
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    
    openCart: (state) => {
      state.isOpen = true;
    },
    
    closeCart: (state) => {
      state.isOpen = false;
    },
    
    applyPromoCode: (state, action: PayloadAction<string>) => {
      const validPromoCodes = ['FITNESS10', 'SAVE10'];
      const code = action.payload.toUpperCase();
      
      if (validPromoCodes.includes(code)) {
        state.appliedPromo = code;
        // Apply 10% discount
        state.discountAmount = state.totalAmount * 0.1;
      }
    },
    
    removePromoCode: (state) => {
      state.appliedPromo = null;
      state.discountAmount = 0;
    },
    
    calculateTotals: (state) => {
      state.totalItems = state.items.reduce(
        (total: number, item: CartItem) => total + item.quantity, 
        0
      );
      state.totalAmount = state.items.reduce(
        (total: number, item: CartItem) => total + (item.price * item.quantity), 
        0
      );
      
      // Reapply discount if promo is active
      if (state.appliedPromo) {
        state.discountAmount = state.totalAmount * 0.1;
      } else {
        state.discountAmount = 0;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(syncCartWithServer.pending, (state) => {
        state.status = 'syncing';
        state.error = null;
      })
      .addCase(syncCartWithServer.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.totalItems = action.payload.totalItems;
        state.totalAmount = action.payload.totalAmount;
        state.appliedPromo = action.payload.appliedPromo;
        state.discountAmount = action.payload.discountAmount;
        state.lastSynced = Date.now();
        state.status = 'idle';
      })
      .addCase(syncCartWithServer.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload as string;
      })
      .addCase(validateCart.fulfilled, (state, action) => {
        // Update cart with validated items
        state.items = action.payload.items;
        state.totalItems = action.payload.totalItems;
        state.totalAmount = action.payload.totalAmount;
        state.lastSynced = Date.now();
      });
  }
});

// Add automatic sync middleware
// export const cartMiddleware = (store: any) => (next: any) => (action: any) => {
//   const result = next(action);
  
//   // Sync after certain actions
//   const syncActions = [
//     'cart/addToCart',
//     'cart/removeFromCart',
//     'cart/updateQuantity',
//     'cart/applyPromoCode',
//     'cart/removePromoCode'
//   ];
  
//   if (syncActions.includes(action.type)) {
//     const { cart } = store.getState();
//     // Debounce sync to avoid too many requests
//     setTimeout(() => store.dispatch(syncCartWithServer(cart)), 1000);
//   }
  
//   return result;
// };

export const { 
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleCart,
  openCart,
  closeCart,
  applyPromoCode,
  removePromoCode,
  calculateTotals,
} = cartSlice.actions;

export default cartSlice.reducer;