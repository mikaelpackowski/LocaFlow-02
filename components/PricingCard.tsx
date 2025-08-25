"use client";

import React from "react";

export default function PricingCard({
  title,
  price,
  badge,
  features,
  cta,
  footnote, // ✅ nouveau, optionnel
}: {
  title: string;
  price: string;
  badge?: string;
  features: string[];
  cta: React.ReactNode;
  footnote?: string; // ✅ nouveau, optionnel
}) {
  return (
    <div className="flex flex-col justify-between rounded-2xl border bg-white p-6 shadow-sm">
      <div>
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {badge && (
            <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700">
              {badge}
            </span>
          )}
        </div>

        <div className="mt-2">
          <div className="text-3xl font-extrabold">{price}</div>
        </div>

        <ul className="mt-4 space-y-2 text-sm text-gray-700">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2">
              <svg
                className="mt-0.5 h-4 w-4 text-green-600"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.414 0l-3-3a1 1 0 011.414-1.414L8.5 11.086l6.543-6.543a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              {f}
            </li>
          ))}
        </ul>

        {/* ✅ Petit texte d’info sous la liste si fourni */}
        {footnote && (
          <p className="mt-3 text-xs text-gray-500">{footnote}</p>
        )}
      </div>

      <div className="mt-6">{cta}</div>
    </div>
  );
}
