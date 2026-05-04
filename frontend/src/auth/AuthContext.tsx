import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabase } from "../services/supabase";
import { api } from "../services/api";

type SendOtpResult = {
  error: Error | null;
  message_id?: number;
  status?: number;
};

type VerifyOtpResult = {
  error: Error | null;
};

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isConfigured: boolean;
  signInWithGoogle: () => Promise<void>;
  sendOtp: (phone: string) => Promise<SendOtpResult>;
  verifyOtp: (phone: string, otp: string, messageId: number) => Promise<VerifyOtpResult>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const authUnavailable = () => new Error("Authentication is temporarily unavailable. Please try again later.");

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    void supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setIsLoading(false);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      session,
      isLoading,
      isConfigured: isSupabaseConfigured(),
      async signInWithGoogle() {
        if (!supabase) {
          return;
        }
        await supabase.auth.signInWithOAuth({
          provider: "google",
          options: { redirectTo: window.location.origin },
        });
      },
      async sendOtp(phone: string): Promise<SendOtpResult> {
        try {
          const response = await api.post<{ success: boolean; message_id?: number }>(
            "/api/auth/send-otp",
            { phone },
          );
          return { error: null, message_id: response.data.message_id, status: response.status };
        } catch (err) {
          const status = (err as { response?: { status?: number } }).response?.status;
          const message = (err as { response?: { data?: { error?: string } } }).response?.data?.error
            ?? (err as Error).message
            ?? "Failed to send OTP";
          return { error: new Error(message), status };
        }
      },
      async verifyOtp(phone: string, otp: string, messageId: number): Promise<VerifyOtpResult> {
        if (!supabase) return { error: authUnavailable() };
        try {
          const response = await api.post<{ success: boolean; token_hash: string; email: string }>(
            "/api/auth/verify-otp",
            { phone, otp, message_id: messageId },
          );
          const tokenHash = response.data?.token_hash;
          if (!tokenHash) {
            return { error: new Error("Login failed. Please try again.") };
          }
          const { error: verifyError } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: "magiclink",
          });
          if (verifyError) {
            return { error: new Error(verifyError.message || "Failed to establish session") };
          }
          return { error: null };
        } catch (err) {
          const message = (err as { response?: { data?: { error?: string } } }).response?.data?.error
            ?? (err as Error).message
            ?? "OTP verification failed";
          return { error: new Error(message) };
        }
      },
      async signOut() {
        if (!supabase) {
          return;
        }
        await supabase.auth.signOut();
      },
    }),
    [isLoading, session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
