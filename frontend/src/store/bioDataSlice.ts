import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type TemplateId = "traditional" | "modern" | "premium" | "split";
export type MarsDosha = "" | "yes" | "no" | "unknown";

export interface PersonalDetails {
  fullName: string;
  dob: string;
  phone: string;
  email: string;
  religion: string;
  caste: string;
  height: string;
  profession: string;
  education: string;
  income: string;
}

export interface BioPhoto {
  id: string;
  url: string;
  name: string;
  uploadedAt: string;
}

export interface PhotosState {
  items: BioPhoto[];
  primaryPhotoId: string | null;
}

export interface Sibling {
  id: string;
  name: string;
  occupation: string;
}

export interface FamilyDetails {
  fatherName: string;
  motherName: string;
  fatherOccupation: string;
  motherOccupation: string;
  siblings: Sibling[];
  familyType: "" | "Joint" | "Nuclear";
  location: string;
}

export interface HoroscopeDetails {
  dob: string;
  birthTime: string;
  birthPlace: string;
  rashi: string;
  nakshatra: string;
  gotra: string;
  marsDosha: MarsDosha;
}

export interface SharePermissions {
  viewBasic: boolean;
  viewPhotos: boolean;
  viewHoroscope: boolean;
  viewContact: boolean;
}

export interface ShareRecord {
  id: string;
  token: string;
  recipient: string;
  permissions: SharePermissions;
  expiryDate: string;
  createdAt: string;
  lastAccessed: string | null;
  status: "active" | "revoked";
}

export interface BioDataState {
  personalDetails: PersonalDetails;
  photos: PhotosState;
  family: FamilyDetails;
  horoscope: HoroscopeDetails;
  template: TemplateId;
  currentStep: number;
  shares: ShareRecord[];
  submittedAt: string | null;
  isLoading: boolean;
  error: string | null;
}

const defaultPersonalDetails: PersonalDetails = {
  fullName: "",
  dob: "",
  phone: "",
  email: "",
  religion: "",
  caste: "",
  height: "",
  profession: "",
  education: "",
  income: ""
};

const defaultFamily: FamilyDetails = {
  fatherName: "",
  motherName: "",
  fatherOccupation: "",
  motherOccupation: "",
  siblings: [{ id: "sibling-1", name: "", occupation: "" }],
  familyType: "",
  location: ""
};

const defaultHoroscope: HoroscopeDetails = {
  dob: "",
  birthTime: "",
  birthPlace: "",
  rashi: "",
  nakshatra: "",
  gotra: "",
  marsDosha: ""
};

export const defaultBioDataState: BioDataState = {
  personalDetails: defaultPersonalDetails,
  photos: {
    items: [],
    primaryPhotoId: null
  },
  family: defaultFamily,
  horoscope: defaultHoroscope,
  template: "traditional",
  currentStep: 1,
  shares: [],
  submittedAt: null,
  isLoading: false,
  error: null
};

const makeId = (prefix: string) => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

const makeShareToken = () => makeId("share").replace(/[^a-zA-Z0-9]/g, "").slice(0, 20);

const bioDataSlice = createSlice({
  name: "bioData",
  initialState: defaultBioDataState,
  reducers: {
    updatePersonalDetails(state, action: PayloadAction<Partial<PersonalDetails>>) {
      state.personalDetails = {
        ...state.personalDetails,
        ...action.payload
      };

      if (action.payload.dob && !state.horoscope.dob) {
        state.horoscope.dob = action.payload.dob;
      }
    },
    updatePhotos(state, action: PayloadAction<PhotosState>) {
      state.photos = action.payload;
    },
    addPhoto(state, action: PayloadAction<BioPhoto>) {
      state.photos.items.push(action.payload);
      state.photos.primaryPhotoId = state.photos.primaryPhotoId ?? action.payload.id;
    },
    removePhoto(state, action: PayloadAction<string>) {
      state.photos.items = state.photos.items.filter((photo) => photo.id !== action.payload);

      if (state.photos.primaryPhotoId === action.payload) {
        state.photos.primaryPhotoId = state.photos.items[0]?.id ?? null;
      }
    },
    setPrimaryPhoto(state, action: PayloadAction<string>) {
      if (state.photos.items.some((photo) => photo.id === action.payload)) {
        state.photos.primaryPhotoId = action.payload;
      }
    },
    updateFamily(state, action: PayloadAction<Partial<Omit<FamilyDetails, "siblings">>>) {
      state.family = {
        ...state.family,
        ...action.payload
      };
    },
    addSibling: {
      reducer(state, action: PayloadAction<Sibling>) {
        state.family.siblings.push(action.payload);
      },
      prepare() {
        return {
          payload: {
            id: makeId("sibling"),
            name: "",
            occupation: ""
          }
        };
      }
    },
    updateSibling(state, action: PayloadAction<{ id: string; updates: Partial<Omit<Sibling, "id">> }>) {
      const sibling = state.family.siblings.find((item) => item.id === action.payload.id);

      if (sibling) {
        Object.assign(sibling, action.payload.updates);
      }
    },
    removeSibling(state, action: PayloadAction<string>) {
      state.family.siblings = state.family.siblings.filter((sibling) => sibling.id !== action.payload);

      if (state.family.siblings.length === 0) {
        state.family.siblings.push({ id: makeId("sibling"), name: "", occupation: "" });
      }
    },
    updateHoroscope(state, action: PayloadAction<Partial<HoroscopeDetails>>) {
      state.horoscope = {
        ...state.horoscope,
        ...action.payload
      };
    },
    setTemplate(state, action: PayloadAction<TemplateId>) {
      state.template = action.payload;
    },
    setCurrentStep(state, action: PayloadAction<number>) {
      state.currentStep = action.payload;
    },
    submitBioData(state, action: PayloadAction<string>) {
      state.submittedAt = action.payload;
      state.currentStep = 6;
      state.error = null;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    createShare: {
      reducer(state, action: PayloadAction<ShareRecord>) {
        state.shares.unshift(action.payload);
      },
      prepare(input: Omit<ShareRecord, "id" | "token" | "createdAt" | "lastAccessed" | "status">) {
        const id = makeId("share");

        return {
          payload: {
            ...input,
            id,
            token: makeShareToken(),
            createdAt: new Date().toISOString(),
            lastAccessed: null,
            status: "active" as const
          }
        };
      }
    },
    updateSharePermissions(state, action: PayloadAction<{ id: string; permissions: SharePermissions }>) {
      const share = state.shares.find((item) => item.id === action.payload.id);

      if (share) {
        share.permissions = action.payload.permissions;
      }
    },
    revokeShare(state, action: PayloadAction<string>) {
      const share = state.shares.find((item) => item.id === action.payload);

      if (share) {
        share.status = "revoked";
      }
    },
    markShareAccessed(state, action: PayloadAction<string>) {
      const share = state.shares.find((item) => item.token === action.payload);

      if (share) {
        share.lastAccessed = new Date().toISOString();
      }
    },
    resetForm() {
      return defaultBioDataState;
    }
  }
});

export const {
  addPhoto,
  addSibling,
  createShare,
  markShareAccessed,
  removePhoto,
  removeSibling,
  resetForm,
  revokeShare,
  setCurrentStep,
  setError,
  setLoading,
  setPrimaryPhoto,
  setTemplate,
  submitBioData,
  updateFamily,
  updateHoroscope,
  updatePersonalDetails,
  updatePhotos,
  updateSharePermissions,
  updateSibling
} = bioDataSlice.actions;

export const bioDataReducer = bioDataSlice.reducer;
