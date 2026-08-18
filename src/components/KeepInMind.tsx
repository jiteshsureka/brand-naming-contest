const POINTS = [
  "Don't feel limited by our current services.",
  "The name does not have to contain words like “tech”, “software”, “AI”, “digital” or “solutions”.",
  "Think beyond today's technology.",
  "Think about what an enterprise technology company could become 5–10 years from now.",
  "Short, distinctive names are encouraged.",
  "Avoid names that are difficult to pronounce or spell.",
  "Original thinking matters more than complexity.",
];

export function KeepInMind() {
  return (
    <section className="section">
      <div className="container-narrow">
        <div className="panel p-8 sm:p-10">
          <h2 className="text-2xl sm:text-3xl font-semibold">A Few Things To Keep In Mind</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {POINTS.map((p) => (
              <li key={p} className="flex gap-3 text-sm text-muted">
                <span className="text-accent mt-1">&#8226;</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
