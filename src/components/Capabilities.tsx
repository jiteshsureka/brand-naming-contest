const CARDS = [
  { title: "E-commerce", body: "Shopify, nopCommerce and custom commerce experiences." },
  { title: "ERP", body: "Odoo implementations, customization and integrations." },
  { title: "Microservices", body: "Scalable, distributed and cloud-native architectures." },
  { title: "Custom Software", body: "Purpose-built systems designed around unique business requirements." },
  { title: "AI & Automation", body: "Intelligent workflows, automation and AI-powered products." },
  { title: "Agentic AI", body: "AI agents and intelligent systems that can reason, act and execute." },
  { title: "Enterprise Solutions", body: "Technology platforms designed for growing and large-scale organizations." },
  { title: "Digital Transformation", body: "Helping businesses modernize legacy processes and technology." },
];

export function Capabilities() {
  return (
    <section id="capabilities" className="section">
      <div className="container-narrow">
        <h2 className="text-3xl sm:text-4xl font-semibold">What We Build.</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CARDS.map((c) => (
            <div
              key={c.title}
              className="panel p-6 transition duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_0_40px_-12px_var(--accent)]"
            >
              <div className="h-9 w-9 rounded-lg bg-accent-soft mb-4 flex items-center justify-center text-accent">
                <span className="h-2 w-2 rounded-full bg-accent" />
              </div>
              <h3 className="font-medium">{c.title}</h3>
              <p className="mt-2 text-sm text-muted">{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
