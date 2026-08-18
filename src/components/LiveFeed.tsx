"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import { castVote, getMyVotes } from "@/app/actions";

type Entry = {
  id: string;
  created_at: string;
  reference_code: string;
  brand_name: string;
  tagline: string | null;
  logo_url: string;
  upvotes: number;
  downvotes: number;
};

export function LiveFeed() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [myVotes, setMyVotes] = useState<Record<string, 1 | -1>>({});
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    supabase
      .from("submissions")
      .select("id, created_at, reference_code, brand_name, tagline, logo_url, upvotes, downvotes")
      .order("created_at", { ascending: false })
      .limit(12)
      .then(({ data }) => data && setEntries(data));

    getMyVotes().then(({ signedIn, votes }) => {
      setSignedIn(signedIn);
      setMyVotes(votes);
    });

    const channel = supabase
      .channel("public:submissions")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "submissions" },
        (payload) => {
          setEntries((prev) => [payload.new as Entry, ...prev].slice(0, 12));
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "submissions" },
        (payload) => {
          const updated = payload.new as Entry;
          setEntries((prev) => prev.map((e) => (e.id === updated.id ? { ...e, ...updated } : e)));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function vote(submissionId: string, value: 1 | -1) {
    if (!signedIn) {
      window.location.href = "/auth/login";
      return;
    }
    const res = await castVote(submissionId, value);
    if (!res.ok) return;
    setMyVotes((prev) => {
      const next = { ...prev };
      if (res.myVote === 0) delete next[submissionId];
      else next[submissionId] = res.myVote;
      return next;
    });
    setEntries((prev) =>
      prev.map((e) =>
        e.id === submissionId ? { ...e, upvotes: res.upvotes, downvotes: res.downvotes } : e
      )
    );
  }

  if (entries.length === 0) {
    return (
      <p className="text-center text-sm text-muted">
        No submissions yet — be the first to name us.
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {entries.map((e) => {
        const mine = myVotes[e.id];
        return (
          <div key={e.id} className="panel p-4 flex gap-3 items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={e.logo_url}
              alt={`${e.brand_name} logo`}
              className="h-12 w-12 rounded-lg object-cover bg-white/5 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="font-medium truncate">{e.brand_name}</p>
              {e.tagline && <p className="text-xs text-muted truncate">{e.tagline}</p>}
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => vote(e.id, 1)}
                title={signedIn ? "Upvote" : "Sign in to vote"}
                className={`rounded-full px-2 py-1 text-xs font-medium transition ${
                  mine === 1 ? "bg-pop-mint text-black" : "hover:bg-white/10 text-muted"
                }`}
              >
                ▲ {e.upvotes}
              </button>
              <button
                type="button"
                onClick={() => vote(e.id, -1)}
                title={signedIn ? "Downvote" : "Sign in to vote"}
                className={`rounded-full px-2 py-1 text-xs font-medium transition ${
                  mine === -1 ? "bg-accent text-white" : "hover:bg-white/10 text-muted"
                }`}
              >
                ▼ {e.downvotes}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
