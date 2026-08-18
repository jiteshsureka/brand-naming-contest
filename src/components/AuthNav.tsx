import { auth0 } from "@/lib/auth0";

export async function AuthNav() {
  const session = await auth0.getSession();

  if (!session) {
    return (
      <a
        href="/auth/login"
        className="rounded-full border border-panel-border px-4 py-2 text-sm font-medium hover:bg-white/5 transition"
      >
        Sign in
      </a>
    );
  }

  return (
    <a
      href="/auth/logout"
      className="rounded-full border border-panel-border px-4 py-2 text-sm font-medium hover:bg-white/5 transition"
      title={session.user.email}
    >
      Sign out
    </a>
  );
}
