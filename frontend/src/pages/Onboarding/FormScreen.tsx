import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store";
import { setCurrentStep } from "../../store/onboardingSlice";
import { updatePersonalDetails } from "../../store/bioDataSlice";
import {
  BackButton,
  Heading,
  SubLine,
  Eyebrow,
  Ornament,
} from "./OnboardingComponents";
import { getStrings } from "./strings";

const DHARMS: Record<string, { color: string; symbol: string }> = {
  hindu: { color: "#C9A030", symbol: "ॐ" },
  jain: { color: "#2A6B60", symbol: "卐" },
  sikh: { color: "#7A1418", symbol: "ੴ" },
};

export function FormScreen() {
  const dispatch = useDispatch();
  const { language, role, dharm } = useSelector(
    (state: RootState) => state.onboarding
  );
  const bioData = useSelector((state: RootState) => state.bioData);
  const t = getStrings(language || "english");

  const [fullName, setFullName] = useState(bioData.personalDetails.fullName);
  const [dob, setDob] = useState(bioData.personalDetails.dob);
  const [activeSection, setActiveSection] = useState("personal");

  const isParent = role === "parent";
  const dharmData = DHARMS[dharm || "hindu"];
  const canSave = fullName.trim().length > 1 && dob;

  const handleNext = () => {
    if (canSave) {
      dispatch(
        updatePersonalDetails({
          fullName,
          dob,
        })
      );
      dispatch(setCurrentStep("done"));
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  };

  const handleBack = () => {
    dispatch(setCurrentStep("auth"));
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const sections = ["personal", "family", "lineage"];

  return (
    <div className="animate-fadeUp py-5 pb-20">
      <BackButton onClick={handleBack}>{t.back}</BackButton>

      <div className="mt-6 mb-6">
        <div className="mb-3 flex items-center gap-2.5">
          <span
            style={{
              fontFamily: "'Noto Serif Devanagari', serif",
              fontSize: "1.1rem",
              color: dharmData.color,
              fontWeight: 600,
            }}
          >
            {dharmData.symbol}
          </span>
          <span className="text-xs font-black uppercase tracking-widest text-slate-500">
            {dharm?.toUpperCase()} Biodata
          </span>
        </div>

        <Heading size="clamp(2rem, 7vw, 2.875rem)">
          {isParent ? (
            <>
              The biodata for<br />
              <em className="font-cormorant">your child.</em>
            </>
          ) : (
            <>
              Your biodata,<br />
              <em className="font-cormorant">made with care.</em>
            </>
          )}
        </Heading>

        <SubLine>
          Fill out each section thoughtfully. Every detail you share helps families
          understand who {isParent ? "they" : "you"} are.
        </SubLine>
      </div>

      <div className="mb-5 flex gap-2 overflow-x-auto">
        {sections.map((s) => (
          <button
            key={s}
            onClick={() => setActiveSection(s)}
            className={`flex-shrink-0 rounded-none border-0 px-4 py-2.5 text-xs font-black uppercase tracking-widest transition-all ${
              activeSection === s
                ? "bg-slate-900 text-amber-50"
                : "bg-transparent text-slate-500"
            }`}
          >
            <span className="font-cormorant italic text-amber-600 mr-2">
              {s === "personal" ? "I." : s === "family" ? "II." : "III."}
            </span>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      <div
        className="border border-slate-200 bg-amber-50 p-8 mb-6"
        style={{
          borderTop: `3px solid linear-gradient(90deg, #B8860B 0%, #7A1418 50%, #B8860B 100%)`,
        }}
      >
        {activeSection === "personal" && (
          <div className="space-y-7">
            <div>
              <label className="mb-1 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-600">
                {isParent ? "Your child's full name" : "Full name"}
              </label>
              <input
                type="text"
                placeholder="e.g. Priya Sharma"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full border-0 border-b border-slate-300 bg-transparent pb-3 pt-3 font-dm outline-none transition-colors focus:border-amber-600"
              />
            </div>

            <div>
              <label className="mb-1 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-600">
                Date of birth
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full border-0 border-b border-slate-300 bg-transparent pb-3 pt-3 font-dm outline-none transition-colors focus:border-amber-600"
              />
            </div>

            <div>
              <label className="mb-1 text-xs font-black uppercase tracking-widest text-slate-600">
                Current city
              </label>
              <input
                type="text"
                placeholder="e.g. Mumbai, Maharashtra"
                className="w-full border-0 border-b border-slate-300 bg-transparent pb-3 pt-3 font-dm outline-none transition-colors focus:border-amber-600"
              />
            </div>
          </div>
        )}

        {activeSection === "family" && (
          <div className="space-y-7">
            <div>
              <label className="mb-1 text-xs font-black uppercase tracking-widest text-slate-600">
                Father's name
              </label>
              <input
                type="text"
                placeholder="e.g. Rakesh Sharma"
                className="w-full border-0 border-b border-slate-300 bg-transparent pb-3 pt-3 font-dm outline-none transition-colors focus:border-amber-600"
              />
            </div>

            <div>
              <label className="mb-1 text-xs font-black uppercase tracking-widest text-slate-600">
                Mother's name
              </label>
              <input
                type="text"
                placeholder="e.g. Sunita Sharma"
                className="w-full border-0 border-b border-slate-300 bg-transparent pb-3 pt-3 font-dm outline-none transition-colors focus:border-amber-600"
              />
            </div>
          </div>
        )}

        {activeSection === "lineage" && (
          <div className="space-y-7">
            <div>
              <label className="mb-1 text-xs font-black uppercase tracking-widest text-slate-600">
                Community
              </label>
              <input
                type="text"
                placeholder="e.g. Brahmin (Saraswat)"
                className="w-full border-0 border-b border-slate-300 bg-transparent pb-3 pt-3 font-dm outline-none transition-colors focus:border-amber-600"
              />
            </div>

            <div>
              <label className="mb-1 text-xs font-black uppercase tracking-widest text-slate-600">
                Gotra
              </label>
              <input
                type="text"
                placeholder="e.g. Kashyap"
                className="w-full border-0 border-b border-slate-300 bg-transparent pb-3 pt-3 font-dm outline-none transition-colors focus:border-amber-600"
              />
            </div>
          </div>
        )}
      </div>

      <div className="h-6" />

      <button
        disabled={!canSave}
        onClick={handleNext}
        className={`w-full rounded-none border-0 px-6 py-4 font-dm text-sm font-black uppercase tracking-[0.18em] transition-all duration-180 ${
          canSave
            ? "cursor-pointer bg-slate-900 text-amber-50 hover:bg-red-900"
            : "cursor-not-allowed bg-slate-900 text-amber-50 opacity-32"
        }`}
      >
        {t.finish}
      </button>

      {!canSave && (
        <p
          className="font-cormorant mt-3 text-center text-xs italic text-slate-500"
        >
          Add full name & date of birth to save.
        </p>
      )}
    </div>
  );
}
