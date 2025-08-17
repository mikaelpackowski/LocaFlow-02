import Link from "next/link";

export function registerLink(plan: string | undefined, label: string) {
  const href = plan ? `/auth/register?plan=${encodeURIComponent(plan)}` : "/auth/register";
  return (
    <Link
      href={href}
      className="w-full rounded-full bg-indigo-600 px-5 py-2 font-semibold text-white hover:bg-indigo-500 text-center block"
    >
      {label}
    </Link>
  );
}
