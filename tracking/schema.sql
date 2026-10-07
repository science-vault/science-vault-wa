-- Run once in a new Supabase project SQL editor. No student records belong in GitHub.
begin;
create table public.lv_profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 display_name text not null check(length(display_name) between 1 and 80),
 role text not null default 'student' check(role in ('student','teacher'))
);
create table public.lv_classes (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null references public.lv_profiles(id),
 name text not null check(length(name) between 1 and 100),
 join_code text not null unique default replace(gen_random_uuid()::text,'-',''),
 created_at timestamptz not null default now()
);
create table public.lv_members (
 class_id uuid not null references public.lv_classes(id) on delete cascade,
 student_id uuid not null references public.lv_profiles(id) on delete cascade,
 joined_at timestamptz not null default now(), primary key(class_id,student_id)
);
create table public.lv_progress (
 student_id uuid not null references public.lv_profiles(id) on delete cascade,
 module_key text not null check(length(module_key) between 1 and 250),
 module_title text not null check(length(module_title) between 1 and 250),
 course text not null check(length(course) between 1 and 150),
 screen_title text not null check(length(screen_title)<=250),
 total_screens integer not null check(total_screens between 1 and 1000),
 visited integer[] not null default '{}',
 best_score integer, latest_score integer,
 attempts integer not null default 0,
 last_activity timestamptz not null default now(),
 primary key(student_id,module_key)
);
create table public.lv_attempts (
 id uuid primary key,
 student_id uuid not null references public.lv_profiles(id) on delete cascade,
 module_key text not null,
 score integer not null check(score between 0 and 100),
 created_at timestamptz not null default now()
);
create function public.lv_new_user() returns trigger language plpgsql security definer set search_path='' as $$
begin
 insert into public.lv_profiles(id,display_name) values(new.id,left(coalesce(nullif(trim(new.raw_user_meta_data->>'display_name'),''),'Student'),80));
 return new;
end $$;
create trigger lv_new_user after insert on auth.users for each row execute function public.lv_new_user();
-- Backfill only if accounts existed before installation.
insert into public.lv_profiles(id,display_name) select id,left(coalesce(nullif(trim(raw_user_meta_data->>'display_name'),''),'Student'),80) from auth.users on conflict do nothing;
create function public.lv_can_view_student(target uuid) returns boolean language sql stable security definer set search_path='' as $$
 select target=auth.uid() or exists(select 1 from public.lv_members m join public.lv_classes c on c.id=m.class_id where m.student_id=target and c.owner_id=auth.uid());
$$;
alter table public.lv_profiles enable row level security;
alter table public.lv_classes enable row level security;
alter table public.lv_members enable row level security;
alter table public.lv_progress enable row level security;
alter table public.lv_attempts enable row level security;
create policy profiles_read on public.lv_profiles for select to authenticated using(public.lv_can_view_student(id));
create policy classes_read on public.lv_classes for select to authenticated using(owner_id=auth.uid() or exists(select 1 from public.lv_members m where m.class_id=id and m.student_id=auth.uid()));
-- No recursive class/member policy: helper performs owner lookup with definer privileges.
create function public.lv_owns_class(target uuid) returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.lv_classes where id=target and owner_id=auth.uid());
$$;
create policy members_read on public.lv_members for select to authenticated using(student_id=auth.uid() or public.lv_owns_class(class_id));
create policy progress_read on public.lv_progress for select to authenticated using(public.lv_can_view_student(student_id));
create policy attempts_read on public.lv_attempts for select to authenticated using(public.lv_can_view_student(student_id));
-- Mutations only through scoped RPCs. A browser cannot promote its own role.
revoke all on public.lv_profiles,public.lv_classes,public.lv_members,public.lv_progress,public.lv_attempts from anon,authenticated;
grant select on public.lv_profiles,public.lv_classes,public.lv_members,public.lv_progress,public.lv_attempts to authenticated;
create function public.lv_create_class(class_name text) returns public.lv_classes language plpgsql security definer set search_path='' as $$
declare result public.lv_classes;
begin
 if not exists(select 1 from public.lv_profiles where id=auth.uid() and role='teacher') then raise exception 'Approved teacher account required'; end if;
 insert into public.lv_classes(owner_id,name) values(auth.uid(),trim(class_name)) returning * into result;
 return result;
end $$;
create function public.lv_join_class(code text) returns text language plpgsql security definer set search_path='' as $$
declare target public.lv_classes;
begin
 if not exists(select 1 from public.lv_profiles where id=auth.uid() and role='student') then raise exception 'Student account required'; end if;
 select * into target from public.lv_classes where join_code=lower(trim(code));
 if target.id is null then raise exception 'Class code not found'; end if;
 insert into public.lv_members(class_id,student_id) values(target.id,auth.uid()) on conflict do nothing;
 return target.name;
end $$;
create function public.lv_record_activity(p_key text,p_title text,p_course text,p_screen text,p_total integer,p_visited integer[],p_score integer default null,p_attempt uuid default null) returns void language plpgsql security definer set search_path='' as $$
declare added integer:=0;
begin
 if not exists(select 1 from public.lv_profiles where id=auth.uid() and role='student') then raise exception 'Student account required'; end if;
 if p_total not between 1 and 1000 or cardinality(p_visited)>1000 or exists(select 1 from unnest(p_visited) i where i<1 or i>p_total) then raise exception 'Invalid screens'; end if;
 if p_score is not null then
  if p_attempt is null or p_score not between 0 and 100 then raise exception 'Invalid attempt'; end if;
  insert into public.lv_attempts(id,student_id,module_key,score) values(p_attempt,auth.uid(),p_key,p_score) on conflict do nothing;
  get diagnostics added = row_count;
 end if;
 insert into public.lv_progress(student_id,module_key,module_title,course,screen_title,total_screens,visited,best_score,latest_score,attempts)
 values(auth.uid(),p_key,p_title,p_course,p_screen,p_total,array(select distinct i from unnest(p_visited) i order by i),case when added=1 then p_score end,case when added=1 then p_score end,added)
 on conflict(student_id,module_key) do update set
 module_title=excluded.module_title,course=excluded.course,screen_title=excluded.screen_title,total_screens=excluded.total_screens,
 visited=array(select distinct i from unnest(public.lv_progress.visited||excluded.visited) i where i between 1 and excluded.total_screens order by i),
 best_score=greatest(public.lv_progress.best_score,excluded.best_score),
 latest_score=case when added=1 then p_score else public.lv_progress.latest_score end,
 attempts=public.lv_progress.attempts+added,last_activity=now();
end $$;
revoke all on function public.lv_new_user() from public;
revoke all on function public.lv_can_view_student(uuid),public.lv_owns_class(uuid),public.lv_create_class(text),public.lv_join_class(text),public.lv_record_activity(text,text,text,text,integer,integer[],integer,uuid) from public;
grant execute on function public.lv_can_view_student(uuid),public.lv_owns_class(uuid),public.lv_create_class(text),public.lv_join_class(text),public.lv_record_activity(text,text,text,text,integer,integer[],integer,uuid) to authenticated;
create index lv_members_student_idx on public.lv_members(student_id);
commit;
-- Approve a teacher from the SQL editor after they register (replace exact email):
-- update public.lv_profiles set role='teacher' where id=(select id from auth.users where email='TEACHER_EMAIL');
