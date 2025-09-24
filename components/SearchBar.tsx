"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar() {
  const [value, setValue] = useState("");
  const router = useRouter();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const username = value.trim().replace(/^@+/, "");
    if (!username) return;
    router.push(`/profile/${encodeURIComponent(username)}`);
  }

  return (
    <form onSubmit={onSubmit} className="row">
      <input
        className="input"
        placeholder="Escribe un username de Torre (ej: rubenjr)"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button type="submit" className="btn">Buscar</button>
    </form>
  );
}
