import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store";
import { setLanguage, setCurrentStep } from "../../store/onboardingSlice";
import type { Language } from "../../store/onboardingSlice";

const LANGUAGES: Record<Language, { native: string; label: string; sub: string }> = {
  english: {
    native: "English",
    label: "English",
    sub: "Continue in English",
  },
  hindi: {
    native: "हिन्दी",
    label: "Hindi",
    sub: "हिन्दी में जारी रखें",
  },
  tamil: {
    native: "தமிழ்",
    label: "Tamil",
    sub: "தமிழில் தொடரவும்",
  },
};

export function LanguageScreen() {
  const dispatch = useDispatch();
  const { language } = useSelector((state: RootState) => state.onboarding);

  const handleNext = () => {
    if (language) {
      dispatch(setCurrentStep("role"));
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  };

  return (
    <div className="animate-fadeUp py-12 pb-16">
      <div className="mb-12 text-center">
        <p className="mb-4 text-sm font-black uppercase tracking-widest text-amber-600">
          Welcome • स्वागत • வரவேற்கிறோம்
        </p>
        <h1 className="font-cormorant mb-6 text-5xl font-medium leading-tight tracking-tight text-slate-900">
          The first profile<br />
          <em className="font-cormorant">that truly matters.</em>
        </h1>
        <p className="font-cormorant mx-auto max-w-sm text-xl italic leading-relaxed text-slate-600">
          You marry once. Your biodata deserves the same care.
        </p>
      </div>

      <div className="mx-auto mb-9 flex max-w-xs items-center gap-3">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-600/35 to-transparent" />
        <svg className="h-4 w-4 text-amber-600" viewBox="0 0 14 14" fill="none">
          <path
            d="M7 1L8.5 5.5L13 7L8.5 8.5L7 13L5.5 8.5L1 7L5.5 5.5L7 1Z"
            fill="currentColor"
          />
        </svg>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-600/35 to-transparent" />
      </div>

      <p className="mb-4 text-center text-xs font-black uppercase tracking-widest text-slate-500">
        Choose your language
      </p>

      <div className="mb-9 grid grid-cols-3 gap-2">
        {Object.entries(LANGUAGES).map(([key, lang]) => (
          <button
            key={key}
            onClick={() => dispatch(setLanguage(key as Language))}
            className={`transition-all duration-200 cursor-pointer rounded-none border border-slate-200 px-4 py-6 text-center hover:-translate-y-0.5 hover:border-amber-600/50 ${
              language === key
                ? "border-slate-900 bg-slate-900 text-amber-50"
                : "bg-amber-50 text-slate-900"
            }`}
          >
            <div
              className={`font-cormorant mb-2 text-lg font-semibold leading-none ${
                key === "english" ? "text-3xl" : "text-4xl"
              }`}
            >
              {lang.native}
            </div>
            <div
              className={`text-xs font-bold uppercase tracking-widest ${
                language === key ? "text-amber-50/55" : "text-slate-500"
              }`}
            >
              {lang.label}
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={handleNext}
        disabled={!language}
        className={`w-full rounded-none border-0 px-6 py-4 font-dm text-sm font-black uppercase tracking-[0.18em] transition-all duration-180 ${
          language
            ? "cursor-pointer bg-slate-900 text-amber-50 hover:bg-red-900"
            : "cursor-not-allowed bg-slate-900 text-amber-50 opacity-32"
        }`}
      >
        Continue
      </button>
    </div>
  );
}
