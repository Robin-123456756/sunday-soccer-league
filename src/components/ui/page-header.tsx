import Link from "next/link";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?:
    | {
        label: string;
        href: string;
      }
    | React.ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {description && (
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        )}
      </div>
      {action &&
        (typeof action === "object" && "href" in action ? (
          <Link
            href={action.href}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            {action.label}
          </Link>
        ) : (
          action
        ))}
    </div>
  );
}
