insert into public.categories (id, name, slug, created_at, updated_at) values
('00000000-0000-4000-8000-000000000001','Vitaminas','vitaminas','2026-01-10T12:00:00Z','2026-01-10T12:00:00Z'),
('00000000-0000-4000-8000-000000000002','Minerais','minerais','2026-01-10T12:00:00Z','2026-01-10T12:00:00Z'),
('00000000-0000-4000-8000-000000000003','Metabolismo','metabolismo','2026-01-10T12:00:00Z','2026-01-10T12:00:00Z'),
('00000000-0000-4000-8000-000000000004','Saúde intestinal','saude-intestinal','2026-01-10T12:00:00Z','2026-01-10T12:00:00Z'),
('00000000-0000-4000-8000-000000000005','Esporte','esporte','2026-01-10T12:00:00Z','2026-01-10T12:00:00Z'),
('00000000-0000-4000-8000-000000000006','Performance','performance','2026-01-10T12:00:00Z','2026-01-10T12:00:00Z'),
('00000000-0000-4000-8000-000000000007','Sono','sono','2026-01-10T12:00:00Z','2026-01-10T12:00:00Z'),
('00000000-0000-4000-8000-000000000008','Imunidade','imunidade','2026-01-10T12:00:00Z','2026-01-10T12:00:00Z'),
('00000000-0000-4000-8000-000000000009','Saúde feminina','saude-feminina','2026-01-10T12:00:00Z','2026-01-10T12:00:00Z'),
('00000000-0000-4000-8000-000000000010','Saúde masculina','saude-masculina','2026-01-10T12:00:00Z','2026-01-10T12:00:00Z'),
('00000000-0000-4000-8000-000000000011','Antioxidantes','antioxidantes','2026-01-10T12:00:00Z','2026-01-10T12:00:00Z'),
('00000000-0000-4000-8000-000000000012','Fitoterápicos','fitoterapicos','2026-01-10T12:00:00Z','2026-01-10T12:00:00Z'),
('00000000-0000-4000-8000-000000000013','Outros','outros','2026-01-10T12:00:00Z','2026-01-10T12:00:00Z')
on conflict (id) do update set name=excluded.name, slug=excluded.slug, updated_at=excluded.updated_at;

