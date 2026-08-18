import { ONE_SUBMISSION_PER_PERSON, REQUIRE_LOGO } from "@/lib/contest-config";

const FAQS = [
  { q: "Is this only for professional designers?", a: "No. Great ideas can come from anywhere." },
  { q: "Do I need to be a designer?", a: "No. The idea and reasoning are just as important as the visual execution." },
  {
    q: "Can I submit more than one idea?",
    a: ONE_SUBMISSION_PER_PERSON
      ? "No, one submission per person."
      : "Yes, you may submit multiple ideas.",
  },
  { q: "What should the name be about?", a: "Think about the company we are becoming, not only what we currently sell." },
  { q: "What is the prize?", a: "A Dhaka–Cox's Bazar–Dhaka round-trip flight ticket." },
  { q: "How long is the contest?", a: "72 hours from the official launch time." },
  {
    q: "Can I submit a name without a logo?",
    a: REQUIRE_LOGO
      ? "No, both a name and a logo concept are required."
      : "Yes, a logo is optional.",
  },
  { q: "Who owns the winning submission?", a: "See the Contest Terms section below for full intellectual-property terms." },
];

export function Faq() {
  return (
    <section id="faq" className="section">
      <div className="container-narrow">
        <h2 className="text-3xl sm:text-4xl font-semibold">FAQ</h2>
        <div className="mt-8 divide-y divide-panel-border panel px-6 sm:px-8">
          {FAQS.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="cursor-pointer list-none flex items-center justify-between gap-4 font-medium">
                {f.q}
                <span className="text-accent transition group-open:rotate-45 text-xl leading-none">+</span>
              </summary>
              <p className="mt-3 text-sm text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
