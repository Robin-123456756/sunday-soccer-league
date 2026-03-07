export const dynamic = "force-dynamic";
import { notFound, redirect } from "next/navigation";
import { getRefereeById, updateReferee } from "@/server/actions/referees";
import { PageHeader } from "@/components/ui/page-header";
import { FormErrorAlert } from "@/components/ui/form-error-alert";
import { withErrorQuery } from "@/lib/url";
import { RefereeForm } from "../../_components/referee-form";

interface EditRefereePageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}

export default async function EditRefereePage({
  params,
  searchParams,
}: EditRefereePageProps) {
  const { id } = await params;
  const { error } = await searchParams;
  const referee = await getRefereeById(id);

  if (!referee) {
    notFound();
  }

  async function handleUpdateReferee(formData: FormData) {
    "use server";
    const result = await updateReferee(id, formData);
    if (result?.error) {
      redirect(withErrorQuery(`/referees/${id}/edit`, result.error));
    }
    redirect(`/referees/${id}`);
  }

  return (
    <div className="space-y-6">
      <PageHeader title={`Edit ${referee.fullName}`} />
      <FormErrorAlert message={error} />
      <RefereeForm action={handleUpdateReferee} defaultValues={referee} />
    </div>
  );
}
