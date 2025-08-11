type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export default function Button({
  variant = "primary",
  className = "",
  ...props
}: Props) {
  // Classes par défaut selon le type de bouton
  let baseClasses =
    "inline-flex items-center justify-center rounded-lg px-4 py-2 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

  let variantClasses = "";
  if (variant === "primary") {
    variantClasses =
      "bg-indigo-600 text-white hover:bg-indigo-500 focus:ring-indigo-500";
  } else if (variant === "secondary") {
    variantClasses =
      "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-300";
  } else if (variant === "ghost") {
    variantClasses =
      "bg-transparent text-gray-900 hover:bg-gray-100 focus:ring-gray-200";
  }

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${className}`}
      {...props}
    />
  );
}
