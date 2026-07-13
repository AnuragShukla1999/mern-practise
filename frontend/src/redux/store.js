import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
// import storage from "redux-persist/lib/storage"; // Uses localStorage by default

import storage from "redux-persist/es/storage";

import authReducer from './authSlice';
import { combineReducers } from "redux";
const persistConfig = {
  key: "root",
  storage, // Change to 'sessionStorage' if you want to persist only for the session
  whitelist: ["auth",], // Only persist auth state
};

const rootReducer = combineReducers({
  auth: authReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
export default store;