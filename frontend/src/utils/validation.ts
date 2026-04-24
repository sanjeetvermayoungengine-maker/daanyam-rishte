import type { FamilyDetails, HoroscopeDetails, PersonalDetails } from "../store/bioDataSlice";

export type ValidationErrors<T> = Partial<Record<keyof T, string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[+()\d\s-]{8,15}$/;

export function validatePersonalDetails(values: PersonalDetails): ValidationErrors<PersonalDetails> {
  const errors: ValidationErrors<PersonalDetails> = {};

  if (!values.fullName.trim()) {
    errors.fullName = "Full name is required";
  }

  if (!values.dob) {
    errors.dob = "Date of birth is required";
  }

  if (!values.phone.trim()) {
    errors.phone = "Phone number is required";
  } else if (!phonePattern.test(values.phone.trim())) {
    errors.phone = "Enter a valid phone number";
  }

  if (!values.email.trim()) {
    errors.email = "Email is required";
  } else if (!emailPattern.test(values.email.trim())) {
    errors.email = "Enter a valid email";
  }

  if (!values.religion) {
    errors.religion = "Religion is required";
  }

  if (!values.height) {
    errors.height = "Height is required";
  }

  if (!values.profession.trim()) {
    errors.profession = "Profession is required";
  }

  if (!values.education) {
    errors.education = "Education is required";
  }

  if (!values.income) {
    errors.income = "Income range is required";
  }

  return errors;
}

export function validateFamilyDetails(values: FamilyDetails): ValidationErrors<FamilyDetails> {
  const errors: ValidationErrors<FamilyDetails> = {};

  if (!values.fatherName.trim()) {
    errors.fatherName = "Father's name is required";
  }

  if (!values.motherName.trim()) {
    errors.motherName = "Mother's name is required";
  }

  if (!values.familyType) {
    errors.familyType = "Select a family type";
  }

  if (!values.location.trim()) {
    errors.location = "Family location is required";
  }

  return errors;
}

export function validateHoroscopeDetails(values: HoroscopeDetails): ValidationErrors<HoroscopeDetails> {
  const errors: ValidationErrors<HoroscopeDetails> = {};

  if (!values.dob) {
    errors.dob = "Birth date is required";
  }

  if (!values.birthTime) {
    errors.birthTime = "Birth time is required";
  }

  if (!values.birthPlace.trim()) {
    errors.birthPlace = "Birth place is required";
  }

  if (!values.rashi) {
    errors.rashi = "Select a rashi";
  }

  if (!values.nakshatra) {
    errors.nakshatra = "Select a nakshatra";
  }

  return errors;
}

export function hasErrors<T extends object>(errors: ValidationErrors<T>) {
  return Object.keys(errors).length > 0;
}
