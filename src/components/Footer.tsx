const LINKS = [
  { label: "Contest", href: "#submit" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Criteria", href: "#criteria" },
  { label: "FAQ", href: "#faq" },
  { label: "Terms", href: "#terms" },
  { label: "Privacy", href: "#terms" },
];

export function Footer() {
  return (
    <footer className="border-t border-panel-border">
      <div className="container-narrow py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <p className="font-medium">Brain Station 23</p>
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
