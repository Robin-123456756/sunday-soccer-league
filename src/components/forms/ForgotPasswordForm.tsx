"use client";

import Link from "next/link";
import { useActionState } from "react";
import { requestPasswordResetAction, type AuthFormState } from "@/server/actions/auth";
import { buttonStyle, cardStyle, inputStyle, labelStyle, mutedTextStyle } from "@/components/ui/styles";

const initialState: AuthFormState = {};

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(requestPasswordResetAction, initialState);

  return (
    <form action={formAction} style={{ ...cardStyle, maxWidth: 460, margin: "0 auto", display: "grid", gap: 16 }}>
      <div>
        <h1 style={{ margin: "0 0 8px" }}>Reset password</h1>
        <p style={mutedTextStyle}>Enter your email and we will send you a password reset link.</p>
      </div>

      <label>
        <span style={labelStyle}>Email</span>
        <input name="email" type="email" autoComplete="email" required style={inputStyle} placeholder="you@example.com" />
      </label>

      {state.error ? <p style={{ margin: 0, color: "#b91c1c", fontSize: 14 }}>{state.error}</p> : null}
      {state.message ? <p style={{ margin: 0, color: "#047857", fontSize: 14 }}>{state.message}</p> : null}

      <button type="submit" disabled={pending} style={{ ...buttonStyle, opacity: pending ? 0.7 : 1 }}>
        {pending ? "Sending..." : "Send reset email"}
      </button>

      <p style={{ ...mutedTextStyle, fontSize: 14 }}>
        Remembered it? <Link href="/sign-in">Back to sign in</Link>
      </p>
    </form>
  );
}
