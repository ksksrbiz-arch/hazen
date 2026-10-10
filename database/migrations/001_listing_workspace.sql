-- Proposed Supabase migration. Not applied by this scaffold or the static build.
-- Draft tables have no anonymous/public read access. Publishing is a separate service.
begin;
create table public.listing_editors (
 user_id uuid primary key references auth.users(id) on delete cascade,
 enabled boolean not null default true,
 created_at timestamptz not null default now()
);
alter table public.listing_editors enable row level security;
revoke all on public.listing_editors from anon, authenticated;
grant select on public.listing_editors to authenticated;
create policy "Editor may read their own membership" on public.listing_editors
 for select to authenticated using (user_id = (select auth.uid()));

create table public.listing_drafts (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null references auth.users(id) on delete cascade,
 slug text not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
 content jsonb not null default '{}'::jsonb check (jsonb_typeof(content)='object'),
 revision integer not null default 1 check (revision > 0),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 unique(owner_id, slug)
);
alter table public.listing_drafts enable row level security;
revoke all on public.listing_drafts from anon, authenticated;
grant select, insert, update, delete on public.listing_drafts to authenticated;
create policy "Editor manages their own drafts" on public.listing_drafts
 for all to authenticated
 using (owner_id=(select auth.uid()) and exists(select 1 from public.listing_editors where user_id=(select auth.uid()) and enabled))
 with check (owner_id=(select auth.uid()) and exists(select 1 from public.listing_editors where user_id=(select auth.uid()) and enabled));
create function public.advance_listing_revision() returns trigger language plpgsql set search_path=public as $$
begin new.revision:=old.revision+1;new.updated_at:=now();return new;end;$$;
create trigger advance_listing_revision before update on public.listing_drafts
 for each row execute function public.advance_listing_revision();

create table public.listing_publish_jobs (
 id uuid primary key default gen_random_uuid(),
 draft_id uuid references public.listing_drafts(id) on delete set null,
 owner_id uuid not null references auth.users(id) on delete cascade,
 requested_revision integer not null check(requested_revision > 0),
 action text not null check(action in ('publish','unpublish')),
 state text not null default 'queued' check(state in ('queued','building','live','failed')),
 snapshot jsonb not null check(jsonb_typeof(snapshot)='object'),
 deployment_id text,
 requested_at timestamptz not null default now(),
 completed_at timestamptz
);
alter table public.listing_publish_jobs enable row level security;
revoke all on public.listing_publish_jobs from anon, authenticated;
grant select on public.listing_publish_jobs to authenticated;
create policy "Editor sees their own publication jobs" on public.listing_publish_jobs
 for select to authenticated using(owner_id=(select auth.uid()) and exists(select 1 from public.listing_editors where user_id=(select auth.uid()) and enabled));
-- Only the trusted publication service writes jobs, validates snapshots, and
-- promotes whitelisted public fields/photos. Editor clients cannot mark a job live.
grant all on public.listing_editors, public.listing_drafts, public.listing_publish_jobs to service_role;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
 values('listing-drafts','listing-drafts',false,400000,array['image/jpeg','image/png','image/webp']);
create policy "Editor controls private listing draft photos" on storage.objects
 for all to authenticated
 using(bucket_id='listing-drafts' and (storage.foldername(name))[1]=(select auth.uid())::text
 and exists(select 1 from public.listing_editors where user_id=(select auth.uid()) and enabled))
 with check(bucket_id='listing-drafts' and (storage.foldername(name))[1]=(select auth.uid())::text
 and exists(select 1 from public.listing_editors where user_id=(select auth.uid()) and enabled));
commit;
