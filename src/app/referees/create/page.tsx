export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { createReferee } from "@/server/actions/referees";
import { PageHeader } from "@/components/ui/page-header";
import { FormErrorAlert } from "@/components/ui/form-error-alert";
import { withErrorQuery } from "@/lib/url";
import { RefereeForm } from "../_components/referee-form";

interface CreateRefereePageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function CreateRefereePage({
  searchParams,
}: CreateRefereePageProps) {
  const { error } = await searchParams;

  async function handleCreateReferee(formData: FormData) {
    "use server";
    const result = await createReferee(formData);
    if (result?.error) {
      redirect(withErrorQuery("/referees/create", result.error));
    }
    redirect("/referees");
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Add Referee" />
      <FormErrorAlert message={error} />
      <RefereeForm action={handleCreateReferee} />
    </div>
  );
}
