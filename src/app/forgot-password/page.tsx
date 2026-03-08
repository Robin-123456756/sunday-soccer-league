import { pageStyle } from "@/components/ui/styles";
import { ForgotPasswordForm } from "@/components/forms/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <main style={{ ...pageStyle, display: "grid", alignItems: "center" }}>
      <ForgotPasswordForm />
    </main>
  );
}
