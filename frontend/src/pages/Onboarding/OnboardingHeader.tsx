import type { OnboardingStep } from "../../store/onboardingSlice";

export function OnboardingHeader({
  currentStep,
}: {
  currentStep: OnboardingStep;
}) {
  const visibleSteps = ["language", "role", "dharm", "auth", "form"];
  const visibleIdx = Math.max(0, visibleSteps.indexOf(currentStep));

  return (
    <header
      className="sticky top-0 z-50 border-b px-6 py-4 backdrop-blur-sm"
      style={{
        background: "rgba(250, 246, 236, 0.92)",
        borderColor: "rgba(28, 25, 22, 0.08)",
      }}
    >
      <div className="mx-auto flex max-w-lg items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full border"
            style={{
              borderColor: "rgba(184, 134, 11, 0.4)",
              background: "rgba(184, 134, 11, 0.06)",
            }}
          >
            <span
              className="text-lg font-semibold"
              style={{
                fontFamily: "'Noto Serif Devanagari', serif",
                color: "#B8860B",
              }}
            >
              ऋ
            </span>
          </div>
          <div>
            <div
              className="leading-tight tracking-wide text-slate-900"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1.2rem",
                fontWeight: 600,
              }}
            >
              Rishte
            </div>
            <div
              className="text-slate-500"
              style={{
                fontSize: "0.62rem",
                fontWeight: 800,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                marginTop: 2,
              }}
            >
              by Daanyam
            </div>
          </div>
        </div>

        {currentStep !== "done" && currentStep !== "language" && (
          <div className="flex items-center gap-1.5">
            {visibleSteps.map((s, i) => (
              <div
                key={s}
                style={{
                  width: i === visibleIdx ? 22 : 6,
                  height: 6,
                  borderRadius: 999,
                  background:
                    i <= visibleIdx ? "#1C1916" : "rgba(28, 25, 22, 0.15)",
                  transition:
                    "all 360ms cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              />
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
