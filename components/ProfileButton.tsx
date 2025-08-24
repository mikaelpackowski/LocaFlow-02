"use client";

import { supabaseBrowser } from "@/lib/supabase-browser";

export default function ProfileButton() {
  async function handleLogout() {
    await supabaseBrowser.auth.signOut();
    window.location.reload();
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-md bg-red-500 text-white px-4 py-2"
    >
      Se déconnecter
    </button>
  );
}
