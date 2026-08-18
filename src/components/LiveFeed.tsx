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
  why_name: string;
  why_logo: string;
  portfolio_url: string | null;
  logo_url: string;
  upvotes: number;
  downvotes: number;
};

const COLUMNS =
  "id, created_at, reference_code, brand_name, tagline, why_name, why_logo, portfolio_url, logo_url, upvotes, downvotes";

export function LiveFeed() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [myVotes, setMyVotes] = useState<Record<string, 1 | -1>>({});
  const [signedIn, setSignedIn] = useState(false);
  const [selected, setSelected] = useState<Entry | null>(null);

  useEffect(() => {
    const supabase = createClient();

    supabase
      .from("submissions")
      .select(COLUMNS)
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
          setSelected((prev) => (prev && prev.id === updated.id ? { ...prev, ...updated } : prev));
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
    const patch = { upvotes: res.upvotes, downvotes: res.downvotes };
    setEntries((prev) => prev.map((e) => (e.id === submissionId ? { ...e, ...patch } : e)));
    setSelected((prev) => (prev && prev.id === submissionId ? { ...prev, ...patch } : prev));
  }

  if (entries.length === 0) {
    return (
      <p className="text-center text-sm text-muted">
        No submissions yet — be the first to name us.
      </p>
    );
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map((e) => (
          <EntryCard key={e.id} entry={e} myVote={myVotes[e.id]} signedIn={signedIn} onVote={vote} onOpen={() => setSelected(e)} />
        ))}
      </div>

      {selected && (
        <EntryModal
          entry={selected}
          myVote={myVotes[selected.id]}
          signedIn={signedIn}
          onVote={vote}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}

function VoteButtons({
  entry, myVote, signedIn, onVote, size = "sm",
}: { entry: Entry; myVote: 1 | -1 | undefined; signedIn: boolean; onVote: (id: string, v: 1 | -1) => void; size?: "sm" | "lg" }) {
  const pad = size === "lg" ? "px-4 py-2 text-sm" : "px-2 py-1 text-xs";
  return (
    <div className="flex items-center gap-1 shrink-0">
      <button
        type="button"
        onClick={(ev) => { ev.stopPropagation(); onVote(entry.id, 1); }}
        title={signedIn ? "Upvote" : "Sign in to vote"}
        className={`rounded-full font-medium transition ${pad} ${
          myVote === 1 ? "bg-pop-mint text-black" : "hover:bg-white/10 text-muted"
        }`}
      >
        ▲ {entry.upvotes}
      </button>
      <button
        type="button"
        onClick={(ev) => { ev.stopPropagation(); onVote(entry.id, -1); }}
        title={signedIn ? "Downvote" : "Sign in to vote"}
        className={`rounded-full font-medium transition ${pad} ${
          myVote === -1 ? "bg-accent text-white" : "hover:bg-white/10 text-muted"
        }`}
      >
        ▼ {entry.downvotes}
      </button>
    </div>
  );
}

function EntryCard({
  entry, myVote, signedIn, onVote, onOpen,
}: { entry: Entry; myVote: 1 | -1 | undefined; signedIn: boolean; onVote: (id: string, v: 1 | -1) => void; onOpen: () => void }) {
  return (
    <div
      onClick={onOpen}
      className="panel p-4 cursor-pointer hover:-translate-y-1 hover:border-accent/40"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={entry.logo_url}
        alt={`${entry.brand_name} logo`}
        className="h-44 w-full rounded-xl object-contain bg-white/5 p-4"
      />
      <div className="mt-3 flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-medium truncate">{entry.brand_name}</p>
          {entry.tagline && <p className="text-xs text-muted truncate">{entry.tagline}</p>}
        </div>
        <VoteButtons entry={entry} myVote={myVote} signedIn={signedIn} onVote={onVote} />
      </div>
    </div>
  );
}

function EntryModal({
  entry, myVote, signedIn, onVote, onClose,
}: { entry: Entry; myVote: 1 | -1 | undefined; signedIn: boolean; onVote: (id: string, v: 1 | -1) => void; onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="panel w-full max-w-lg max-h-[85vh] overflow-y-auto p-6 sm:p-8 relative"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 h-8 w-8 rounded-full hover:bg-white/10 flex items-center justify-center text-muted"
          aria-label="Close"
        >
          ✕
        </button>

        <div className="flex flex-col items-center text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={entry.logo_url}
            alt={`${entry.brand_name} logo`}
            className="h-64 w-full max-w-xs rounded-2xl object-contain bg-white/5 p-5"
          />
          <h3 className="mt-4 text-2xl font-display font-semibold">{entry.brand_name}</h3>
          {entry.tagline && <p className="mt-1 text-muted">{entry.tagline}</p>}
          <div className="mt-4">
            <VoteButtons entry={entry} myVote={myVote} signedIn={signedIn} onVote={onVote} size="lg" />
          </div>
        </div>

        <div className="mt-8 space-y-5 text-left">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-accent font-medium mb-1">Why this name?</p>
            <p className="text-sm text-muted whitespace-pre-wrap">{entry.why_name}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-accent font-medium mb-1">Why this logo?</p>
            <p className="text-sm text-muted whitespace-pre-wrap">{entry.why_logo}</p>
          </div>
          {entry.portfolio_url && (
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-accent font-medium mb-1">Portfolio</p>
              <a
                href={entry.portfolio_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-white underline break-all hover:text-accent"
              >
                {entry.portfolio_url}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
