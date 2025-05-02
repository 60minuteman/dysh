create type subscription_status as enum ('free', 'pro');

create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  email text,
  avatar_url text,
  subscription_status subscription_status default 'free',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create a secure RLS policy
alter table public.profiles enable row level security;

create policy "Users can view their own profile" 
  on public.profiles for select 
  using ( auth.uid() = id );

create policy "Users can update their own profile" 
  on public.profiles for update 
  using ( auth.uid() = id ); 