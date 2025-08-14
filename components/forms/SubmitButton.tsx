// components/forms/SubmitButton.tsx
"use client";

import { useState } from "react";

export default function SubmitButton({
  children = "Envoyer",
  className = "",
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  const [pending, setPending] = useState(false);

  return (
    <button
      type="submit"
      onClick={() => setPending(true)}
      disabled={pending}
      className={`rounded-lg bg-indigo-600 px-5 py-2.5 text-white font-semibold hover:bg-indigo-500 disabled:opacity-60 ${className}`}
    >
      {pending ? "Envoi..." : children}
    </button>
  );
}