insert into public.catalog_items
(id,name,slug,category_id,short_description,keywords,image_path,active,created_at,updated_at) values
('10000000-0000-4000-8000-000000000001','Berberina','berberina','00000000-0000-4000-8000-000000000003','Item disponível para formulações manipuladas voltadas ao metabolismo.',array['metabolismo','fitoterápico'],'/brand/catalog-placeholder.svg',true,'2026-01-11T12:00:00Z','2026-01-11T12:00:00Z'),
('10000000-0000-4000-8000-000000000002','Coenzima Q10','coenzima-q10','00000000-0000-4000-8000-000000000011','Antioxidante disponível para formulações personalizadas.',array['coq10','energia','antioxidante'],'/brand/catalog-placeholder.svg',true,'2026-01-12T12:00:00Z','2026-01-12T12:00:00Z'),
('10000000-0000-4000-8000-000000000003','Magnésio Bisglicinato','magnesio-bisglicinato','00000000-0000-4000-8000-000000000002','Mineral disponível para formulações manipuladas.',array['magnésio','sono','relaxamento','mineral'],'/brand/catalog-placeholder.svg',true,'2026-01-13T12:00:00Z','2026-01-13T12:00:00Z'),
('10000000-0000-4000-8000-000000000004','Melatonina','melatonina','00000000-0000-4000-8000-000000000007','Item disponível para formulações personalizadas relacionadas ao sono.',array['sono','ritmo circadiano'],'/brand/catalog-placeholder.svg',true,'2026-01-14T12:00:00Z','2026-01-14T12:00:00Z'),
('10000000-0000-4000-8000-000000000005','Vitamina D3','vitamina-d3','00000000-0000-4000-8000-000000000001','Vitamina disponível para diferentes apresentações manipuladas.',array['vitamina d','colecalciferol','imunidade'],'/brand/catalog-placeholder.svg',true,'2026-01-15T12:00:00Z','2026-01-15T12:00:00Z'),
('10000000-0000-4000-8000-000000000006','Creatina','creatina','00000000-0000-4000-8000-000000000006','Item disponível para formulações voltadas à rotina esportiva.',array['esporte','força','performance'],'/brand/catalog-placeholder.svg',true,'2026-01-16T12:00:00Z','2026-01-16T12:00:00Z'),
('10000000-0000-4000-8000-000000000007','Ashwagandha','ashwagandha','00000000-0000-4000-8000-000000000012','Extrato vegetal disponível para formulações manipuladas.',array['withania somnifera','adaptógeno'],null,true,'2026-01-17T12:00:00Z','2026-01-17T12:00:00Z'),
('10000000-0000-4000-8000-000000000008','Zinco Quelado','zinco-quelado','00000000-0000-4000-8000-000000000002','Mineral quelado disponível para formulações personalizadas.',array['zinco','mineral','imunidade'],null,true,'2026-01-18T12:00:00Z','2026-01-18T12:00:00Z'),
('10000000-0000-4000-8000-000000000009','L-Glutamina','l-glutamina','00000000-0000-4000-8000-000000000004','Aminoácido disponível para formulações manipuladas.',array['glutamina','aminoácido','intestino'],null,true,'2026-01-19T12:00:00Z','2026-01-19T12:00:00Z'),
('10000000-0000-4000-8000-000000000010','N-Acetilcisteína','n-acetilcisteina','00000000-0000-4000-8000-000000000011','Item antioxidante disponível para formulações personalizadas.',array['nac','cisteína','antioxidante'],null,true,'2026-01-20T12:00:00Z','2026-01-20T12:00:00Z'),
('10000000-0000-4000-8000-000000000011','D-Manose','d-manose','00000000-0000-4000-8000-000000000009','Item disponível para formulações voltadas à saúde feminina.',array['d-manose','saúde feminina'],null,true,'2026-01-21T12:00:00Z','2026-01-21T12:00:00Z'),
('10000000-0000-4000-8000-000000000012','Saw Palmetto','saw-palmetto','00000000-0000-4000-8000-000000000010','Extrato vegetal disponível para formulações voltadas à saúde masculina.',array['serenoa repens','fitoterápico'],null,true,'2026-01-22T12:00:00Z','2026-01-22T12:00:00Z'),
('10000000-0000-4000-8000-000000000013','Curcumina','curcumina','00000000-0000-4000-8000-000000000012','Item vegetal cadastrado para demonstração administrativa.',array['cúrcuma','antioxidante'],null,false,'2026-01-23T12:00:00Z','2026-01-23T12:00:00Z'),
('10000000-0000-4000-8000-000000000014','Beta-Alanina','beta-alanina','00000000-0000-4000-8000-000000000005','Aminoácido disponível para formulações esportivas.',array['beta alanina','esporte','performance'],null,true,'2026-01-24T12:00:00Z','2026-01-24T12:00:00Z'),
('10000000-0000-4000-8000-000000000015','Complexo B','complexo-b','00000000-0000-4000-8000-000000000001','Item de demonstração com vitaminas do complexo B.',array['vitaminas b','complexo vitamínico'],null,true,'2026-01-25T12:00:00Z','2026-01-25T12:00:00Z'),
('10000000-0000-4000-8000-000000000016','Probiótico 10 Bilhões','probiotico-10-bilhoes','00000000-0000-4000-8000-000000000004','Item de demonstração para apresentações manipuladas.',array['probiótico','microbiota','intestino'],null,true,'2026-01-26T12:00:00Z','2026-01-26T12:00:00Z'),
('10000000-0000-4000-8000-000000000017','Fórmula Imunidade','formula-imunidade','00000000-0000-4000-8000-000000000008','Item demonstrativo cadastrado na categoria Imunidade.',array['imunidade','vitaminas','minerais'],null,true,'2026-01-27T12:00:00Z','2026-01-27T12:00:00Z'),
('10000000-0000-4000-8000-000000000018','Recovery Performance','recovery-performance','00000000-0000-4000-8000-000000000006','Item demonstrativo para a categoria Performance.',array['recuperação','esporte','performance'],null,true,'2026-01-28T12:00:00Z','2026-01-28T12:00:00Z')
on conflict (id) do update set name=excluded.name,slug=excluded.slug,category_id=excluded.category_id,short_description=excluded.short_description,keywords=excluded.keywords,image_path=excluded.image_path,active=excluded.active,updated_at=excluded.updated_at;
