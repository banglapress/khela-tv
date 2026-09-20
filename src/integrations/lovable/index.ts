import { supabase } from "../supabase/client";
import { isSupabaseConfigured } from "../supabase/env";

type OAuthProvider = "google" | "github" | string;

type SignInOptions = {
  redirect_uri?: string;
  extraParams?: Record<string, string>;
};

export const lovable = {
  auth: {
    signInWithOAuth: async (_provider: OAuthProvider, _opts?: SignInOptions) => {
      if (!isSupabaseConfigured()) {
        return { error: new Error("Supabase is not configured.") };
      }
      try {
        const result = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: _opts?.redirect_uri || (typeof window !== "undefined" ? window.location.origin : undefined),
          },
        });
        if (result.error) return { error: result.error };
        return { redirected: true, ...result };
      } catch (e) {
        return { error: e instanceof Error ? e : new Error(String(e)) };
      }
    },
  },
};
