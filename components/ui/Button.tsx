import clsx from "clsx";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  asChild?: boolean; // si tu veux l’utiliser avec <Link>
};

export default function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: Props) {
  const base = "inline-flex items-center justify-center rounded-lg font-semibold transition focus:outline-none";
  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };
  const variants = {
    primary:
      "bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-black/10",
    secondary:
      "bg-white text-gray-900 border hover:bg-gray-50",
    ghost:
      "text-gray-700 hover:bg-gray-100",
  };

  return (
    <button {...props} className={clsx(base, sizes[size], variants[variant], className)} />
  );
}
