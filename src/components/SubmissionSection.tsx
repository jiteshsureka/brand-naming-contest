import { SignInButton, Show } from "@clerk/nextjs";
import { SubmissionForm } from "./SubmissionForm";
import { LiveFeed } from "./LiveFeed";
import { Countdown } from "./Countdown";
import { isContestOpen } from "@/lib/contest-config";

export function SubmissionSection() {
  const open = isContestOpen();

  return (
    <section id="submit" className="section">
      <div className="container-narrow">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl">Toss Us Your Idea 🎉</h2>
          <div className="mt-6 flex justify-center">
            <Countdown size="sm" />
          </div>
        </div>

        {!open ? (
          <div className="panel p-10 text-center max-w-xl mx-auto">
            <p className="font-medium">
              The contest is now closed. Thank you to everyone who participated.
            </p>
          </div>
        ) : (
          <>
            <Show when="signed-out">
              <div className="panel p-10 text-center max-w-xl mx-auto">
                <p className="text-muted mb-6">Sign in to submit your name and logo idea.</p>
                <SignInButton mode="modal">
                  <button className="rounded-full bg-accent px-6 py-3 font-medium text-white transition hover:brightness-110">
                    Sign in to submit
                  </button>
                </SignInButton>
              </div>
            </Show>
            <Show when="signed-in">
              <div className="max-w-2xl mx-auto">
                <SubmissionForm />
              </div>
            </Show>
          </>
        )}

        <div className="mt-16">
          <h3 className="text-center text-sm uppercase tracking-[0.2em] text-muted mb-6">
            Live Submissions
          </h3>
          <LiveFeed />
        </div>
      </div>
    </section>
  );
}
