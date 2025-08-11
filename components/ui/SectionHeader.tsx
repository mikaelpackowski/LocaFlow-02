export default function SectionHeader({
  kicker,
  title,
  subtitle,
  center = true,
}: {
  kicker?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <div className={`mx-auto max-w-3xl ${center ? "text-center" : ""}`}>
      {kicker && (
        <div className="inline-flex items-center gap-3 pb-3 before:h-px before:w-8 before:bg-gradient-to-r before:from-transparent before:to-indigo-200/50 after:h-px after:w-8 after:bg-gradient-to-l after:from-transparent after:to-indigo-200/50">
          <span className="inline-flex bg-gradient-to-r from-indigo-500 to-indigo-200 bg-clip-text text-transparent">
            {kicker}
          </span>
        </div>
      )}
      <h2 className="text-3xl md:text-4xl font-extrabold bg-[linear-gradient(to_right,#4f46e5,#8b5cf6,#ec4899,#4f46e5)] bg-[length:200%_auto] bg-clip-text text-transparent animate-[gradient_8s_linear_infinite]">
        {title}
      </h2>
      {subtitle && <p className="mt-2 text-lg text-gray-600">{subtitle}</p>}
    </div>
  );
}
