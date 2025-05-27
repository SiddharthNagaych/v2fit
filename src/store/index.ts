import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import favoritesReducer from './slices/favoritesSlice';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from '../lib/redux/storage'; // or '@/lib/redux/storage'



// Remove the expireTransform unless you specifically need it
const cartPersistConfig = {
  key: 'cart',
  storage,
  version: 1,
  // Whitelist only the properties you want to persist
  whitelist: ['items', 'totalItems', 'totalAmount', 'appliedPromo', 'discountAmount']
};

const favoritesPersistConfig = {
  key: 'favorites',
  storage,
  version: 1
};

const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer);
const persistedFavoritesReducer = persistReducer(favoritesPersistConfig, favoritesReducer);

export const store = configureStore({
  reducer: {
    cart: persistedCartReducer,
    favorites: persistedFavoritesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;