-- ---------- INITIAL DATA ----------

insert into houses (name, slug) values
('Casa Carmela', 'casa-carmela'),
('Casa Paloma', 'casa-paloma');

insert into categories (house_id, name)
select id, 'General' from houses;

insert into subcategories (category_id, name)
select id, 'Living Room' from categories;

insert into items (subcategory_id, name, severity)
select id, 'Check Lights', 1 from subcategories;
