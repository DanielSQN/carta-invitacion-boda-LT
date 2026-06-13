-- Esquema de la tabla de confirmaciones (RSVP).
-- Ejecuta esto en el SQL Editor de Supabase (una sola vez).

create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  attending boolean not null,
  guest_count integer not null default 0,
  names text[] not null default '{}',
  invited_as text,
  message text
);

-- RLS activado SIN políticas públicas: nadie puede leer/escribir con la
-- anon key. Todo el acceso ocurre desde el servidor con la service role key
-- (que ignora RLS), así que las confirmaciones quedan privadas.
alter table public.rsvps enable row level security;

create index if not exists rsvps_created_at_idx on public.rsvps (created_at desc);
