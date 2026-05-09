-- =============================================================================
-- Polina Pastry — Supabase migration
-- Paste this into Supabase Studio → SQL Editor → Run.
-- Safe to re-run: every statement is idempotent (uses IF NOT EXISTS or ON CONFLICT).
-- =============================================================================

-- ── Extensions ───────────────────────────────────────────────────────────────
create extension if not exists "pgcrypto";

-- ── Tables ───────────────────────────────────────────────────────────────────
create table if not exists public.products (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  name          jsonb not null,                                     -- { en, uk, nl, ar }
  description   jsonb not null,                                     -- { en, uk, nl, ar }
  ingredients   jsonb,                                              -- { en, uk, nl, ar } | null
  price         numeric(10, 2) not null check (price >= 0),
  category      text not null check (category in
                  ('cakes','pastries','cookies','bread','seasonal','custom')),
  image         text not null,                                      -- main image URL
  images        text[] not null default '{}',                       -- extra gallery URLs
  featured      boolean not null default false,
  available     boolean not null default true,
  weight        text,
  allergens     text[] not null default '{}'
);

create index if not exists products_category_idx on public.products (category);
create index if not exists products_available_idx on public.products (available);
create index if not exists products_featured_idx on public.products (featured) where featured = true;

create table if not exists public.orders (
  id                uuid primary key default gen_random_uuid(),
  created_at        timestamptz not null default now(),
  customer_name     text not null,
  customer_email    text not null,
  customer_phone    text not null,
  delivery_address  text,
  pickup_date       date,
  items             jsonb not null,                                 -- snapshot of cart
  total             numeric(10, 2) not null check (total >= 0),
  status            text not null default 'pending'
                      check (status in ('pending','confirmed','ready','delivered','cancelled')),
  notes             text,
  stripe_session_id text unique,                                    -- Stripe Checkout Session id
  payment_status    text not null default 'unpaid'
                      check (payment_status in ('unpaid','paid','failed','refunded')),
  paid_at           timestamptz
);

-- For tables that already existed from earlier setup, add the new columns
-- without failing if they're already there.
do $$
begin
  alter table public.orders add column if not exists stripe_session_id text;
  alter table public.orders add column if not exists payment_status text not null default 'unpaid';
  alter table public.orders add column if not exists paid_at timestamptz;
exception when others then null;
end $$;

-- Make stripe_session_id unique so we can use it as the idempotency key.
do $$
begin
  alter table public.orders add constraint orders_stripe_session_id_key unique (stripe_session_id);
exception when duplicate_object then null;
end $$;

create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_status_idx on public.orders (status);
create index if not exists orders_payment_status_idx on public.orders (payment_status);

-- ── Row Level Security ───────────────────────────────────────────────────────
alter table public.products enable row level security;
alter table public.orders   enable row level security;

-- Products: everyone can read, only authenticated (admin) can write.
drop policy if exists "products: public read"          on public.products;
drop policy if exists "products: auth insert"          on public.products;
drop policy if exists "products: auth update"          on public.products;
drop policy if exists "products: auth delete"          on public.products;

create policy "products: public read"
  on public.products for select
  using (true);

create policy "products: auth insert"
  on public.products for insert to authenticated
  with check (true);

create policy "products: auth update"
  on public.products for update to authenticated
  using (true) with check (true);

create policy "products: auth delete"
  on public.products for delete to authenticated
  using (true);

-- Orders: anyone can place an order, only authenticated can read/update/delete.
drop policy if exists "orders: anyone insert"   on public.orders;
drop policy if exists "orders: auth select"     on public.orders;
drop policy if exists "orders: auth update"     on public.orders;
drop policy if exists "orders: auth delete"     on public.orders;

create policy "orders: anyone insert"
  on public.orders for insert
  with check (true);

create policy "orders: auth select"
  on public.orders for select to authenticated
  using (true);

create policy "orders: auth update"
  on public.orders for update to authenticated
  using (true) with check (true);

create policy "orders: auth delete"
  on public.orders for delete to authenticated
  using (true);

-- ── Storage bucket for product images ────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "product-images: public read"     on storage.objects;
drop policy if exists "product-images: auth upload"     on storage.objects;
drop policy if exists "product-images: auth update"     on storage.objects;
drop policy if exists "product-images: auth delete"     on storage.objects;

