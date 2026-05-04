import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type Language = "english" | "hindi" | "tamil";
export type Role = "self" | "parent";
export type Dharm = "hindu" | "jain" | "sikh";
export type OnboardingStep = "language" | "role" | "dharm" | "auth" | "form" | "done";

export interface OnboardingState {
  language: Language | null;
  role: Role | null;
  dharm: Dharm | null;
  phone: string;
  isAuthenticated: boolean;
  currentStep: OnboardingStep;
  completed: boolean;
}

const defaultOnboardingState: OnboardingState = {
  language: null,
  role: null,
  dharm: null,
  phone: "",
  isAuthenticated: false,
  currentStep: "language",
  completed: false,
};

const onboardingSlice = createSlice({
  name: "onboarding",
  initialState: defaultOnboardingState,
  reducers: {
    setLanguage(state, action: PayloadAction<Language>) {
      state.language = action.payload;
    },
    setRole(state, action: PayloadAction<Role>) {
      state.role = action.payload;
    },
    setDharm(state, action: PayloadAction<Dharm>) {
      state.dharm = action.payload;
    },
    setPhone(state, action: PayloadAction<string>) {
      state.phone = action.payload;
    },
    setAuthenticated(state, action: PayloadAction<boolean>) {
      state.isAuthenticated = action.payload;
    },
    setCurrentStep(state, action: PayloadAction<OnboardingStep>) {
      state.currentStep = action.payload;
    },
    setCompleted(state, action: PayloadAction<boolean>) {
      state.completed = action.payload;
    },
    resetOnboarding() {
      return defaultOnboardingState;
    },
  },
});

export const {
  setLanguage,
  setRole,
  setDharm,
  setPhone,
  setAuthenticated,
  setCurrentStep,
  setCompleted,
  resetOnboarding,
} = onboardingSlice.actions;

export const onboardingReducer = onboardingSlice.reducer;
