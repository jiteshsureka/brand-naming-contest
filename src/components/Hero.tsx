import { NetworkVisual } from "./NetworkVisual";
import { Countdown } from "./Countdown";

export function Hero() {
  return (
    <section className="section relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, var(--accent-soft), transparent 70%)",
        }}
      />
      <div className="container-narrow grid gap-12 lg:grid-cols-2 items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-accent font-medium mb-5">
            A new chapter, unnamed
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.05] text-balance">
            We&rsquo;re Building Our{" "}
            <span className="text-gradient">Next Identity.</span>
          </h1>
          <p className="mt-6 text-lg text-muted max-w-xl">
            Our business has outgrown its old name. Now we&rsquo;re looking for
            the name and logo that will define what comes next.
          </p>
          <p className="mt-4 text-base text-muted/90 max-w-xl">
            We build technology for modern businesses — from e-commerce and
            ERP to microservices, custom software and agentic AI. Help us name
            the company behind it all.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#submit"
              className="rounded-full bg-accent px-6 py-3 font-medium text-white transition hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0"
            >
              Submit Your Name + Logo
            </a>
            <a
              href="#capabilities"
              className="rounded-full border border-panel-border px-6 py-3 font-medium transition hover:bg-white/5"
            >
              See What We&rsquo;re Looking For
            </a>
          </div>
          <div className="mt-12">
            <Countdown />
          </div>
        </div>
        <NetworkVisual />
      </div>
    </section>
  );
}
