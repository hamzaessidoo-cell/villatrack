-- VillaTrack Supabase schema
create extension if not exists pgcrypto;

create table if not exists public.villas (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location text,
  bedrooms integer not null default 3 check (bedrooms > 0),
  price numeric(12,2) not null default 0 check (price >= 0),
  status text not null default 'available' check (status in ('available','booked','maintenance')),
  accent text default 'image-1',
  created_at timestamptz not null default now()
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  villa_id uuid not null references public.villas(id) on delete restrict,
  guest_name text not null,
  guest_phone text,
  check_in date not null,
  check_out date not null,
  nights integer generated always as ((check_out - check_in)) stored,
  total numeric(12,2) not null default 0 check (total >= 0),
  payment_status text not null default 'pending' check (payment_status in ('paid','pending','deposit')),
  status text not null default 'confirmed' check (status in ('confirmed','pending','cancelled')),
  created_at timestamptz not null default now(),
  constraint valid_dates check (check_out > check_in)
);

create index if not exists bookings_villa_dates_idx on public.bookings (villa_id, check_in, check_out);

alter table public.villas enable row level security;
alter table public.bookings enable row level security;

-- For a private multi-user SaaS, replace these policies with auth.uid()-scoped policies.
drop policy if exists "public can read villas" on public.villas;
drop policy if exists "public can write villas" on public.villas;
drop policy if exists "public can read bookings" on public.bookings;
drop policy if exists "public can write bookings" on public.bookings;
create policy "public can read villas" on public.villas for select using (true);
create policy "public can write villas" on public.villas for all using (true) with check (true);
create policy "public can read bookings" on public.bookings for select using (true);
create policy "public can write bookings" on public.bookings for all using (true) with check (true);

-- Database-level overlap guard: active reservations for one villa cannot overlap.
create or replace function public.prevent_booking_overlap()
returns trigger language plpgsql as $$
begin
  if new.status <> 'cancelled' and exists (
    select 1 from public.bookings b
    where b.villa_id = new.villa_id and b.status <> 'cancelled' and b.id <> coalesce(new.id, gen_random_uuid())
      and b.check_in < new.check_out and b.check_out > new.check_in
  ) then
    raise exception 'booking_overlap: this villa is already booked for the selected dates';
  end if;
  return new;
end;
$$;
drop trigger if exists bookings_no_overlap on public.bookings;
create trigger bookings_no_overlap before insert or update on public.bookings for each row execute function public.prevent_booking_overlap();
