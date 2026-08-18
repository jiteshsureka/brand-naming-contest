const COLORS = ["var(--accent)", "var(--pop-blue)", "var(--pop-mint)", "var(--pop-yellow)"];

const CARDS = [
  { title: "E-commerce", body: "Shopify, nopCommerce and custom commerce experiences.", emoji: "🛒" },
  { title: "ERP", body: "Odoo implementations, customization and integrations.", emoji: "⚙️" },
  { title: "Microservices", body: "Scalable, distributed and cloud-native architectures.", emoji: "🧩" },
  { title: "Custom Software", body: "Purpose-built systems designed around unique business requirements.", emoji: "🛠️" },
  { title: "AI & Automation", body: "Intelligent workflows, automation and AI-powered products.", emoji: "⚡" },
  { title: "Agentic AI", body: "AI agents and intelligent systems that can reason, act and execute.", emoji: "🤖" },
  { title: "Enterprise Solutions", body: "Technology platforms designed for growing and large-scale organizations.", emoji: "🏢" },
  { title: "Digital Transformation", body: "Helping businesses modernize legacy processes and technology.", emoji: "🌀" },
];

export function Capabilities() {
  return (
    <section id="capabilities" className="section">
      <div className="container-narrow">
        <h2 className="text-3xl sm:text-4xl">What We Build.</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CARDS.map((c, i) => {
            const color = COLORS[i % COLORS.length];
            return (
              <div
                key={c.title}
                className="panel p-6 hover:-translate-y-1.5 hover:rotate-1"
              >
                <div
                  className="h-10 w-10 rounded-xl mb-4 flex items-center justify-center text-xl"
                  style={{ background: `color-mix(in srgb, ${color} 18%, transparent)` }}
                >
                  {c.emoji}
                </div>
                <h3 className="font-display font-semibold">{c.title}</h3>
                <p className="mt-2 text-sm text-muted">{c.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
