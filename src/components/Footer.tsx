const LINKS = [
  { label: "Contest", href: "#submit" },
  { label: "Criteria", href: "#criteria" },
];

export function Footer() {
  return (
    <footer className="border-t border-panel-border">
      <div className="container-narrow py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <p className="font-display font-semibold text-lg">Brain Station 23</p>
          <p className="text-sm text-muted">Building what businesses need next.</p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
          {LINKS.map((l) => (
            <a key={l.label} href={l.href} className="hover:text-white transition">
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
