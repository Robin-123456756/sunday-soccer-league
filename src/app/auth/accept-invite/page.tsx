import { pageStyle } from "@/components/ui/styles";
import { AcceptInviteForm } from "@/components/forms/AcceptInviteForm";

export default function AcceptInvitePage() {
  return (
    <main style={{ ...pageStyle, display: "grid", alignItems: "center" }}>
      <AcceptInviteForm />
    </main>
  );
}
