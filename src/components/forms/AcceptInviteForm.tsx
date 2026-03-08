"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { syncCurrentUserProfileAction } from "@/server/actions/auth";
import { buttonStyle, cardStyle, inputStyle, labelStyle, mutedTextStyle } from "@/components/ui/styles";

export function AcceptInviteForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
      const metadataName = typeof data.user?.user_metadata?.full_name === "string" ? data.user.user_metadata.full_name : "";
      if (metadataName) setFullName(metadataName);
    });
  }, []);

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        setError(null);

        if (!fullName.trim()) {
          setError("Full name is required.");
          return;
        }
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
          const { error: updateError } = await supabase.auth.updateUser({
            password,
            data: { full_name: fullName.trim() },
          });
          if (updateError) throw updateError;
          await syncCurrentUserProfileAction(fullName.trim());
          router.push("/auth/post-login");
          router.refresh();
        } catch (err) {
          setError(err instanceof Error ? err.message : "Could not finish onboarding.");
        } finally {
          setPending(false);
        }
      }}
      style={{ ...cardStyle, maxWidth: 520, margin: "0 auto", display: "grid", gap: 16 }}
    >
      <div>
        <h1 style={{ margin: "0 0 8px" }}>Finish your account setup</h1>
        <p style={mutedTextStyle}>Accept the invite, confirm your details, and choose your password to enter the league system.</p>
        {email ? <p style={{ ...mutedTextStyle, fontSize: 14 }}>Invited email: <strong>{email}</strong></p> : null}
      </div>

      <label>
        <span style={labelStyle}>Full name</span>
        <input value={fullName} onChange={(e) => setFullName(e.target.value)} required style={inputStyle} />
      </label>

      <label>
        <span style={labelStyle}>Password</span>
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" minLength={6} required style={inputStyle} />
      </label>

      <label>
        <span style={labelStyle}>Confirm password</span>
        <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type="password" minLength={6} required style={inputStyle} />
      </label>

      {error ? <p style={{ margin: 0, color: "#b91c1c", fontSize: 14 }}>{error}</p> : null}

      <button type="submit" disabled={pending} style={{ ...buttonStyle, opacity: pending ? 0.7 : 1 }}>
        {pending ? "Saving..." : "Complete onboarding"}
      </button>
    </form>
  );
}
