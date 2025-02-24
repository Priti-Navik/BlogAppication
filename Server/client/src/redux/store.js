import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userReducer from './user/userSlice';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import themeReducer from './theme/themeSlice'

// Combine your reducers
const rootReducer = combineReducers({
  user: userReducer,
  theme:themeReducer,
});

// Persist configuration
const persistConfig = {
  key: 'root', // Fix the typo, remove the space
  storage,
  version: 1,
};

// Wrap rootReducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the store with the persisted reducer
export const store = configureStore({
  reducer: persistedReducer, // Use the persistedReducer here
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializableCheck to avoid errors with non-serializable values
    }),
});

// Create the persistor
export const persistor = persistStore(store);
