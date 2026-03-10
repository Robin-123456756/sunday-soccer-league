import Link from "next/link";
import { cardStyle, mutedTextStyle, pageStyle, buttonStyle } from "@/components/ui/styles";

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const params = await searchParams;
  const message = params.message || "That sign-in or verification link could not be completed.";

  return (
    <main style={{ ...pageStyle, display: "grid", alignItems: "center" }}>
      <div style={{ ...cardStyle, maxWidth: 560, margin: "0 auto", display: "grid", gap: 16 }}>
        <div>
          <h1 style={{ margin: "0 0 8px" }}>Auth link problem</h1>
          <p style={mutedTextStyle}>
            {message}
          </p>
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link href="/sign-in" style={buttonStyle}>
            Back to sign in
          </Link>
          <Link href="/forgot-password" style={{ ...buttonStyle, background: "#374151" }}>
            Try password reset again
          </Link>
        </div>
      </div>
    </main>
  );
}
