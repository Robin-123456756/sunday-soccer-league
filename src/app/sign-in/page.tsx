import { redirect } from "next/navigation";
import { pageStyle } from "@/components/ui/styles";
import { SignInForm } from "@/components/forms/SignInForm";
import { getCurrentUserProfileOrNull, getDefaultRouteForRole } from "@/server/queries/auth";

export default async function SignInPage() {
  const profile = await getCurrentUserProfileOrNull();

  if (profile?.is_active) {
    redirect(getDefaultRouteForRole(profile.role));
  }

  return (
    <main style={{ ...pageStyle, display: "grid", alignItems: "center" }}>
      <SignInForm />
    </main>
  );
}
