import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import { Heading, SubLine, Eyebrow, Ornament } from "./OnboardingComponents";
import { getStrings } from "./strings";

const DHARMS: Record<
  string,
  { color: string; symbol: string; label: string }
> = {
  hindu: { color: "#C9A030", symbol: "ॐ", label: "Hindu" },
  jain: { color: "#2A6B60", symbol: "卐", label: "Jain" },
  sikh: { color: "#7A1418", symbol: "ੴ", label: "Sikh" },
};

export function SuccessScreen() {
  const navigate = useNavigate();
  const { language, dharm } = useSelector(
    (state: RootState) => state.onboarding
  );
  const bioData = useSelector((state: RootState) => state.bioData);
  const t = getStrings(language || "english");

  const dharmData = DHARMS[dharm || "hindu"];
  const name = bioData.personalDetails.fullName || "Your";
  const first = name.split(" ")[0];

  return (
    <div className="animate-fadeUp py-12 pb-20">
      <div className="mb-9 text-center">
        <div className="relative mx-auto mb-7 h-24 w-24">
          <svg width="96" height="96" viewBox="0 0 96 96">
            <circle
              cx="48"
              cy="48"
              r="44"
              stroke={dharmData.color}
              strokeWidth="0.5"
              fill="none"
              opacity="0.4"
            />
            <circle
              cx="48"
              cy="48"
              r="38"
              stroke={dharmData.color}
              strokeWidth="0.5"
              fill="none"
              opacity="0.6"
            />
            <circle
              cx="48"
              cy="48"
              r="32"
              stroke={dharmData.color}
              strokeWidth="1"
              fill={`${dharmData.color}10`}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="text-5xl font-semibold"
              style={{
                fontFamily: "'Noto Serif Devanagari', serif",
                color: dharmData.color,
              }}
            >
              {dharmData.symbol}
            </span>
          </div>
        </div>

        <Eyebrow color={`text-[${dharmData.color}]`}>Saved with care</Eyebrow>

        <Heading size="clamp(2.125rem, 7vw, 3rem)">
          <em className="font-cormorant">{first}'s biodata</em>
          <br />
          is ready.
        </Heading>

        <SubLine>
          A profile this important deserves to travel only where you want it to.
          Share it with whom you trust — and only them.
        </SubLine>
      </div>

      <div
        className="border border-slate-200 bg-amber-50 p-8 mb-6"
        style={{
          borderTop: `3px solid linear-gradient(90deg, #B8860B 0%, #7A1418 50%, #B8860B 100%)`,
        }}
      >
        <div className="mb-5 text-center">
          <div
            className="text-2xl"
            style={{
              fontFamily: "'Noto Serif Devanagari', serif",
              color: dharmData.color,
            }}
          >
            {dharmData.symbol}
          </div>
          <div className="text-xs font-black uppercase tracking-widest text-slate-500 mt-2">
            {dharmData.label} Biodata
          </div>
        </div>

        <h2
          className="font-cormorant mb-1 text-center text-3xl font-medium leading-tight"
          style={{ letterSpacing: "-0.01em" }}
        >
          {name}
        </h2>

        {bioData.personalDetails.city && (
          <p className="font-cormorant text-center text-sm italic text-slate-500">
            {bioData.personalDetails.city}
          </p>
        )}

        <Ornament color={`text-[${dharmData.color}]`} />

        <div className="grid grid-cols-2 gap-5">
          {[
            ["Born", bioData.personalDetails.dob || "—"],
            ["Height", bioData.personalDetails.height || "—"],
            ["Education", bioData.personalDetails.education || "—"],
            ["Profession", bioData.personalDetails.profession || "—"],
          ].map(([k, v]) => (
            <div key={k}>
              <div className="text-xs font-black uppercase tracking-widest text-slate-500 mb-1">
                {k}
              </div>
              <div
                className="font-cormorant text-sm text-slate-900 font-medium"
              >
                {v}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-2.5">
        <button
          onClick={() => navigate("/biodata/personal")}
          className="w-full rounded-none border-0 px-6 py-4 font-dm text-sm font-black uppercase tracking-[0.18em] bg-slate-900 text-amber-50 cursor-pointer hover:bg-red-900 transition-all duration-180"
        >
          Continue to Full Biodata
        </button>
        <button
          onClick={() => navigate("/dashboard")}
          className="w-full rounded-none border border-slate-300 bg-amber-50 px-6 py-4 font-dm text-sm font-black uppercase tracking-[0.18em] text-slate-900 cursor-pointer hover:border-amber-600/50 transition-all duration-180"
        >
          View Dashboard
        </button>
      </div>

      <p
        className="font-cormorant mt-8 text-center text-sm italic leading-relaxed text-slate-500"
      >
        "Marriages are made in heaven,<br />
        but the rishta begins here."
      </p>
    </div>
  );
}
