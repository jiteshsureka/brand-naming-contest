const CRITERIA = [
  { n: "01", title: "Memorability", body: "Easy to remember. Easy to pronounce." },
  { n: "02", title: "Brandability", body: "Should have the potential to become a strong technology brand." },
  { n: "03", title: "Future-Proof", body: "Should still make sense as our technology capabilities evolve." },
  { n: "04", title: "Meaning", body: "A strong concept, story or reasoning behind the name." },
  { n: "05", title: "Visual Identity", body: "The logo should feel distinctive, premium and scalable." },
];

export function Criteria() {
  return (
    <section id="criteria" className="section">
      <div className="container-narrow">
        <h2 className="text-3xl sm:text-4xl font-semibold">What Will Make a Winning Idea?</h2>
        <div className="mt-10 space-y-3">
          {CRITERIA.map((c) => (
            <div key={c.n} className="panel p-5 flex gap-5 items-start">
              <span className="font-mono text-accent/70 text-lg pt-0.5">{c.n}</span>
              <div>
                <h3 className="font-medium">{c.title}</h3>
                <p className="text-sm text-muted mt-1">{c.body}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-8 text-muted">
          You don&rsquo;t need to tick every box. A brilliant idea with a
          compelling story can win.
        </p>
      </div>
    </section>
  );
}
