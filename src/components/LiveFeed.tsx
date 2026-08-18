"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-browser";

type Entry = {
  id: string;
  created_at: string;
  reference_code: string;
  brand_name: string;
  tagline: string | null;
  logo_url: string;
};

export function LiveFeed() {
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    const supabase = createClient();

    supabase
      .from("submissions")
      .select("id, created_at, reference_code, brand_name, tagline, logo_url")
      .order("created_at", { ascending: false })
      .limit(12)
      .then(({ data }) => data && setEntries(data));

    const channel = supabase
      .channel("public:submissions")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "submissions" },
        (payload) => {
          setEntries((prev) => [payload.new as Entry, ...prev].slice(0, 12));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (entries.length === 0) {
    return (
      <p className="text-center text-sm text-muted">
        No submissions yet — be the first to name us.
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {entries.map((e) => (
        <div key={e.id} className="panel p-4 flex gap-3 items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={e.logo_url}
            alt={`${e.brand_name} logo`}
            className="h-12 w-12 rounded-lg object-cover bg-white/5 shrink-0"
          />
          <div className="min-w-0">
            <p className="font-medium truncate">{e.brand_name}</p>
            {e.tagline && <p className="text-xs text-muted truncate">{e.tagline}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
