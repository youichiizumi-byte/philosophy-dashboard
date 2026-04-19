-- supabase/migrations/001_initial_schema.sql

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Companies table
create table public.companies (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  industry text not null,
  size text check (size in ('startup', 'sme', 'enterprise')) not null,
  founded_year integer,
  website text,
  logo_url text,
  slug text unique not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Philosophy analyses table
create table public.philosophy_analyses (
  id uuid default uuid_generate_v4() primary key,
  company_id uuid references public.companies(id) on delete cascade not null,
  raw_input jsonb not null,
  core_principles jsonb not null default '[]',
  leadership_dna jsonb not null default '{}',
  culture_blueprint jsonb not null default '{}',
  strategic_pillars jsonb not null default '[]',
  vision_statement text,
  mission_statement text,
  manifesto text,
  key_phrases jsonb not null default '[]',
  decision_filters jsonb not null default '[]',
  created_at timestamptz default now() not null
);

-- Dashboard configs table
create table public.dashboard_configs (
  id uuid default uuid_generate_v4() primary key,
  company_id uuid references public.companies(id) on delete cascade not null,
  slug text unique not null,
  primary_color text not null default '#6366f1',
  secondary_color text not null default '#8b5cf6',
  font_family text not null default 'modern',
  style text check (style in ('minimal', 'rich', 'executive')) not null default 'minimal',
  custom_domain text,
  vercel_deployment_id text,
  deployment_url text,
  is_deployed boolean default false,
  created_at timestamptz default now() not null
);

-- Subscriptions table
create table public.subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  company_id uuid references public.companies(id) on delete cascade not null,
  stripe_customer_id text unique not null,
  stripe_subscription_id text unique,
  plan text check (plan in ('starter', 'professional', 'enterprise')) not null default 'starter',
  status text check (status in ('active', 'canceled', 'past_due', 'trialing')) not null default 'trialing',
  current_period_end timestamptz,
  created_at timestamptz default now() not null
);

-- Row Level Security
alter table public.companies enable row level security;
alter table public.philosophy_analyses enable row level security;
alter table public.dashboard_configs enable row level security;
alter table public.subscriptions enable row level security;

-- RLS Policies: Companies
create policy "Users can view own companies"
  on public.companies for select
  using (auth.uid() = user_id);

create policy "Users can insert own companies"
  on public.companies for insert
  with check (auth.uid() = user_id);

create policy "Users can update own companies"
  on public.companies for update
  using (auth.uid() = user_id);

-- RLS Policies: Philosophy analyses (via company ownership)
create policy "Users can view own analyses"
  on public.philosophy_analyses for select
  using (
    company_id in (
      select id from public.companies where user_id = auth.uid()
    )
  );

create policy "Users can insert own analyses"
  on public.philosophy_analyses for insert
  with check (
    company_id in (
      select id from public.companies where user_id = auth.uid()
    )
  );

-- Public read for deployed dashboards (by slug)
create policy "Public can view deployed dashboard configs"
  on public.dashboard_configs for select
  using (is_deployed = true);

create policy "Users can manage own dashboard configs"
  on public.dashboard_configs for all
  using (
    company_id in (
      select id from public.companies where user_id = auth.uid()
    )
  );

-- RLS Policies: Subscriptions
create policy "Users can view own subscriptions"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- Updated_at trigger
create or replace function handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at
  before update on public.companies
  for each row execute function handle_updated_at();

-- Indexes
create index idx_companies_user_id on public.companies(user_id);
create index idx_companies_slug on public.companies(slug);
create index idx_analyses_company_id on public.philosophy_analyses(company_id);
create index idx_dashboard_slug on public.dashboard_configs(slug);
create index idx_subscriptions_user_id on public.subscriptions(user_id);
create index idx_subscriptions_stripe_customer on public.subscriptions(stripe_customer_id);
