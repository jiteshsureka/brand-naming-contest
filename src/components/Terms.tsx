import { CONTEST_START, CONTEST_DEADLINE } from "@/lib/contest-config";

const TERMS = [
  { title: "Eligibility", body: "[Placeholder — define who may enter, e.g. age, region, employment exclusions.]" },
  { title: "Submission Limit", body: "[Placeholder — one entry per person unless stated otherwise.]" },
  {
    title: "Contest Start/End Time",
    body: `Contest opens ${CONTEST_START.toUTCString()} and closes ${CONTEST_DEADLINE.toUTCString()}.`,
  },
  { title: "Originality Requirement", body: "[Placeholder — entrant confirms the submission is their own original work.]" },
  { title: "Copyright / IP Ownership", body: "[Placeholder — define who owns submitted names/logos after the contest.]" },
  { title: "Right to Modify Submitted Concepts", body: "[Placeholder — define whether the company may adapt a winning concept before use.]" },
  { title: "Winner Selection Process", body: "[Placeholder — describe judging panel / criteria weighting / timeline.]" },
  { title: "Prize Terms", body: "[Placeholder — flight class, dates, transferability, taxes.]" },
  { title: "Flight Ticket Validity", body: "[Placeholder — booking window and expiry.]" },
  { title: "Winner Announcement", body: "[Placeholder — channel and date of announcement.]" },
  { title: "Disqualification Conditions", body: "[Placeholder — plagiarism, offensive content, late entries, etc.]" },
  { title: "Privacy / Data Handling", body: "[Placeholder — how contact info collected in this form is stored and used.]" },
];

export function Terms() {
  return (
    <section id="terms" className="section">
      <div className="container-narrow">
        <h2 className="text-3xl sm:text-4xl font-semibold">Contest Terms</h2>
        <p className="mt-3 text-sm text-muted">
          Placeholder legal wording below — replace with the company&rsquo;s final terms before launch.
        </p>
        <div className="mt-8 divide-y divide-panel-border panel px-6 sm:px-8">
          {TERMS.map((t) => (
            <details key={t.title} className="group py-5">
              <summary className="cursor-pointer list-none flex items-center justify-between gap-4 font-medium">
                {t.title}
                <span className="text-accent transition group-open:rotate-45 text-xl leading-none">+</span>
              </summary>
              <p className="mt-3 text-sm text-muted">{t.body}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
