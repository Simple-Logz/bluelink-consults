begin;
select set_config('test.staff_a', gen_random_uuid()::text, true),
       set_config('test.staff_b', gen_random_uuid()::text, true),
       set_config('test.outsider', gen_random_uuid()::text, true),
       set_config('test.unverified', gen_random_uuid()::text, true),
       set_config('test.assessment', gen_random_uuid()::text, true);
insert into auth.users(id, email, email_confirmed_at, aud, role, raw_app_meta_data, raw_user_meta_data)
select current_setting('test.'||kind)::uuid,
  'rollback-test-'||current_setting('test.'||kind)||'@'||case when kind='outsider' then 'example.invalid' else 'bluelinkconsults.com' end,
  case when kind='unverified' then null else now() end,
  'authenticated','authenticated','{}'::jsonb,'{}'::jsonb
from unnest(array['staff_a','staff_b','outsider','unverified']) as kind;
set local role authenticated;
select set_config('request.jwt.claim.sub',current_setting('test.staff_a'),true);
do $$ begin
  if public.bluelink_staff_access() is not true then raise exception 'Verified staff denied'; end if;
end $$;
insert into public.staff_assessments(id,owner_id,module,title,draft)
values(current_setting('test.assessment')::uuid, auth.uid(), 'devops', 'Rollback verification', '{"client":{"company":"Test"}}');
update public.staff_assessments set status='completed', snapshot='{"meta":{"sample":true}}'
where id=current_setting('test.assessment')::uuid;
do $$ begin
  if (select count(*) from public.staff_assessments where id=current_setting('test.assessment')::uuid and status='completed') <> 1 then raise exception 'Owner save/read failed'; end if;
  begin
    update public.staff_assessments set owner_id=current_setting('test.staff_b')::uuid where id=current_setting('test.assessment')::uuid;
    raise exception 'Ownership reassignment was allowed';
  exception when insufficient_privilege then null; end;
end $$;
select set_config('request.jwt.claim.sub',current_setting('test.staff_b'),true);
do $$ declare n integer; begin
  if (select count(*) from public.staff_assessments where id=current_setting('test.assessment')::uuid) <> 0 then raise exception 'Other staff can read owner record'; end if;
  update public.staff_assessments set title='Changed by other staff' where id=current_setting('test.assessment')::uuid;
  get diagnostics n = row_count;
  if n<>0 then raise exception 'Other staff can modify owner record'; end if;
end $$;
select set_config('request.jwt.claim.sub',current_setting('test.outsider'),true);
do $$ begin
  if public.bluelink_staff_access() is not false then raise exception 'Outsider access allowed'; end if;
  if (select count(*) from public.staff_assessments) <> 0 then raise exception 'Outsider can read records'; end if;
  begin
    insert into public.staff_assessments(id,owner_id,module) values(gen_random_uuid(),auth.uid(),'cost');
    raise exception 'Outsider write allowed';
  exception when insufficient_privilege then null; end;
end $$;
select set_config('request.jwt.claim.sub',current_setting('test.unverified'),true);
do $$ begin
  if public.bluelink_staff_access() is not false then raise exception 'Unverified address allowed'; end if;
  begin
    insert into public.staff_assessments(id,owner_id,module) values(gen_random_uuid(),auth.uid(),'cost');
    raise exception 'Unverified write allowed';
  exception when insufficient_privilege then null; end;
end $$;
reset role;
rollback;
select 'PASS: verified staff owner save/read; outsiders, unverified addresses and cross-owner access denied. Test data rolled back.' as result;
