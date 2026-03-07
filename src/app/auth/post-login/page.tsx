import { redirect } from "next/navigation";
import { resolvePostLoginRedirect } from "@/server/actions/auth";

export default async function PostLoginPage() {
  const destination = await resolvePostLoginRedirect();
  redirect(destination);
}
