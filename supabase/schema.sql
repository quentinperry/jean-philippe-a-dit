-- Recueil partagé « Jean-Philippe a dit »
-- À coller une fois dans Supabase : SQL Editor → New query → Run.
-- Le script peut être relancé sans risque.

create table if not exists public.quotes (
  id           uuid primary key default gen_random_uuid(),
  chapter      text not null
               check (chapter in ('hommages', 'animaux', 'vie', 'voix', 'menaces', 'doux', 'conseils')),
  text         text not null check (char_length(btrim(text)) between 1 and 600),
  source       text not null default '' check (char_length(source) <= 200),
  created_at   timestamptz not null default now(),
  -- Jeton secret gardé par le navigateur qui a ajouté la citation : lui seul peut la supprimer.
  delete_token uuid not null default gen_random_uuid()
);

alter table public.quotes enable row level security;

-- Tout le monde peut lire et ajouter. Personne ne peut modifier ni supprimer directement.
drop policy if exists "lecture publique" on public.quotes;
create policy "lecture publique" on public.quotes
  for select to anon, authenticated using (true);

drop policy if exists "ajout public" on public.quotes;
create policy "ajout public" on public.quotes
  for insert to anon, authenticated with check (true);

-- Droits par colonne : le jeton de suppression n'est jamais lisible depuis le site.
revoke all on public.quotes from anon, authenticated;
grant select (id, chapter, text, source, created_at) on public.quotes to anon, authenticated;
grant insert (id, chapter, text, source, delete_token) on public.quotes to anon, authenticated;

-- Suppression : uniquement avec le bon jeton.
create or replace function public.delete_quote(quote_id uuid, token uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  with deleted as (
    delete from public.quotes where id = quote_id and delete_token = token returning 1
  )
  select exists (select 1 from deleted);
$$;

revoke all on function public.delete_quote(uuid, uuid) from public;
grant execute on function public.delete_quote(uuid, uuid) to anon, authenticated;
