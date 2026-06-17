-- ================================================================
-- RAW VISION MEDIA — COMPLETE SUPABASE BACKEND SETUP
-- Run this entire script in Supabase SQL Editor
-- ================================================================


-- ================================================================
-- STEP 1: PROFILES TABLE
-- ================================================================

create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  name text,
  email text,
  phone text,
  role text default 'student' check (role in ('student', 'faculty', 'external', 'admin')),
  created_at timestamptz default now()
);

-- RLS
alter table public.profiles enable row level security;

drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists "Admins can view all profiles" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Users can insert own profile" on public.profiles;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Admins can view all profiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Admins can update any profile"
  on public.profiles for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can delete any profile"
  on public.profiles for delete
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Auto-create profile when user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, email, phone, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', ''),
    new.email,
    coalesce(new.raw_user_meta_data->>'phone', ''),
    coalesce(new.raw_user_meta_data->>'role', 'student')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ================================================================
-- STEP 2: EVENTS TABLE
-- ================================================================

create table if not exists public.events (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  event_date date,
  year integer,
  cover_image text,
  google_drive_folder text,
  category text,
  visibility text default 'public' check (visibility in ('public', 'private')),
  featured boolean default false,
  created_at timestamptz default now()
);

alter table public.events enable row level security;

drop policy if exists "Anyone can view public events" on public.events;
drop policy if exists "Admins can manage events" on public.events;

create policy "Anyone can view public events"
  on public.events for select
  using (visibility = 'public');

create policy "Logged in users can view private events"
  on public.events for select
  using (auth.uid() is not null);

create policy "Admins can insert events"
  on public.events for insert
  with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can update events"
  on public.events for update
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can delete events"
  on public.events for delete
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );


-- ================================================================
-- STEP 3: APPLICATIONS TABLE
-- ================================================================

create table if not exists public.applications (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  phone text,
  year text,
  course text,
  preference1 text,
  preference2 text,
  preference3 text,
  why_join text,
  experience text,
  creative_drive_link text,
  created_at timestamptz default now()
);

alter table public.applications enable row level security;

drop policy if exists "Anyone can submit application" on public.applications;
drop policy if exists "Admins can view applications" on public.applications;

create policy "Anyone can submit application"
  on public.applications for insert
  with check (true);

create policy "Admins can view applications"
  on public.applications for select
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can delete applications"
  on public.applications for delete
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );


-- ================================================================
-- STEP 4: COVERAGE REQUESTS TABLE
-- ================================================================

create table if not exists public.coverage_requests (
  id uuid default gen_random_uuid() primary key,
  event_name text not null,
  committee text,
  venue text,
  date date,
  contact_person text,
  email text,
  phone text,
  coverage_type text check (coverage_type in ('Photography', 'Videography', 'Both')),
  description text,
  expected_crowd text,
  special_requirements text,
  created_at timestamptz default now()
);

alter table public.coverage_requests enable row level security;

drop policy if exists "Anyone can submit coverage request" on public.coverage_requests;
drop policy if exists "Admins can view coverage requests" on public.coverage_requests;

create policy "Anyone can submit coverage request"
  on public.coverage_requests for insert
  with check (true);

create policy "Admins can view coverage requests"
  on public.coverage_requests for select
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can delete coverage requests"
  on public.coverage_requests for delete
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );


-- ================================================================
-- STEP 5: SCRAPBOOK TABLE
-- ================================================================

create table if not exists public.scrapbook (
  id uuid default gen_random_uuid() primary key,
  image_url text not null,
  caption text,
  featured boolean default false,
  order_index integer default 0,
  created_at timestamptz default now()
);

alter table public.scrapbook enable row level security;

drop policy if exists "Anyone can view scrapbook" on public.scrapbook;
drop policy if exists "Admins can manage scrapbook" on public.scrapbook;

create policy "Anyone can view scrapbook"
  on public.scrapbook for select
  using (true);

create policy "Admins can insert scrapbook"
  on public.scrapbook for insert
  with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can update scrapbook"
  on public.scrapbook for update
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can delete scrapbook"
  on public.scrapbook for delete
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );


-- ================================================================
-- STEP 6: VIDEOS TABLE
-- ================================================================

create table if not exists public.videos (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  video_url text not null,
  thumbnail text,
  featured boolean default false,
  order_index integer default 0,
  created_at timestamptz default now()
);

alter table public.videos enable row level security;

drop policy if exists "Anyone can view videos" on public.videos;
drop policy if exists "Admins can manage videos" on public.videos;

create policy "Anyone can view videos"
  on public.videos for select
  using (true);

create policy "Admins can insert videos"
  on public.videos for insert
  with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can update videos"
  on public.videos for update
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can delete videos"
  on public.videos for delete
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );


-- ================================================================
-- STEP 7: WEBSITE SETTINGS TABLE
-- ================================================================

