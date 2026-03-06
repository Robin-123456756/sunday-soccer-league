import { redirect } from "next/navigation";
import { createReferee } from "@/server/actions/referees";
import { PageHeader } from "@/components/ui/page-header";
import { RefereeForm } from "../_components/referee-form";

export default async function CreateRefereePage() {
  async function handleCreateReferee(formData: FormData) {
    "use server";
    await createReferee(formData);
    redirect("/referees");
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Add Referee" />
      <RefereeForm action={handleCreateReferee} />
    </div>
  );
}
