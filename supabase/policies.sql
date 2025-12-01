-- ---------- SECURITY POLICIES ----------

alter table reports enable row level security;
alter table items enable row level security;
alter table categories enable row level security;
alter table subcategories enable row level security;

create policy "inspectors can insert reports"
  on reports for insert
  using (auth.uid() is not null);

create policy "inspectors can read reports"
  on reports for select
  using (auth.uid() = inspector_id);
