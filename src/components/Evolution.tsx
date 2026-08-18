const STEPS = [
  "nopCommerce", "E-commerce", "ERP", "Microservices",
  "Custom Software", "AI", "Agentic AI", "Enterprise Technology",
];

export function Evolution() {
  return (
    <section className="section">
      <div className="container-narrow">
        <h2 className="text-3xl sm:text-4xl font-semibold text-balance">
          Because We&rsquo;ve Outgrown Our Old Identity.
        </h2>
        <p className="mt-4 text-muted max-w-2xl">
          Our journey started with a strong focus on nopCommerce solutions.
          Today, our capabilities extend far beyond a single platform.
        </p>

        <div className="mt-12 flex flex-wrap items-center gap-3">
          {STEPS.map((step, i) => (
            <div key={step} className="flex items-center gap-3">
              <span
                className={`rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap ${
                  i === STEPS.length - 1
                    ? "border-accent bg-accent-soft text-white"
                    : "border-panel-border text-muted"
                }`}
              >
                {step}
              </span>
              {i < STEPS.length - 1 && (
                <span className="text-accent/60">&rarr;</span>
              )}
            </div>
          ))}
        </div>

        <p className="mt-10 text-muted max-w-2xl">
          We now work across platforms, architectures and technologies to
          solve complex business problems. Our identity needs to reflect
          where we are going — not where we started.
        </p>
      </div>
    </section>
  );
}
