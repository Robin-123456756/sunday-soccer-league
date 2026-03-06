import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getRefereeById, deleteReferee } from "@/server/actions/referees";
import { PageHeader } from "@/components/ui/page-header";
import { DeleteButton } from "@/components/ui/delete-button";

interface RefereeDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function RefereeDetailPage({ params }: RefereeDetailPageProps) {
  const { id } = await params;
  const referee = await getRefereeById(id);

  if (!referee) {
    notFound();
  }

  async function handleDeleteReferee() {
    "use server";
    await deleteReferee(id);
    redirect("/referees");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={referee.fullName}
        action={
          <div className="flex items-center gap-2">
            <Link
              href={`/referees/${referee.id}/edit`}
              className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              Edit
            </Link>
            <DeleteButton action={handleDeleteReferee} />
          </div>
        }
      />

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Referee Information
        </h2>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">Full Name</dt>
            <dd className="mt-1 text-sm text-gray-900">{referee.fullName}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Phone</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {referee.phone ?? "-"}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Email</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {referee.email ?? "-"}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Level</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {referee.level ?? "-"}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
