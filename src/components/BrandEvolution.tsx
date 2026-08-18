export function BrandEvolution() {
  return (
    <section className="section">
      <div className="container-narrow">
        <div className="grid gap-6 sm:grid-cols-[1fr_auto_1fr] items-center">
          <div className="panel p-8 text-center">
            <p className="text-xs uppercase tracking-[0.25em] text-muted mb-3">Then</p>
            <p className="text-xl font-medium">nopCommerce-focused solutions</p>
          </div>
          <div className="flex sm:flex-col items-center justify-center gap-1 py-4">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-accent pulse-dot"
                style={{ animationDelay: `${i * 0.25}s` }}
              />
            ))}
          </div>
          <div className="panel p-8 text-center border-accent/40">
            <p className="text-xs uppercase tracking-[0.25em] text-accent mb-3">Now</p>
            <p className="text-xl font-medium text-gradient">Enterprise Technology</p>
          </div>
        </div>
      </div>
    </section>
  );
}
