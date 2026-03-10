import { redirect } from "next/navigation";
import { resolvePostLoginRedirect } from "@/server/actions/auth";

export default async function PostLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ flash?: string }>;
}) {
  const params = await searchParams;
  const destination = await resolvePostLoginRedirect(params.flash ?? null);
  redirect(destination);
}
