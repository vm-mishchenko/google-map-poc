import {configureStore, EnhancedStore} from "@reduxjs/toolkit";
import rootReducer, {RootState} from "./reducers/root-reducer";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";

let store: EnhancedStore<RootState>;

function initStore(preloadedState = {}) {
  return configureStore({
    reducer: rootReducer,
    preloadedState: {
      ...preloadedState
    },
  });
}

/**
 * Called:
 * 1. on server side during Server Side Rendering and
 * 2. on client side during ReactJs initialization
 */
export const initializeStore = (preloadedState: any) => {
  if (isServerSideRendering()) {
    return initStore(preloadedState);
  }

  if (isFirstClientSidePageRendering()) {
    // "preloadedState" comes in browser with the initial rendered page
    store = initStore({
      ...preloadedState,
    });
  } else if (preloadedState) {
    // Client side navigation with some additional data from server for the
    // current page
    const newPreloadedState = {
      ...store.getState(), ...preloadedState,
    };

    store = initStore(newPreloadedState);
  }

  return store;
};

function isServerSideRendering() {
  return typeof window === 'undefined';
}

function isFirstClientSidePageRendering() {
  return !store;
}

// Inferred type
type Store = ReturnType<typeof initStore>
export type AppDispatch = Store['dispatch'];

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
