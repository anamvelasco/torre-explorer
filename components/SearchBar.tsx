"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar() {
  const [value, setValue] = useState("");
  const router = useRouter();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const username = value.trim();
    if (!username) return;
    router.push(`/profile/${encodeURIComponent(username)}`);
  }

  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <input
        className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:ring-2 focus:ring-neutral-300"
        placeholder="Escribe un username de Torre (ej: rubenjr)"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button type="submit" className="rounded-xl px-5 py-3 bg-black text-white">
        Buscar
      </button>
    </form>
  );
}
