"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Container from "@/app/_components/container";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get("from") || "/tracker";

  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.push(from);
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Login failed.");
      }
    } catch {
      setError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm py-24">
      <h1 className="mb-2 text-3xl font-bold tracking-tighter">AI Engineer Tracker</h1>
      <p className="mb-8 text-slate-500 dark:text-slate-400">
        Private area. Enter the password to continue.
      </p>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <input
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="rounded-md border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        />
        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading || !password}
          className="rounded-md bg-brand-blue px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Checking…" : "Enter"}
        </button>
      </form>
    </div>
  );
}

export default function TrackerLoginPage() {
  return (
    <main>
      <Container>
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </Container>
    </main>
  );
}
