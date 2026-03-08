"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { syncCurrentUserProfileAction } from "@/server/actions/auth";
import { buttonStyle, cardStyle, inputStyle, labelStyle, mutedTextStyle } from "@/components/ui/styles";

export function UpdatePasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        setError(null);
        setMessage(null);

        if (password.length < 6) {
          setError("Password must be at least 6 characters.");
          return;
        }
        if (password !== confirmPassword) {
          setError("Passwords do not match.");
          return;
        }

        setPending(true);
        try {
          const supabase = createClient();
          const { error: updateError } = await supabase.auth.updateUser({ password });
          if (updateError) throw updateError;
          await syncCurrentUserProfileAction();
          setMessage("Password updated successfully. Redirecting...");
          router.push("/auth/post-login");
          router.refresh();
        } catch (err) {
          setError(err instanceof Error ? err.message : "Could not update password.");
        } finally {
          setPending(false);
        }
      }}
      style={{ ...cardStyle, maxWidth: 460, margin: "0 auto", display: "grid", gap: 16 }}
    >
      <div>
        <h1 style={{ margin: "0 0 8px" }}>Choose a new password</h1>
        <p style={mutedTextStyle}>Open this page from the reset email, then set your new password here.</p>
      </div>

      <label>
        <span style={labelStyle}>New password</span>
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" minLength={6} required style={inputStyle} />
      </label>

      <label>
        <span style={labelStyle}>Confirm new password</span>
        <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type="password" minLength={6} required style={inputStyle} />
      </label>

      {error ? <p style={{ margin: 0, color: "#b91c1c", fontSize: 14 }}>{error}</p> : null}
      {message ? <p style={{ margin: 0, color: "#047857", fontSize: 14 }}>{message}</p> : null}

      <button type="submit" disabled={pending} style={{ ...buttonStyle, opacity: pending ? 0.7 : 1 }}>
        {pending ? "Saving..." : "Update password"}
      </button>
    </form>
  );
}
