"use client";

import { useEffect, useState } from "react";
import { CONTEST_DEADLINE } from "@/lib/contest-config";

function getParts(msLeft: number) {
  const clamped = Math.max(0, msLeft);
  const totalSeconds = Math.floor(clamped / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds };
}

export function Countdown({ onClose, size = "lg" }: { onClose?: () => void; size?: "lg" | "sm" }) {
  // ponytail: null until mount avoids SSR/client Date.now() hydration mismatch.
  const [msLeft, setMsLeft] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => {
      const next = CONTEST_DEADLINE.getTime() - Date.now();
      setMsLeft(next);
      if (next <= 0) onClose?.();
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [onClose]);

  if (msLeft === null) {
    return <div className="inline-flex flex-col items-center gap-2 min-h-[6rem]" aria-hidden="true" />;
  }

  if (msLeft <= 0) {
    return (
      <div className="panel px-6 py-5 text-center">
        <p className="font-medium">The contest is now closed. Thank you to everyone who participated.</p>
      </div>
    );
  }

  const { days, hours, minutes, seconds } = getParts(msLeft);
  const units = days > 0
    ? [{ label: "days", value: days }, { label: "hrs", value: hours }, { label: "min", value: minutes }, { label: "sec", value: seconds }]
    : [{ label: "hrs", value: hours }, { label: "min", value: minutes }, { label: "sec", value: seconds }];

  const box = size === "lg" ? "text-4xl sm:text-5xl md:text-6xl min-w-[4.5rem] sm:min-w-[5.5rem]" : "text-2xl min-w-[3rem]";

  return (
    <div className="inline-flex flex-col items-center gap-2">
      <span className="text-xs uppercase tracking-[0.2em] text-muted">Contest closes in</span>
      <div className="flex items-end gap-2 sm:gap-3">
        {units.map((u, i) => (
          <div key={u.label} className="flex items-end gap-2 sm:gap-3">
            <div className="panel flex flex-col items-center px-3 py-2 sm:px-4 sm:py-3">
              <span className={`font-mono font-semibold tabular-nums text-gradient ${box} text-center`}>
                {String(u.value).padStart(2, "0")}
              </span>
              <span className="text-[10px] sm:text-xs uppercase tracking-widest text-muted mt-1">{u.label}</span>
            </div>
            {i < units.length - 1 && <span className="text-2xl text-muted pb-4">:</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
