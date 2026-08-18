-- Contest submissions: public-safe fields live here, realtime-enabled, anon-readable.
create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  clerk_user_id text not null unique,
  reference_code text not null unique,
  brand_name text not null,
  why_name text not null,
  why_logo text not null,
  tagline text,
  portfolio_url text,
  logo_url text not null,
  logo_path text not null
);

alter table public.submissions enable row level security;

create policy "public can read submissions"
  on public.submissions for select
  to anon, authenticated
  using (true);

-- no insert/update/delete policies for anon/authenticated: all writes go through
-- the server action using the service role key, which bypasses RLS.

alter publication supabase_realtime add table public.submissions;

-- Contact info: PII, never exposed to anon/authenticated, no realtime.
create table if not exists public.submission_contacts (
  submission_id uuid primary key references public.submissions(id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text not null
);

alter table public.submission_contacts enable row level security;
-- ponytail: no policies at all = only the service role (which bypasses RLS) can touch this table.

-- Logo storage bucket, public read so submitted logos render in the live feed.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('logos', 'logos', true, 10485760, array['image/png','image/jpeg','image/svg+xml','application/pdf'])
on conflict (id) do nothing;

create policy "public can read logos"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'logos');
-- writes to storage also go through the server action via the service role key.
