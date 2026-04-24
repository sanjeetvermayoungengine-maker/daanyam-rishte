import { configureStore } from "@reduxjs/toolkit";
import { bioDataReducer, defaultBioDataState, type BioDataState } from "./bioDataSlice";

const storageKey = "rishta:biodata-state";

function loadBioDataState(): BioDataState {
  if (typeof window === "undefined") {
    return defaultBioDataState;
  }

  try {
    const storedValue = window.localStorage.getItem(storageKey);
    if (!storedValue) {
      return defaultBioDataState;
    }

    return {
      ...defaultBioDataState,
      ...JSON.parse(storedValue)
    };
  } catch {
    return defaultBioDataState;
  }
}

export const store = configureStore({
  reducer: {
    bioData: bioDataReducer
  },
  preloadedState: {
    bioData: loadBioDataState()
  }
});

if (typeof window !== "undefined") {
  store.subscribe(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(store.getState().bioData));
  });
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
