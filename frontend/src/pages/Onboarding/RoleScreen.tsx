import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store";
import { setRole, setCurrentStep } from "../../store/onboardingSlice";
import type { Role } from "../../store/onboardingSlice";
import { BackButton, Heading, SubLine, Eyebrow } from "./OnboardingComponents";
import { getStrings } from "./strings";

const ROLES: Record<Role, { num: string; title: string; desc: string }> = {
  self: {
    num: "I",
    title: "For myself",
    desc: "I am creating my own biodata",
  },
  parent: {
    num: "II",
    title: "For my child",
    desc: "I am a parent finding a match for my son or daughter",
  },
};

export function RoleScreen() {
  const dispatch = useDispatch();
  const { language, role } = useSelector((state: RootState) => state.onboarding);
  const t = getStrings(language || "english");

  const handleNext = () => {
    if (role) {
      dispatch(setCurrentStep("dharm"));
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  };

  const handleBack = () => {
    dispatch(setCurrentStep("language"));
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  return (
    <div className="animate-fadeUp py-6 pb-16">
      <BackButton onClick={handleBack}>{t.back}</BackButton>

      <div className="mb-10 mt-8">
        <Eyebrow>{t.appTag}</Eyebrow>
        <Heading>{t.role_title}</Heading>
        <SubLine>{t.role_sub}</SubLine>
      </div>

      <div className="mb-8 grid gap-3">
        {Object.entries(ROLES).map(([key, r]) => (
          <button
            key={key}
            onClick={() => dispatch(setRole(key as Role))}
            className={`transition-all duration-220 relative overflow-hidden border px-6 py-7 text-left ${
              role === key
                ? "border-slate-900 bg-slate-900 text-amber-50"
                : "border-slate-200 bg-amber-50 hover:-translate-y-0.5 hover:border-amber-600/50"
            }`}
          >
            {role !== key && (
              <div
                className="absolute inset-0 opacity-0 transition-opacity duration-280"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(184,134,11,0.06))",
                }}
              />
            )}

            <div className="relative flex items-start gap-5">
              <span
                className={`font-cormorant min-w-7 text-lg font-medium italic tracking-wide ${
                  role === key ? "text-amber-600/90" : "text-amber-600"
                }`}
              >
                {r.num}
              </span>
              <div className="flex-1 min-w-0">
                <h3 className="font-cormorant mb-1 text-2xl font-medium leading-tight tracking-tight">
                  {r.title}
                </h3>
                <p
                  className={`text-sm leading-relaxed ${
                    role === key ? "text-amber-50/60" : "text-slate-500"
                  }`}
                >
                  {r.desc}
                </p>
              </div>
              {role === key && (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  className="mt-1 flex-shrink-0"
                >
                  <path
                    d="M3 9L7 13L15 5"
                    stroke="#B8860B"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={handleNext}
        disabled={!role}
        className={`w-full rounded-none border-0 px-6 py-4 font-dm text-sm font-black uppercase tracking-[0.18em] transition-all duration-180 ${
          role
            ? "cursor-pointer bg-slate-900 text-amber-50 hover:bg-red-900"
            : "cursor-not-allowed bg-slate-900 text-amber-50 opacity-32"
        }`}
      >
        {t.next}
      </button>
    </div>
  );
}
