"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signInAction, type AuthFormState } from "@/server/actions/auth";
import { buttonStyle, cardStyle, inputStyle, labelStyle, mutedTextStyle } from "@/components/ui/styles";

const initialState: AuthFormState = {};

export function SignInForm() {
  const [state, formAction, pending] = useActionState(signInAction, initialState);

  return (
    <form action={formAction} style={{ ...cardStyle, maxWidth: 460, margin: "0 auto", display: "grid", gap: 16 }}>
      <div>
        <h1 style={{ margin: "0 0 8px" }}>Sign in</h1>
        <p style={mutedTextStyle}>Use your Supabase email and password to access the league system.</p>
      </div>

      <label>
        <span style={labelStyle}>Email</span>
        <input name="email" type="email" autoComplete="email" required style={inputStyle} placeholder="you@example.com" />
      </label>

      <label>
        <span style={labelStyle}>Password</span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          style={inputStyle}
          placeholder="Enter your password"
        />
      </label>

      {state.error ? (
        <p style={{ margin: 0, color: "#b91c1c", fontSize: 14 }}>{state.error}</p>
      ) : null}

      <button type="submit" disabled={pending} style={{ ...buttonStyle, opacity: pending ? 0.7 : 1 }}>
        {pending ? "Signing in..." : "Sign in"}
      </button>

      <p style={{ ...mutedTextStyle, fontSize: 14 }}>
        Forgot your password? <Link href="/forgot-password">Reset it here</Link>
      </p>
    </form>
  );
}