create table if not exists public.website_settings (
  id uuid default gen_random_uuid() primary key,
  hero_video text,
  hero_image text,
  login_image text,
  hero_heading text default 'RAW Vision Media',
  hero_subheading text default 'Frames Speak Louder.',
  quote_text text default 'Photography is the story I fail to put into words.',
  instagram text default 'https://instagram.com/rawvisionmedia',
  youtube text default 'https://youtube.com/@rawvisionmedia',
  linkedin text,
  website_email text default 'rawvision@nmims.in',
  contact_number text,
  theme_default text default 'light',
  signup_enabled boolean default true,
  external_users_enabled boolean default true,
  created_at timestamptz default now()
);

alter table public.website_settings enable row level security;

drop policy if exists "Anyone can read settings" on public.website_settings;
drop policy if exists "Admins can update settings" on public.website_settings;

create policy "Anyone can read settings"
  on public.website_settings for select
  using (true);

create policy "Admins can insert settings"
  on public.website_settings for insert
  with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can update settings"
  on public.website_settings for update
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );


-- ================================================================
-- STEP 8: TEAM MEMBERS TABLE
-- ================================================================

create table if not exists public.team_members (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  role text,
  department text,
  photo text,
  year integer,
  type text check (type in ('faculty', 'student_incharge', 'school_head', 'dept_head', 'member', 'alumni')),
  order_index integer default 0,
  created_at timestamptz default now()
);

alter table public.team_members enable row level security;

drop policy if exists "Anyone can view team" on public.team_members;
drop policy if exists "Admins can manage team" on public.team_members;

create policy "Anyone can view team"
  on public.team_members for select
  using (true);

create policy "Admins can insert team"
  on public.team_members for insert
  with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can update team"
  on public.team_members for update
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can delete team"
  on public.team_members for delete
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );


-- ================================================================
-- STEP 9: SEED DEFAULT WEBSITE SETTINGS
-- ================================================================

insert into public.website_settings (
  hero_heading,
  hero_subheading,
  quote_text,
  instagram,
  youtube,
  website_email,
  signup_enabled,
  external_users_enabled
) values (
  'RAW Vision Media',
  'Frames Speak Louder.',
  'Photography is the story I fail to put into words.',
  'https://instagram.com/rawvisionmedia',
  'https://youtube.com/@rawvisionmedia',
  'rawvision@nmims.in',
  true,
  true
);


-- ================================================================
-- STEP 10: SEED SAMPLE EVENTS (optional — delete if not needed)
-- ================================================================

insert into public.events (title, description, event_date, year, cover_image, category, visibility, featured, google_drive_folder) values
(
  'Techfest 2024',
  'Annual technical festival of NMIMS Shirpur featuring competitions, workshops and exhibitions.',
  '2024-03-15',
  2024,
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80',
  'Technical',
  'public',
  true,
  'https://drive.google.com/drive/folders/your-folder-id-here'
),
(
  'Culturals 2024',
  'Celebrating art, dance, music and drama at the cultural festival of NMIMS Shirpur.',
  '2024-02-10',
  2024,
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
  'Cultural',
  'public',
  true,
  'https://drive.google.com/drive/folders/your-folder-id-here'
),
(
  'Sports Meet 2024',
  'Annual inter-college sports meet showcasing athletic talent across disciplines.',
  '2024-01-20',
  2024,
  'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80',
  'Sports',
  'public',
  false,
  'https://drive.google.com/drive/folders/your-folder-id-here'
),
(
  'Photography Workshop',
  'Hands-on photography workshop with professional equipment and expert guidance.',
  '2024-04-05',
  2024,
  'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&q=80',
  'Workshop',
  'public',
  true,
  'https://drive.google.com/drive/folders/your-folder-id-here'
);


-- ================================================================
-- STEP 11: SEED SAMPLE SCRAPBOOK PHOTOS (optional)
-- ================================================================

insert into public.scrapbook (image_url, caption, featured, order_index) values
('https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80', 'Golden Hour Portraits', true, 1),
('https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&q=80', 'Behind the Lens', true, 2),
('https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&q=80', 'Stage Moments', false, 3),
('https://images.unsplash.com/photo-1493863641943-9b68992a8d07?w=600&q=80', 'Candid Campus', true, 4),
('https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600&q=80', 'Motion & Light', false, 5),
('https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80', 'Architecture Frames', true, 6),
('https://images.unsplash.com/photo-1464207687429-7505649dae38?w=600&q=80', 'Fest Energy', false, 7),
('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', 'Creative Compositions', true, 8),
('https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?w=600&q=80', 'Street Photography', false, 9),
('https://images.unsplash.com/photo-1504805572947-34fad45aed93?w=600&q=80', 'Dawn Light', true, 10),
('https://images.unsplash.com/photo-1520549233664-03f65c1d1327?w=600&q=80', 'Sports Action', false, 11),
('https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80', 'Cultural Celebrations', true, 12);


-- ================================================================
-- STEP 12: SEED SAMPLE VIDEOS (optional)
-- ================================================================

insert into public.videos (title, video_url, thumbnail, featured, order_index) values
(
  'Techfest 2024 Aftermovie',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80',
  true,
  1
),
(
  'RAW Vision Reel 2024',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=600&q=80',
  true,
  2
),
(
  'Culturals 2024 Highlights',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80',
  false,
  3
);


-- ================================================================
-- DONE! Verify by running:
-- select table_name from information_schema.tables where table_schema = 'public';
-- ================================================================
