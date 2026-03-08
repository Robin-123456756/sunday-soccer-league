import { pageStyle } from "@/components/ui/styles";
import { UpdatePasswordForm } from "@/components/forms/UpdatePasswordForm";

export default function UpdatePasswordPage() {
  return (
    <main style={{ ...pageStyle, display: "grid", alignItems: "center" }}>
      <UpdatePasswordForm />
    </main>
  );
}
