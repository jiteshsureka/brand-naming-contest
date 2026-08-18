import { PrizeTicket } from "./PrizeTicket";

export function Prize() {
  return (
    <section className="section">
      <div className="container-narrow">
        <div className="panel p-10 sm:p-14 text-center relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 -z-10"
            style={{ background: "radial-gradient(50% 60% at 50% 100%, var(--accent-soft), transparent 70%)" }}
          />
          <h2 className="text-3xl sm:text-4xl">Make Your Mark. Win a Trip.</h2>
          <div className="mt-8 flex justify-center">
            <PrizeTicket />
          </div>
          <p className="mt-3 text-muted">1 Round-Trip Flight Ticket</p>
          <p className="mt-6 max-w-xl mx-auto text-muted">
            The winning name + logo concept will earn its creator a
            Dhaka–Cox&rsquo;s Bazar–Dhaka flight ticket.
          </p>
        </div>
      </div>
    </section>
  );
}