create policy "product-images: public read"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "product-images: auth upload"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'product-images');

create policy "product-images: auth update"
  on storage.objects for update to authenticated
  using (bucket_id = 'product-images')
  with check (bucket_id = 'product-images');

create policy "product-images: auth delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'product-images');

-- ── Seed products ────────────────────────────────────────────────────────────
-- Only inserts if the table is empty, so re-running won't duplicate rows.
insert into public.products
  (name, description, ingredients, price, category, image, images, featured, available, weight, allergens)
select * from (values

  -- 1. Rose & Raspberry Dream Cake
  (
    '{"en":"Rose & Raspberry Dream Cake","uk":"Торт «Мрія троянди та малини»","nl":"Roos & Framboos Droomtaart","ar":"كعكة حلم الورد والتوت"}'::jsonb,
    '{"en":"Layers of vanilla sponge, raspberry compote, and rosewater cream, topped with edible gold leaf.","uk":"Шари ванільного бісквіта, малинового компоту та вершків з рожевою водою, прикрашені їстівним золотом.","nl":"Lagen vanillespons, frambozenmousse en rozenwater crème, gegarneerd met eetbaar bladgoud.","ar":"طبقات من إسفنج الفانيليا وكومبوت التوت وكريمة ماء الورد، مزينة بورق الذهب."}'::jsonb,
    '{"en":"Free-range eggs, organic flour, fresh cream, butter, vanilla bean, fresh raspberries, raspberry compote, rosewater, edible gold leaf, cane sugar.","uk":"Яйця, органічне борошно, свіжі вершки, масло, ваніль, свіжа малина, малиновий компот, трояндова вода, їстівне сусальне золото, тростинний цукор.","nl":"Scharreleieren, biologische bloem, verse room, boter, vanillestokje, verse frambozen, frambozencompote, rozenwater, eetbaar bladgoud, rietsuiker.","ar":"بيض من الدجاج الطليق، طحين عضوي، كريمة طازجة، زبدة، فانيليا، توت طازج، كومبوت التوت، ماء الورد، ورق الذهب الصالح للأكل، سكر القصب."}'::jsonb,
    58.00, 'cakes',
    'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=900&q=85',
    array[
      'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=900&q=85',
      'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=900&q=85'
    ],
    true, true, '1.2 kg', array['gluten','dairy','eggs']
  ),

  -- 2. Honey Baklava Box
  (
    '{"en":"Honey Baklava Box","uk":"Коробка медової пахлави","nl":"Honing Baklava Doos","ar":"صندوق بقلاوة بالعسل"}'::jsonb,
    '{"en":"Crispy layers of phyllo pastry, roasted pistachios, and golden honey syrup.","uk":"Хрусткі шари тіста філо, смажені фісташки та золотий медовий сироп.","nl":"Krokante lagen filodeeg, geroosterde pistaches en gouden honingstroop.","ar":"طبقات مقرمشة من عجينة الفيلو والفستق المحمص وشراب العسل الذهبي."}'::jsonb,
    '{"en":"Phyllo pastry, roasted pistachios, walnuts, butter, wildflower honey, lemon juice, cinnamon, orange blossom water.","uk":"Тісто філо, смажені фісташки, волоські горіхи, масло, квітковий мед, лимонний сік, кориця, апельсинова цвіткова вода.","nl":"Filodeeg, geroosterde pistaches, walnoten, boter, wildbloemhoning, citroensap, kaneel, oranjebloesemwater.","ar":"عجينة الفيلو، فستق محمص، جوز، زبدة، عسل البرية، عصير ليمون، قرفة، ماء زهر البرتقال."}'::jsonb,
    28.00, 'pastries',
    'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=900&q=85',
    array[
      'https://images.unsplash.com/photo-1606755456206-fbcb74e98f7c?w=900&q=85'
    ],
    true, true, '400 g', array['gluten','nuts']
  ),

  -- 3. Lemon Lavender Tart
  (
    '{"en":"Lemon Lavender Tart","uk":"Тарт з лимоном та лавандою","nl":"Citroen Lavendel Taart","ar":"تارت الليمون واللافندر"}'::jsonb,
    '{"en":"Buttery shortcrust filled with silky lemon curd and a hint of Provençal lavender.","uk":"Масляне пісочне тісто з шовковим лимонним курдом і ноткою лаванди.","nl":"Boterachtige zandkorst gevuld met zijdezachte lemoncurd en een vleugje lavendel.","ar":"عجينة قصيرة زبدانية مملوءة بكرد الليمون الحريري ولمسة من اللافندر."}'::jsonb,
    null,
    34.00, 'pastries',
    'https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?w=900&q=85',
    '{}', false, true, '600 g', array['gluten','dairy','eggs']
  ),

  -- 4. Chocolate Velvet Cake
  (
    '{"en":"Chocolate Velvet Cake","uk":"Оксамитовий шоколадний торт","nl":"Chocolade Fluweeltaart","ar":"كعكة المخمل الشوكولاته"}'::jsonb,
    '{"en":"Dark Belgian chocolate sponge with whipped ganache and a mirror glaze finish.","uk":"Темний бельгійський шоколадний бісквіт з ганашем та дзеркальною глазур''ю.","nl":"Donkere Belgische chocoladespons met opgeklopte ganache en een spiegelglazuurafwerking.","ar":"إسفنج الشوكولاته البلجيكية الداكنة مع الغاناش المخفوق وتشطيب بالمرآة."}'::jsonb,
    '{"en":"Free-range eggs, organic flour, dark Belgian chocolate (70%), butter, fresh cream, cocoa powder, cane sugar, vanilla bean, soy lecithin.","uk":"Яйця, органічне борошно, темний бельгійський шоколад (70%), масло, свіжі вершки, какао-порошок, тростинний цукор, ваніль, соєвий лецитин.","nl":"Scharreleieren, biologische bloem, pure Belgische chocolade (70%), boter, verse room, cacaopoeder, rietsuiker, vanillestokje, sojalecithine.","ar":"بيض، طحين عضوي، شوكولاتة بلجيكية داكنة 70%، زبدة، كريمة طازجة، مسحوق الكاكاو، سكر القصب، فانيليا، ليسيثين الصويا."}'::jsonb,
    62.00, 'cakes',
    'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=900&q=85',
    array[
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=900&q=85'
    ],
    true, true, '1.4 kg', array['gluten','dairy','eggs','soy']
  ),

  -- 5. Pistachio & Orange Blossom Cookies
  (
    '{"en":"Pistachio & Orange Blossom Cookies","uk":"Печиво з фісташками та апельсиновим цвітом","nl":"Pistache & Oranjebloesem Koekjes","ar":"بسكويت الفستق وزهر البرتقال"}'::jsonb,
    '{"en":"Delicate shortbread cookies scented with orange blossom water and crushed pistachios.","uk":"Ніжне пісочне печиво з ароматом апельсинової квіткової води та фісташками.","nl":"Delicate zandkoekjes geparfumeerd met oranjebloesemwater en gemalen pistaches.","ar":"بسكويت سابلي رقيق معطر بماء زهر البرتقال والفستق المطحون."}'::jsonb,
    null,
    16.00, 'cookies',
    'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=900&q=85',
    '{}', false, true, '250 g', array['gluten','dairy','nuts']
  ),

  -- 6. Sourdough Honey Loaf
  (
    '{"en":"Sourdough Honey Loaf","uk":"Медовий хліб на заквасці","nl":"Zuurdesem Honingbrood","ar":"خبز العسل بالخميرة الطبيعية"}'::jsonb,
    '{"en":"Slow-fermented sourdough with a touch of wildflower honey and a perfectly crackled crust.","uk":"Хліб на повільній заквасці з ноткою квіткового меду та хрусткою скоринкою.","nl":"Langzaam gefermenteerd zuurdesem met een vleugje wildbloemhoning en een perfect gebarsten korst.","ar":"خبز المخمر ببطء مع لمسة من عسل البرية وقشرة متشققة بشكل مثالي."}'::jsonb,
    null,
    12.00, 'bread',
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=900&q=85',
    '{}', false, true, '800 g', array['gluten']
  ),

  -- 7. Strawberry Mille-Feuille
  (
    '{"en":"Strawberry Mille-Feuille","uk":"Мільфей з полуницею","nl":"Aardbeien Mille-Feuille","ar":"ميل فيل بالفراولة"}'::jsonb,
    '{"en":"Gossamer layers of puff pastry with vanilla pastry cream and fresh strawberries.","uk":"Тонкі шари листкового тіста з ванільним кремом та свіжою полуницею.","nl":"Dunne laagjes bladerdeeg met vanillecrème en verse aardbeien.","ar":"طبقات رقيقة من معجنات النفخ مع كريمة الفانيليا والفراولة الطازجة."}'::jsonb,
    null,
    38.00, 'pastries',
    'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=900&q=85',
    '{}', true, true, '500 g', array['gluten','dairy','eggs']
  ),

  -- 8. Cardamom Honey Roll
  (
    '{"en":"Cardamom Honey Roll","uk":"Рулет з кардамоном та медом","nl":"Kardemom Honingrol","ar":"لفافة الهيل والعسل"}'::jsonb,
    '{"en":"Soft brioche swirled with aromatic cardamom butter and raw wildflower honey.","uk":"М''який бріош із запашним кардамоновим маслом та натуральним медом.","nl":"Zachte brioche gevuld met aromatische kardemomboter en rauwe bloemhoning.","ar":"بريوش ناعم مع زبدة الهيل العطرية وعسل البرية الطبيعي."}'::jsonb,
    null,
    22.00, 'seasonal',
    'https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=900&q=85',
    '{}', false, true, '350 g', array['gluten','dairy','eggs']
  ),

  -- 9. Ukrainian Paska — from your brief
  (
    '{"en":"Ukrainian Paska","uk":"Українська Паска","nl":"Oekraïense Paska","ar":"باسكا أوكرانية"}'::jsonb,
    '{"en":"Traditional Ukrainian Easter bread, based on egg yolks and made with soft, airy dough — generously filled with three types of raisins, dried apricots, candied fruits and dried cranberries.","uk":"Традиційна українська пасхальна випічка на яєчних жовтках з м''яким, повітряним тістом — щедро наповнена трьома видами родзинок, курагою, цукатами та сушеною журавлиною.","nl":"Traditioneel Oekraïens Paasbrood op basis van eierdooiers, met zacht en luchtig deeg — royaal gevuld met drie soorten rozijnen, gedroogde abrikozen, gekonfijte vruchten en gedroogde cranberries.","ar":"خبز الفصح الأوكراني التقليدي، يعتمد على صفار البيض ويُصنع من عجين طري وهوائي — محشو بسخاء بثلاثة أنواع من الزبيب والمشمش المجفف والفواكه المسكرة والتوت البري المجفف."}'::jsonb,
    '{"en":"Free-range egg yolks, organic flour, fresh milk, butter, cane sugar, fresh yeast, three types of raisins (golden, dark, jumbo), dried apricots, candied citron and orange peel, dried cranberries, vanilla, lemon zest, salt.","uk":"Жовтки яєць від курей вільного вигулу, органічне борошно, свіже молоко, масло, тростинний цукор, свіжі дріжджі, три види родзинок (золоті, темні, джамбо), курага, цукати з цедри лимона та апельсина, сушена журавлина, ваніль, цедра лимона, сіль.","nl":"Scharrel-eierdooiers, biologische bloem, verse melk, boter, rietsuiker, verse gist, drie soorten rozijnen (gouden, donkere, jumbo), gedroogde abrikozen, gekonfijte sukade en sinaasappelschil, gedroogde cranberries, vanille, citroenrasp, zout.","ar":"صفار بيض من الدجاج الطليق، طحين عضوي، حليب طازج، زبدة، سكر قصب، خميرة طازجة، ثلاثة أنواع من الزبيب (ذهبي، داكن، جامبو)، مشمش مجفف، قشر الليمون والبرتقال المسكر، توت بري مجفف، فانيليا، قشر ليمون، ملح."}'::jsonb,
    18.00, 'seasonal',
    'https://images.unsplash.com/photo-1568471173242-461f0a730452?w=900&q=85',
    '{}', true, true, '700 g', array['gluten','dairy','eggs']
  )

) as seed (name, description, ingredients, price, category, image, images, featured, available, weight, allergens)
where not exists (select 1 from public.products);
