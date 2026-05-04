import { configureStore } from "@reduxjs/toolkit";
import { bioDataReducer, defaultBioDataState, type BioDataState } from "./bioDataSlice";
import { onboardingReducer } from "./onboardingSlice";

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
      personalDetails: {
        ...defaultBioDataState.personalDetails,
        ...rest.personalDetails
      },
      photos: {
        ...defaultBioDataState.photos,
        ...rest.photos
      },
      family: {
        ...defaultBioDataState.family,
        ...rest.family,
        siblings: rest.family?.siblings?.length ? rest.family.siblings : defaultBioDataState.family.siblings
      },
      horoscope: {
        ...defaultBioDataState.horoscope,
        ...rest.horoscope,
        computedKundli: {
          ...defaultBioDataState.horoscope.computedKundli,
          ...rest.horoscope?.computedKundli
        }
      },
      shares: []
    };
  } catch {
    return defaultBioDataState;
  }
}

export const store = configureStore({
  reducer: {
    bioData: bioDataReducer,
    onboarding: onboardingReducer
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
