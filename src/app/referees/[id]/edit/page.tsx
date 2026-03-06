export const dynamic = "force-dynamic";
import { notFound, redirect } from "next/navigation";
import { getRefereeById, updateReferee } from "@/server/actions/referees";
import { PageHeader } from "@/components/ui/page-header";
import { RefereeForm } from "../../_components/referee-form";

interface EditRefereePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditRefereePage({ params }: EditRefereePageProps) {
  const { id } = await params;
  const referee = await getRefereeById(id);

  if (!referee) {
    notFound();
  }

  async function handleUpdateReferee(formData: FormData) {
    "use server";
    await updateReferee(id, formData);
    redirect(`/referees/${id}`);
  }

  return (
    <div className="space-y-6">
      <PageHeader title={`Edit ${referee.fullName}`} />
      <RefereeForm action={handleUpdateReferee} defaultValues={referee} />
    </div>
  );
}
