// Optional Lovable OAuth helper. Google sign-in is unused unless Lovable is configured.

import { supabase } from "../supabase/client";
import { isSupabaseConfigured } from "../supabase/env";

type OAuthProvider = "google" | "github" | string;

type SignInOptions = {
  redirect_uri?: string;
  extraParams?: Record<string, string>;
};

async function loadLovableAuth() {
  try {
    const mod = await import("@lovable.dev/cloud-auth-js");
    return mod.createLovableAuth();
  } catch {
    return null;
  }
}

export const lovable = {
  auth: {
    signInWithOAuth: async (provider: OAuthProvider, opts?: SignInOptions) => {
      const lovableAuth = await loadLovableAuth();
      if (!lovableAuth) {
        return { error: new Error("Google sign-in is not configured for this deployment.") };
      }
      const result = await lovableAuth.signInWithOAuth(provider, {
        ...opts,
        extraParams: {
          ...opts?.extraParams,
        },
      });

      if (result.redirected) {
        return result;
      }

      if (result.error) {
        return result;
      }

      if (!isSupabaseConfigured()) {
        return { error: new Error("Supabase is not configured.") };
      }

      try {
        await supabase.auth.setSession(result.tokens);
      } catch (e) {
        return { error: e instanceof Error ? e : new Error(String(e)) };
      }
      return result;
    },
  },
};
