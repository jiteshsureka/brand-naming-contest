const KEYWORDS = [
  "Speed", "Technology", "Scale", "Intelligence", "Trust", "Transformation",
  "Commerce", "Enterprise", "AI", "Innovation", "Connectivity", "Execution",
];

export function NameKeywords() {
  return (
    <section className="section">
      <div className="container-narrow text-center">
        <h2 className="text-3xl sm:text-4xl font-semibold">
          Don&rsquo;t Just Name a Company. Name What Comes Next.
        </h2>
        <p className="mt-4 text-muted">We&rsquo;re looking for a name that can grow with us.</p>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {KEYWORDS.map((k) => (
            <span
              key={k}
              className="rounded-full border border-panel-border px-4 py-2 text-sm text-muted transition hover:border-accent hover:text-white hover:bg-accent-soft"
            >
              {k}
            </span>
          ))}
        </div>

        <p className="mt-10 max-w-2xl mx-auto text-muted">
          The name does not need to literally describe what we do. In fact,
          we prefer names that can become a strong technology brand in their
          own right.
        </p>
      </div>
    </section>
  );
}
