// components/StickyOffset.tsx
"use client";
import { useEffect, useState } from "react";

export default function StickyOffset({
  target = "#site-header",   // sélecteur du header fixe
  extra = 16,                 // marge supp. en px
  fallback = 96,              // si on ne trouve pas le header
  children,
}: {
  target?: string;
  extra?: number;
  fallback?: number;
  children: React.ReactNode;
}) {
  const [pt, setPt] = useState<number>(fallback);

  useEffect(() => {
    const el = document.querySelector<HTMLElement>(target);
    const calc = () => setPt(((el?.offsetHeight || fallback) + extra));
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, [target, extra, fallback]);

  return <div style={{ paddingTop: pt }}>{children}</div>;
}
