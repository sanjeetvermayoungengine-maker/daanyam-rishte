import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store";
import {
  setPhone,
  setAuthenticated,
  setCurrentStep,
} from "../../store/onboardingSlice";
import {
  BackButton,
  Heading,
  SubLine,
  Eyebrow,
} from "./OnboardingComponents";
import { getStrings } from "./strings";
import { useAuth } from "../../auth/AuthContext";

type AuthPhase = "phone" | "otp";

export function AuthScreen() {
  const dispatch = useDispatch();
  const { language, phone } = useSelector((state: RootState) => state.onboarding);
  const t = getStrings(language || "english");
  const { sendOtp, verifyOtp, signInWithGoogle, isConfigured, user } = useAuth();

  const [phase, setPhase] = useState<AuthPhase>("phone");
  const [localPhone, setLocalPhone] = useState(phone || "");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [messageId, setMessageId] = useState<number | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // If a real Supabase session already exists (e.g. user reloads mid-flow),
  // skip auth entirely and advance to the form.
  useEffect(() => {
    if (user) {
      dispatch(setAuthenticated(true));
      dispatch(setCurrentStep("form"));
    }
  }, [user, dispatch]);

  const sanitizedPhone = localPhone.replace(/\s+/g, "");
  const phoneValid = /^\d{10}$/.test(sanitizedPhone);

  const onSendOtp = async () => {
    if (!phoneValid || isSending) return;
    setError(null);
    setIsSending(true);
    dispatch(setPhone(sanitizedPhone));
    const result = await sendOtp(sanitizedPhone);
    setIsSending(false);

    if (result.error) {
      setError(result.error.message);
      return;
    }
    if (typeof result.message_id !== "number") {
      setError("Couldn't start verification. Please try again.");
      return;
    }
    setMessageId(result.message_id);
    setOtp(["", "", "", "", "", ""]);
    setPhase("otp");
    setTimeout(() => otpRefs.current[0]?.focus(), 100);
  };

  const setOtpDigit = (idx: number, val: string) => {
    const v = val.replace(/[^\d]/g, "").slice(-1);
    setOtp((o) => {
      const n = [...o];
      n[idx] = v;
      return n;
    });
    if (v && idx < 5) otpRefs.current[idx + 1]?.focus();
  };

  const onOtpKey = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      otpRefs.current[idx - 1]?.focus();
    }
  };

  const otpComplete = otp.every((d) => d.length === 1);
  const otpString = otp.join("");

  const verify = async () => {
    if (!otpComplete || isVerifying || messageId === null) return;
    setError(null);
    setIsVerifying(true);
    const result = await verifyOtp(sanitizedPhone, otpString, messageId);
    setIsVerifying(false);

    if (result.error) {
      setError(result.error.message);
      return;
    }
    dispatch(setAuthenticated(true));
    dispatch(setCurrentStep("form"));
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const onGoogle = async () => {
    if (!isConfigured) {
      setError("Google sign-in is not configured. Use phone OTP instead.");
      return;
    }
    setError(null);
    await signInWithGoogle();
    // The OAuth flow redirects away. On return, the useEffect above advances
    // the user once the Supabase session is restored.
  };

  const handleBack = () => {
    if (phase === "otp") {
      setPhase("phone");
      setError(null);
    } else {
      dispatch(setCurrentStep("dharm"));
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  };

  return (
    <div className="animate-fadeUp py-6 pb-16">
      <BackButton onClick={handleBack}>{t.back}</BackButton>

      <div className="mb-8 mt-12 text-center">
        <Eyebrow>Sign in</Eyebrow>
        <Heading size="clamp(1.75rem, 6vw, 2.5rem)">{t.auth_title}</Heading>
        <SubLine>{t.auth_sub}</SubLine>
      </div>

      <div className="mt-9">
        {phase === "phone" && (
          <>
            <div>
              <label className="mb-1 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-600">
                <span>{t.phone_label}</span>
              </label>
              <div className="flex items-end gap-3">
                <span className="whitespace-nowrap border-b border-slate-300 pb-3 pt-3 font-bold text-slate-600">
                  +91
                </span>
                <input
                  type="tel"
                  placeholder="98765 43210"
                  value={localPhone}
                  onChange={(e) =>
                    setLocalPhone(e.target.value.replace(/[^\d\s]/g, ""))
                  }
                  className="flex-1 border-0 border-b border-slate-300 bg-transparent px-0 pb-3 pt-3 font-dm text-base tracking-wider outline-none transition-colors focus:border-amber-600"
                  autoFocus
                />
              </div>
            </div>

            {error && (
              <p className="mt-3 text-sm text-red-700" role="alert">
                {error}
              </p>
            )}

            <div className="h-6" />

            <button
              disabled={!phoneValid || isSending}
              onClick={onSendOtp}
              className={`w-full rounded-none border-0 px-6 py-4 font-dm text-sm font-black uppercase tracking-[0.18em] transition-all duration-180 ${
                phoneValid && !isSending
                  ? "cursor-pointer bg-slate-900 text-amber-50 hover:bg-red-900"
                  : "cursor-not-allowed bg-slate-900 text-amber-50 opacity-32"
              }`}
            >
              {isSending ? "Sending..." : t.send_otp}
            </button>

            <div className="my-7 flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-300" />
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                {t.or}
              </span>
              <div className="flex-1 h-px bg-slate-300" />
            </div>

            <button
              onClick={onGoogle}
              className="flex w-full items-center justify-center gap-3 border border-slate-300 bg-amber-50 px-6 py-3 font-dm font-bold text-slate-900 transition-colors hover:border-amber-600/50"
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              {t.google}
            </button>
          </>
        )}

        {phase === "otp" && (
          <>
            <p className="font-cormorant mb-6 text-center text-sm italic text-slate-500">
              We sent a 6-digit code to <strong className="text-slate-900 font-normal">+91 {sanitizedPhone}</strong>
            </p>

            <div className="mb-7 flex justify-center gap-2">
              {otp.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    otpRefs.current[i] = el;
                  }}
                  value={d}
                  onChange={(e) => setOtpDigit(i, e.target.value)}
                  onKeyDown={(e) => onOtpKey(e, i)}
                  type="tel"
                  inputMode="numeric"
                  maxLength={1}
                  className="font-cormorant h-16 w-12 border-0 border-b-2 bg-transparent text-center text-2xl font-semibold outline-none transition-colors"
                  style={{
                    borderColor: d ? "#B8860B" : "rgba(28,25,22,0.18)",
                  }}
                />
              ))}
            </div>

            {error && (
              <p className="mb-3 text-center text-sm text-red-700" role="alert">
                {error}
              </p>
            )}

            <button
              disabled={!otpComplete || isVerifying}
              onClick={verify}
              className={`w-full rounded-none border-0 px-6 py-4 font-dm text-sm font-black uppercase tracking-[0.18em] transition-all duration-180 ${
                otpComplete && !isVerifying
                  ? "cursor-pointer bg-slate-900 text-amber-50 hover:bg-red-900"
                  : "cursor-not-allowed bg-slate-900 text-amber-50 opacity-32"
              }`}
            >
              {isVerifying ? "Verifying..." : "Verify & Continue"}
            </button>

            <div className="text-center">
              <button
                onClick={() => {
                  setPhase("phone");
                  setError(null);
                }}
                className="mt-3 border-0 bg-none px-0 py-3 text-xs font-bold uppercase tracking-widest text-slate-500 transition-colors hover:text-slate-900"
              >
                Change number
              </button>
            </div>
          </>
        )}
      </div>

      <p className="font-cormorant mt-9 text-center text-xs italic leading-relaxed text-slate-500">
        {t.legal}
      </p>
    </div>
  );
}
