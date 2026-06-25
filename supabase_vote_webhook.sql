-- À exécuter une seule fois dans l'éditeur SQL Supabase (https://app.supabase.com -> ton projet -> SQL Editor)
-- Met en place le système de comptage de votes indépendant du navigateur (webhook Kkiapay).

create table if not exists public.vote_transactions (
  id text primary key,
  team_id uuid not null references public.voting_teams(id),
  vote_count int not null check (vote_count > 0),
  amount int not null,
  kkiapay_transaction_id text,
  status text not null default 'pending' check (status in ('pending', 'success', 'failed')),
  created_at timestamptz not null default now(),
  processed_at timestamptz
);

create index if not exists vote_transactions_kkiapay_transaction_id_idx
  on public.vote_transactions (kkiapay_transaction_id);

create index if not exists vote_transactions_status_created_at_idx
  on public.vote_transactions (status, created_at desc);

alter table public.vote_transactions enable row level security;

drop policy if exists "public insert pending vote transaction" on public.vote_transactions;
create policy "public insert pending vote transaction"
  on public.vote_transactions
  for insert
  to anon
  with check (status = 'pending');

-- RPC unique appelé à la fois par le webhook serveur et par le flux client existant.
-- La transition pending -> success est atomique : seul le premier appelant incrémente réellement,
-- ce qui empêche un double comptage si le client ET le webhook tentent tous les deux de confirmer.
create or replace function public.confirm_vote_transaction(p_id text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_team_id uuid;
  v_vote_count int;
begin
  update vote_transactions
    set status = 'success', processed_at = now()
    where id = p_id and status = 'pending'
    returning team_id, vote_count into v_team_id, v_vote_count;

  if v_team_id is null then
    return false;
  end if;

  update voting_teams set votes = votes + v_vote_count where id = v_team_id;
  return true;
end;
$$;

grant execute on function public.confirm_vote_transaction(text) to anon, authenticated, service_role;
