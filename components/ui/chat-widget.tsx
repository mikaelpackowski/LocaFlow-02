"use client";

import { useState, useRef, useEffect } from "react";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  return (
    <>
      {/* Bouton flottant */}
      <button
        aria-label={open ? "Fermer le chat" : "Ouvrir le chat"}
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-4 right-4 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        {/* Icône bulle */}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8z" />
        </svg>
      </button>

      {/* Panneau de chat */}
      <div
        className={`fixed bottom-20 right-4 z-50 w-[22rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl transition-all ${
          open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
        }`}
      >
        <header className="flex items-center justify-between bg-gray-50 px-4 py-3">
          <p className="text-sm font-semibold text-gray-800">Assistant LocaFlow</p>
          <button
            aria-label="Fermer"
            onClick={() => setOpen(false)}
            className="rounded p-1 text-gray-500 hover:bg-gray-100"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" fill="none" />
            </svg>
          </button>
        </header>

        <div className="h-64 overflow-y-auto px-4 py-3 text-sm text-gray-700">
          <div className="mb-3 rounded-lg bg-indigo-50 px-3 py-2 text-indigo-900">
            Bonjour 👋 Comment puis-je vous aider ?
          </div>
          {/* Vous pouvez brancher ici une vraie logique plus tard */}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            // TODO: envoyer le message vers une API quand on branchera le vrai bot
            (e.currentTarget.elements.namedItem("message") as HTMLInputElement).value = "";
          }}
          className="flex items-center gap-2 border-t px-3 py-2"
        >
          <input
            ref={inputRef}
            name="message"
            placeholder="Écrire un message…"
            className="flex-1 rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            Envoyer
          </button>
        </form>
      </div>
    </>
  );
}
