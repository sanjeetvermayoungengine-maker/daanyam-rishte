import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store";
import { setDharm, setCurrentStep } from "../../store/onboardingSlice";
import type { Dharm } from "../../store/onboardingSlice";
import {
  BackButton,
  Heading,
  SubLine,
  Eyebrow,
  Ornament,
} from "./OnboardingComponents";
import { getStrings } from "./strings";

const DHARMS: Record<
  Dharm,
  {
    label: string;
    script: string;
    symbol: string;
    color: string;
    glow: string;
  }
> = {
  hindu: {
    label: "Hindu",
    script: "सनातन",
    symbol: "ॐ",
    color: "#C9A030",
    glow: "rgba(201,160,48,0.3)",
  },
  jain: {
    label: "Jain",
    script: "जैन",
    symbol: "卐",
    color: "#2A6B60",
    glow: "rgba(42,107,96,0.3)",
  },
  sikh: {
    label: "Sikh",
    script: "ਸਿੱਖ",
    symbol: "ੴ",
    color: "#7A1418",
    glow: "rgba(122,20,24,0.25)",
  },
};

export function DharmScreen() {
  const dispatch = useDispatch();
  const { language, dharm } = useSelector((state: RootState) => state.onboarding);
  const t = getStrings(language || "english");

  const handleNext = () => {
    if (dharm) {
      dispatch(setCurrentStep("auth"));
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  };

  const handleBack = () => {
    dispatch(setCurrentStep("role"));
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  return (
    <div className="animate-fadeUp py-6 pb-16">
      <BackButton onClick={handleBack}>{t.back}</BackButton>

      <div className="mb-10 mt-8">
        <Eyebrow>{t.chooseFaith}</Eyebrow>
        <Heading>
          Begin with<br />
          <em className="font-cormorant">your dharm.</em>
        </Heading>
        <SubLine>{t.chooseFaithSub}</SubLine>
      </div>

      <div className="mb-9 grid grid-cols-3 gap-3">
        {Object.entries(DHARMS).map(([id, d]) => {
          const sel = dharm === id;
          return (
            <button
              key={id}
              onClick={() => dispatch(setDharm(id as Dharm))}
              className={`transition-all duration-240 relative overflow-hidden border ${
                sel
                  ? "border-current bg-current text-white"
                  : "border-slate-200 bg-amber-50 hover:-translate-y-1 hover:border-current"
              }`}
              style={{
                borderColor: sel ? d.color : undefined,
                backgroundColor: sel ? d.color : undefined,
                "--tile-color": d.color,
                "--tile-glow": d.glow,
              } as any}
            >
              {!sel && (
                <div
                  className="absolute inset-0 opacity-0 transition-opacity duration-320 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at center, ${d.glow}, transparent 60%)`,
                  }}
                />
              )}

              <div className="flex flex-col items-center justify-center gap-1 px-4 py-6">
                <div
                  className="text-4xl font-semibold leading-none"
                  style={{
                    color: sel ? "#fff" : d.color,
                    fontFamily: id === "jain" ? "'DM Sans', sans-serif" : "'Noto Serif Devanagari', serif",
                  }}
                >
                  {d.symbol}
                </div>
                <div
                  className="font-cormorant text-lg font-medium leading-none"
                  style={{ color: sel ? "#fff" : undefined }}
                >
                  {d.label}
                </div>
                <div
                  className="text-xs leading-none"
                  style={{
                    color: sel ? "rgba(255,255,255,0.7)" : "#8A7B6F",
                    fontFamily: "'Noto Serif Devanagari', serif",
                  }}
                >
                  {d.script}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <button
        onClick={handleNext}
        disabled={!dharm}
        className={`w-full rounded-none border-0 px-6 py-4 font-dm text-sm font-black uppercase tracking-[0.18em] transition-all duration-180 ${
          dharm
            ? "cursor-pointer bg-slate-900 text-amber-50 hover:bg-red-900"
            : "cursor-not-allowed bg-slate-900 text-amber-50 opacity-32"
        }`}
      >
        {t.next}
      </button>
    </div>
  );
}
