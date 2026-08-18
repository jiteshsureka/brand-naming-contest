-- Provider-agnostic user id (was Clerk-specific), and up to 2 entries per person now.
alter table public.submissions rename column clerk_user_id to auth_user_id;
alter table public.submissions drop constraint submissions_clerk_user_id_key;
create index submissions_auth_user_id_idx on public.submissions (auth_user_id);

alter table public.submissions
  add column upvotes integer not null default 0,
  add column downvotes integer not null default 0;

-- Individual votes: never anon-readable (mirrors submission_contacts), only
-- the aggregated upvotes/downvotes on submissions are public.
create table public.votes (
  submission_id uuid not null references public.submissions(id) on delete cascade,
  voter_user_id text not null,
  value smallint not null check (value in (1, -1)),
  created_at timestamptz not null default now(),
  primary key (submission_id, voter_user_id)
);

alter table public.votes enable row level security;
-- no policies: only the service role (which bypasses RLS) can touch this table.

create or replace function public.refresh_submission_vote_counts()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  target uuid := coalesce(new.submission_id, old.submission_id);
begin
  update public.submissions s
  set upvotes = (select count(*) from public.votes v where v.submission_id = target and v.value = 1),
      downvotes = (select count(*) from public.votes v where v.submission_id = target and v.value = -1)
  where s.id = target;
  return null;
end;
$$;

create trigger votes_refresh_counts
after insert or update or delete on public.votes
for each row execute function public.refresh_submission_vote_counts();
