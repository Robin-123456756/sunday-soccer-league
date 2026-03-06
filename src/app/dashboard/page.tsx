import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function DashboardPage() {
  const [teamCount, playerCount, refereeCount, matchCount, recentMatches] =
    await Promise.all([
      prisma.team.count({ where: { isActive: true } }),
      prisma.player.count({ where: { isActive: true } }),
      prisma.referee.count({ where: { isActive: true } }),
      prisma.match.count(),
      prisma.match.findMany({
        take: 5,
        orderBy: { matchDate: "desc" },
        include: {
          homeTeam: { select: { name: true, shortName: true } },
          awayTeam: { select: { name: true, shortName: true } },
          venue: { select: { name: true } },
        },
      }),
    ]);

  const stats = [
    { label: "Teams", value: teamCount, href: "/teams", color: "bg-blue-500" },
    {
      label: "Players",
      value: playerCount,
      href: "/players",
      color: "bg-green-500",
    },
    {
      label: "Referees",
      value: refereeCount,
      href: "/referees",
      color: "bg-purple-500",
    },
    {
      label: "Matches",
      value: matchCount,
      href: "/matches",
      color: "bg-orange-500",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {stat.value}
                </p>
              </div>
              <div
                className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}
              >
                <span className="text-white text-lg font-bold">
                  {stat.label[0]}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Matches
            </h2>
            <Link
              href="/matches"
              className="text-sm text-green-600 hover:text-green-700"
            >
              View all
            </Link>
          </div>
          {recentMatches.length === 0 ? (
            <p className="text-sm text-gray-500 py-4">No matches yet.</p>
          ) : (
            <div className="space-y-3">
              {recentMatches.map((match) => (
                <Link
                  key={match.id}
                  href={`/matches/${match.id}`}
                  className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {match.homeTeam.shortName ?? match.homeTeam.name} vs{" "}
                        {match.awayTeam.shortName ?? match.awayTeam.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(match.matchDate).toLocaleDateString()}
                        {match.venue && ` - ${match.venue.name}`}
                      </p>
                    </div>
                    {match.status === "completed" && (
                      <p className="text-sm font-bold text-gray-900">
                        {match.homeScore} - {match.awayScore}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="space-y-2">
            <Link
              href="/teams/create"
              className="block w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors"
            >
              + Create New Team
            </Link>
            <Link
              href="/players/create"
              className="block w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors"
            >
              + Register New Player
            </Link>
            <Link
              href="/referees/create"
              className="block w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors"
            >
              + Add New Referee
            </Link>
            <Link
              href="/matches/create"
              className="block w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors"
            >
              + Create New Fixture
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
