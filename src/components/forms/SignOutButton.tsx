import { signOutAction } from "@/server/actions/auth";
import { secondaryButtonStyle } from "@/components/ui/styles";

export function SignOutButton() {
  return (
    <form action={signOutAction}>
      <button type="submit" style={secondaryButtonStyle}>
        Sign out
      </button>
    </form>
  );
}
