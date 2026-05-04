import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store";
import { LanguageScreen } from "./LanguageScreen";
import { RoleScreen } from "./RoleScreen";
import { DharmScreen } from "./DharmScreen";
import { AuthScreen } from "./AuthScreen";
import { FormScreen } from "./FormScreen";
import { SuccessScreen } from "./SuccessScreen";
import { OnboardingHeader } from "./OnboardingHeader";

const FLOW = ["language", "role", "dharm", "auth", "form", "done"];

export function Onboarding() {
  const dispatch = useDispatch();
  const { currentStep, language, role, dharm, isAuthenticated } = useSelector(
    (state: RootState) => state.onboarding
  );

  // Redirect to login if user hasn't gone through onboarding
  useEffect(() => {
    if (
      currentStep === "form" &&
      isAuthenticated &&
      language &&
      role &&
      dharm
    ) {
      // User can now access the biodata form
    }
  }, [currentStep, isAuthenticated, language, role, dharm]);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#FAF6EC" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=DM+Sans:wght@400;500;600;700;800;900&display=swap');

        .font-cormorant { font-family: 'Cormorant Garamond', serif; }
        .font-dm { font-family: 'DM Sans', sans-serif; }
        .animate-fadeUp {
          animation: fadeUp 380ms cubic-bezier(0.4, 0, 0.2, 1) both;
        }
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
      `}</style>

      <OnboardingHeader currentStep={currentStep} />

      <main className="flex-1 mx-auto w-full max-w-sm px-6 py-0 md:max-w-lg">
        <div key={currentStep}>
          {currentStep === "language" && <LanguageScreen />}
          {currentStep === "role" && <RoleScreen />}
          {currentStep === "dharm" && <DharmScreen />}
          {currentStep === "auth" && <AuthScreen />}
          {currentStep === "form" && <FormScreen />}
          {currentStep === "done" && <SuccessScreen />}
        </div>
      </main>
    </div>
  );
}
