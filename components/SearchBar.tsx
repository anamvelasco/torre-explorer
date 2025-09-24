// components/SearchBar.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [value, setValue] = useState("");
  const router = useRouter();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = value.trim().replace(/^@/, "");
    if (!v) return;
    router.push(`/profile/${encodeURIComponent(v)}`);
  };

  return (
    <form onSubmit={onSubmit} className="row" style={{ gap: 8 }}>
      <input
        className="input"
        placeholder="Type a username (e.g., rubenjr)"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button type="submit" className="btn btn-primary">Open profile</button>
    </form>
  );
}
