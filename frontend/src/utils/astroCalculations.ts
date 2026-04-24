export const rashiOptions = [
  "Mesh",
  "Vrishabh",
  "Mithun",
  "Kark",
  "Simha",
  "Kanya",
  "Tula",
  "Vrishchik",
  "Dhanu",
  "Makar",
  "Kumbh",
  "Meen"
];

export const nakshatraOptions = [
  "Ashwini",
  "Bharani",
  "Krittika",
  "Rohini",
  "Mrigashira",
  "Ardra",
  "Punarvasu",
  "Pushya",
  "Ashlesha",
  "Magha",
  "Purva Phalguni",
  "Uttara Phalguni",
  "Hasta",
  "Chitra",
  "Swati",
  "Vishakha",
  "Anuradha",
  "Jyeshtha",
  "Mula",
  "Purva Ashadha",
  "Uttara Ashadha",
  "Shravana",
  "Dhanishta",
  "Shatabhisha",
  "Purva Bhadrapada",
  "Uttara Bhadrapada",
  "Revati"
];

export function suggestRashiFromDate(value: string) {
  if (!value) {
    return "";
  }

  const month = Number(value.slice(5, 7));
  return rashiOptions[(month - 1) % rashiOptions.length] ?? "";
}
