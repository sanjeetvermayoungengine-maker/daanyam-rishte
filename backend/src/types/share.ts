export interface SharePermissions {
  viewBasic: boolean;
  viewPhotos: boolean;
  viewHoroscope: boolean;
  viewContact: boolean;
}

export interface BioDataSnapshot {
  personalDetails: Record<string, string>;
  photos: {
    items: Array<{ id: string; url: string; name: string; uploadedAt: string }>;
    primaryPhotoId: string | null;
  };
  family: {
    fatherName: string;
    motherName: string;
    fatherOccupation: string;
    motherOccupation: string;
    siblings: Array<{ id: string; name: string; occupation: string }>;
    familyType: string;
    location: string;
  };
  horoscope: {
    dob: string;
    birthTime: string;
    birthPlace: string;
    rashi: string;
    nakshatra: string;
    gotra: string;
    marsDosha: string;
  };
  template: "traditional" | "modern" | "premium";
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

export interface StoredShare {
  ownerUserId: string;
  record: ShareRecord;
  bioData: BioDataSnapshot;
}

export interface CreateShareInput {
  ownerUserId: string;
  recipient: string;
  expiryDate: string;
  permissions: SharePermissions;
  bioData: BioDataSnapshot;
}
