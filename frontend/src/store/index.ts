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

    const parsed = JSON.parse(storedValue) as Partial<BioDataState>;
    // Shares are server-backed; keep local draft only.
    const { shares: _ignoredShares, ...rest } = parsed;
    return {
      ...defaultBioDataState,
      ...rest,
      shares: []
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
    const state = store.getState().bioData;
    const { shares: _ignoredShares, ...draftOnly } = state;
    window.localStorage.setItem(storageKey, JSON.stringify(draftOnly));
  });
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
