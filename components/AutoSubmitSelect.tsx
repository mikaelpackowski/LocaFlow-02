"use client";

import { useEffect, useRef } from "react";

export default function AutoSubmitSelect(
  props: React.SelectHTMLAttributes<HTMLSelectElement>
) {
  const ref = useRef<HTMLSelectElement>(null);
  // Stocke la valeur initiale en string pour comparer proprement
  const initialValueRef = useRef<string>(
    props.defaultValue === undefined
      ? ""
      : Array.isArray(props.defaultValue)
      ? props.defaultValue.join(",")
      : String(props.defaultValue)
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    const handler = () => {
      const current = el.value;
      if (current !== initialValueRef.current) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          el.form?.requestSubmit();
          initialValueRef.current = current; // mémorise la nouvelle valeur
        });
      }
    };

    el.addEventListener("change", handler);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("change", handler);
    };
  }, []);

  return <select ref={ref} {...props} />;
}
