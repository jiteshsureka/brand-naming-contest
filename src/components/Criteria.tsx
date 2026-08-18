const CRITERIA = [
  { n: "01", title: "Memorability", body: "Easy to remember. Easy to pronounce.", color: "var(--accent)", emoji: "🧠" },
  { n: "02", title: "Brandability", body: "Should have the potential to become a strong technology brand.", color: "var(--pop-blue)", emoji: "🚀" },
  { n: "03", title: "Future-Proof", body: "Should still make sense as our technology capabilities evolve.", color: "var(--pop-mint)", emoji: "🔮" },
  { n: "04", title: "Meaning", body: "A strong concept, story or reasoning behind the name.", color: "var(--pop-yellow)", emoji: "💡" },
  { n: "05", title: "Visual Identity", body: "The logo should feel distinctive, premium and scalable.", color: "var(--accent)", emoji: "🎨" },
];

const ROTATIONS = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2", "-rotate-1"];

export function Criteria() {
  return (
    <section id="criteria" className="section relative overflow-hidden">
      <div className="blob w-80 h-80 bg-pop-mint left-1/2 -translate-x-1/2 top-0" />
      <div className="container-narrow">
        <h2 className="text-3xl sm:text-4xl text-center">What Will Make a Winning Idea?</h2>
        <p className="mt-3 text-center text-muted">Five things we&rsquo;ll be looking for — you don&rsquo;t need all five.</p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CRITERIA.map((c, i) => (
            <div
              key={c.n}
              className={`panel p-6 ${ROTATIONS[i]} hover:rotate-0 hover:-translate-y-2 ${
                i === CRITERIA.length - 1 ? "sm:col-span-2 lg:col-span-1" : ""
              }`}
            >
              <div
                className="h-12 w-12 rounded-2xl flex items-center justify-center text-2xl mb-4"
                style={{ background: `color-mix(in srgb, ${c.color} 18%, transparent)` }}
              >
                {c.emoji}
              </div>
              <span className="font-mono text-xs" style={{ color: c.color }}>
                {c.n}
              </span>
              <h3 className="mt-1 font-display font-semibold text-lg">{c.title}</h3>
              <p className="mt-2 text-sm text-muted">{c.body}</p>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-muted">
          You don&rsquo;t need to tick every box. A brilliant idea with a
          compelling story can win.
        </p>
      </div>
    </section>
  );
}
