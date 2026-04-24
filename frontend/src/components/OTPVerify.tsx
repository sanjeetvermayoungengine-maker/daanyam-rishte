import { useEffect, useMemo, useRef, useState } from "react";

const otpLength = 6;

export function OTPVerify() {
  const [digits, setDigits] = useState(Array.from({ length: otpLength }, () => ""));
  const [timer, setTimer] = useState(60);
  const [message, setMessage] = useState("");
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const code = useMemo(() => digits.join(""), [digits]);
  const canSubmit = code.length === otpLength && digits.every(Boolean);

  useEffect(() => {
    if (timer <= 0) {
      return;
    }

    const timeout = window.setTimeout(() => setTimer((current) => current - 1), 1000);
    return () => window.clearTimeout(timeout);
  }, [timer]);

  const updateDigit = (index: number, value: string) => {
    const nextDigit = value.replace(/\D/g, "").slice(-1);
    setDigits((current) => current.map((digit, itemIndex) => (itemIndex === index ? nextDigit : digit)));

    if (nextDigit && index < otpLength - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleSubmit = () => {
    if (!canSubmit) {
      setMessage("Enter the 6 digit code.");
      return;
    }

    setMessage("Number verified for this demo flow.");
  };

  return (
    <section className="page-shell page-shell--narrow">
      <div className="form-panel">
        <p className="eyebrow">Verification</p>
        <h1>Verify Number</h1>
        <p className="muted-text">Enter the 6 digit code sent to your phone or email.</p>

        <div className="otp-grid" aria-label="One time password">
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(node) => {
                inputsRef.current[index] = node;
              }}
              inputMode="numeric"
              maxLength={1}
              value={digit}
              aria-label={`OTP digit ${index + 1}`}
              onChange={(event) => updateDigit(index, event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Backspace" && !digits[index] && index > 0) {
                  inputsRef.current[index - 1]?.focus();
                }
              }}
            />
          ))}
        </div>

        {message ? <p className="field-helper">{message}</p> : null}

        <div className="form-actions">
          <button className="button button--secondary" type="button" onClick={() => window.history.back()}>
            Back
          </button>
          <button className="button button--primary" type="button" disabled={!canSubmit} onClick={handleSubmit}>
            Verify Number
          </button>
        </div>
        <button
          className="text-button"
          type="button"
          disabled={timer > 0}
          onClick={() => {
            setTimer(60);
            setMessage("A new code has been sent.");
          }}
        >
          {timer > 0 ? `Resend in ${timer}s` : "Resend code"}
        </button>
      </div>
    </section>
  );
}
