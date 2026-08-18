const STEPS = [
  { n: "01", title: "Think", body: "Come up with a name that can represent our next chapter." },
  { n: "02", title: "Create", body: "Design a logo and explain the thinking behind both." },
  { n: "03", title: "Submit", body: "Send your idea before the 72-hour deadline." },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="section">
      <div className="container-narrow">
        <h2 className="text-3xl sm:text-4xl font-semibold">How It Works.</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="panel p-6">
              <span className="text-3xl font-mono text-accent/70">{s.n}</span>
              <h3 className="mt-3 font-medium text-lg">{s.title}</h3>
              <p className="mt-2 text-sm text-muted">{s.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-lg font-medium text-gradient">We Pick the Winner.</p>
      </div>
    </section>
  );
}
