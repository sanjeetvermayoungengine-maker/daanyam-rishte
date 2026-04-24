import type { SharePermissions } from "../store/bioDataSlice";

export const defaultSharePermissions: SharePermissions = {
  viewBasic: true,
  viewPhotos: true,
  viewHoroscope: false,
  viewContact: false
};
