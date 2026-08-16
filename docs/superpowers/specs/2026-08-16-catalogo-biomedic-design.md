# Catálogo Digital BioMedic — Especificação de design

Data: 16 de agosto de 2026  
Status: aprovado para planejamento  
Marca: BioMedic — Farmácia de Manipulação

## 1. Objetivo e limites

O produto será um catálogo técnico para médicos, nutricionistas, farmacêuticos e parceiros consultarem rapidamente os ativos e produtos disponíveis para manipulação. A consulta pública não exigirá conta. Administradores autorizados terão um painel protegido para gerenciar itens, categorias, status e imagens.

O sistema não terá preço, carrinho, pagamento, pedidos, orçamento online, prescrição, favoritos, avaliações, comentários, cadastro público ou página individual de item. Os cards não serão links e exibirão toda a informação necessária.

## 2. Entrega inicial

O projeto será criado do zero com Next.js, TypeScript, React, Tailwind CSS, shadcn/ui e uma integração preparada para Supabase. Como ainda não existe um projeto Supabase, a aplicação iniciará em modo demonstrativo completo.

No modo demonstrativo:

- haverá login administrativo com credenciais explicitamente identificadas como demonstração;
- catálogo, categorias e sessão serão persistidos no navegador;
- imagens otimizadas serão persistidas em IndexedDB, evitando o limite reduzido do `localStorage`;
- o CRUD administrativo será funcional;
- uma ação protegida por confirmação restaurará os dados iniciais;
- a interface mostrará um aviso discreto apenas no painel administrativo;
- o catálogo público não indicará que está usando dados locais.

Credenciais propostas para o seed local:

- E-mail: `admin@biomedic.demo`
- Senha: `BioMedic@2026`

Essas credenciais existem somente no adaptador de demonstração e nunca serão usadas no modo Supabase.

## 3. Arquitetura

A aplicação utilizará Next.js App Router. Páginas e componentes consumirão contratos tipados de serviços, sem conhecer a fonte concreta dos dados. Dois adaptadores implementarão os mesmos contratos:

1. `DemoCatalogRepository`, `DemoCategoryRepository`, `DemoAuthRepository` e `DemoImageRepository` para persistência no navegador.
2. Adaptadores Supabase para Auth, PostgreSQL e Storage.

A escolha será feita por configuração de ambiente. Conectar o Supabase trocará os adaptadores, não as páginas nem os componentes.

As unidades principais serão:

- camada de apresentação: páginas, layouts e componentes visuais;
- camada de aplicação: casos de uso de busca, CRUD, autenticação, upload e restauração;
- camada de domínio: tipos, schemas de validação, normalização, filtros e regras;
- camada de infraestrutura: demo local e Supabase;
- banco e segurança: migrations, seeds, funções, índices, bucket e RLS.

Componentes visuais receberão dados e callbacks tipados. Regras de negócio não ficarão espalhadas por componentes React.

## 4. Rotas e páginas

### Área pública

- `/`: homepage com header, hero, busca principal, destaques do catálogo, seção institucional, contato e footer.
- `/catalogo`: catálogo completo com busca, filtros, ordenação, contagem, paginação progressiva e estados de carregamento/erro/vazio.

Os links do menu `Catálogo`, `Sobre a BioMedic` e `Contato` apontarão respectivamente para `/catalogo`, `/#sobre` e `/#contato`. `Área Administrativa` será um link discreto para `/admin`.

### Área administrativa

- `/admin/login`: login, credenciais de demonstração e feedback de erro.
- `/admin`: dashboard com totais, distribuição por tipo, categorias, itens ativos e últimas inclusões.
- `/admin/catalogo`: tabela de itens, busca administrativa, filtros e ações.
- `/admin/catalogo/novo`: criação de item.
- `/admin/catalogo/[id]/editar`: edição de item.
- `/admin/categorias`: criação, edição e exclusão de categorias.

Rotas administrativas, exceto login, exigirão sessão válida e perfil com papel `admin` no modo Supabase. No modo demo, exigirão a sessão local equivalente.

## 5. Direção visual

A interface será profissional, clara e específica para uma farmácia de manipulação. A marca fornecida pelo cliente será usada no header, footer, login e painel.

A paleta inicial será derivada da logo:

- azul-ciano BioMedic como cor de ação e foco;
- azul profundo como cor de títulos, navegação e contraste;
- branco e cinzas frios como superfícies;
- verde discreto apenas para estados positivos;
- vermelho reservado a erros e exclusões.

As cores serão tokens semânticos, permitindo futura troca da identidade sem reescrever componentes. A tipografia será limpa, com hierarquia forte, bastante espaço em branco, bordas suaves e sombras discretas. Animações serão curtas e respeitarão `prefers-reduced-motion`.

A imagem com bandeiras de pagamento não será utilizada, pois a plataforma não terá comportamento comercial.

## 6. Experiência pública

### Homepage

O hero exibirá:

- a identificação `Catálogo técnico BioMedic`;
- o título `Encontre o ativo que procura`;
- texto curto de apoio;
- barra de pesquisa em destaque;
- alguns itens de demonstração como destaques;
- acesso explícito ao catálogo completo.

Ao pesquisar no hero, o usuário será levado a `/catalogo?q=<termo>` com a consulta já aplicada.

### Catálogo

A busca consultará nome, tipo, categoria, descrição e palavras-chave. A normalização removerá diferenças de caixa e acentos, de modo que `magnesio` encontre `Magnésio`. O debounce será curto, inicialmente 250 ms.

Filtros:

- tipo: todos, ativos e produtos;
- categoria: valores vindos do repositório;
- ordenação: nome A–Z, nome Z–A e mais recentes.

A ordenação padrão será A–Z. Busca e filtros serão refletidos na URL. O catálogo exibirá 24 itens por lote e permitirá carregar o lote seguinte. No demo, as operações ocorrerão localmente; com Supabase, serão executadas no banco pelo mesmo contrato de consulta.

No desktop, o grid terá até quatro colunas. No tablet, duas ou três. No celular, uma ou duas conforme a largura disponível. Filtros móveis abrirão em Sheet. A busca permanecerá visível e prioritária.

Cada card exibirá imagem consistente, badge `Ativo` ou `Produto`, nome, categoria e descrição curta. As até três primeiras palavras-chave serão exibidas como tags somente no desktop; no mobile serão ocultadas para preservar a leitura. Não haverá botão, link, preço nem affordance de compra. O hover será apenas visual.

## 7. Painel administrativo

O layout terá sidebar no desktop e navegação adaptada no mobile. O dashboard apresentará total de itens, ativos, produtos, categorias, itens habilitados e últimas inclusões.

A tabela do catálogo terá imagem, nome, tipo, categoria, status, criação e ações. Busca e filtros administrativos não carregarão dados públicos desnecessários.

O formulário de item terá:

- nome obrigatório;
- tipo obrigatório;
- categoria obrigatória;
- descrição curta obrigatória, limitada a 320 caracteres para preservar o card;
- até 20 palavras-chave, com no máximo 40 caracteres cada, como lista editável;
- imagem opcional com preview, troca e remoção;
- status ativo/inativo.

O formulário de categoria terá nome obrigatório e slug gerado automaticamente. Slugs serão normalizados e únicos.

Exclusões exigirão diálogo com o nome do alvo e aviso de irreversibilidade. Categorias em uso não poderão ser excluídas; a interface explicará quais itens precisam ser movidos antes. Ativar e desativar será uma ação reversível com feedback imediato.

## 8. Modelo de dados

### Tipos PostgreSQL

- `app_role`: `admin`
- `catalog_item_type`: `active`, `product`

### `profiles`

- `id uuid primary key references auth.users(id) on delete cascade`
- `email text not null`
- `name text not null`
- `role app_role not null default 'admin'`
- `created_at timestamptz not null default now()`

Não haverá criação pública de perfis administrativos. O primeiro administrador será criado por procedimento documentado no Supabase Dashboard/SQL, após a criação do usuário no Auth.

### `categories`

- `id uuid primary key default gen_random_uuid()`
- `name text not null`
- `slug text not null unique`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

### `catalog_items`

- `id uuid primary key default gen_random_uuid()`
- `name text not null`
- `slug text not null unique`
- `type catalog_item_type not null`
- `category_id uuid not null references categories(id) on delete restrict`
- `short_description text not null`
- `keywords text[] not null default '{}'`
- `search_document text not null`
- `image_path text`
- `active boolean not null default true`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

`search_document` conterá a versão normalizada de nome, tipo, categoria, descrição e palavras-chave. Funções e triggers versionados atualizarão o documento ao alterar um item e recalcularão os itens relacionados quando o nome de uma categoria mudar. O adaptador demo aplicará a mesma função de normalização.

Índices:

- GIN trigram em `search_document`;
- B-tree em `active`, `type`, `category_id`, `name` e `created_at`;
- índices compostos coerentes com consultas públicas, começando por `active`.

## 9. Supabase Storage e imagens

O bucket será `catalog-images`. Leitura será pública para permitir a exibição eficiente do catálogo. Upload, substituição e exclusão exigirão administrador.

O frontend aceitará PNG, JPEG e WebP de até 5 MB, validará tamanho e tipo e mostrará preview. No demo, a imagem será redimensionada para no máximo 1.600 × 1.600 px e convertida para WebP antes de entrar no IndexedDB. No Supabase, o caminho do arquivo será armazenado, não uma URL absoluta. Na substituição, o novo arquivo será enviado e confirmado antes da remoção do anterior. Se a atualização do registro falhar, o novo arquivo órfão será removido quando possível e o erro será informado.

Sem imagem, o card usará um placeholder BioMedic consistente e acessível.

## 10. Autenticação, autorização e RLS

Supabase Auth cuidará da sessão em produção. Middleware protegerá `/admin`, mas a segurança não dependerá dele.

Uma função segura `is_admin()` verificará o perfil do usuário autenticado. As políticas RLS serão:

- `catalog_items`: leitura anônima/autenticada somente quando `active = true`; administradores podem ler todos e executar insert, update e delete;
- `categories`: leitura pública; administradores podem executar insert, update e delete;
- `profiles`: o usuário autenticado pode ler o próprio perfil; operações de administração não serão abertas ao cliente;
- `storage.objects` no bucket `catalog-images`: leitura pública e escrita/exclusão apenas para administradores.

O sistema não terá cadastro público. Documentação operacional explicará como criar usuários administrativos no Supabase.

## 11. Contato e conteúdo institucional

Dados oficiais fornecidos:

- Telefone: (41) 3014-5765
- WhatsApp: (41) 99894-2185
- WhatsApp: (41) 99964-0217
- Atendimento: segunda a sexta, das 08:30 às 18:30; sábado, das 09:00 às 13:00
- Endereço: Alameda Cabral, 60 — Centro, Curitiba — PR, 80410-210

Os telefones e WhatsApps serão links acessíveis (`tel:` e `wa.me`). O endereço abrirá uma busca do Google Maps em nova aba, com indicação acessível desse comportamento e sem mapa incorporado.

Texto institucional inicial: `A BioMedic é uma farmácia de manipulação em Curitiba dedicada a oferecer atendimento próximo e soluções personalizadas para profissionais da saúde e seus pacientes.` Esse conteúdo ficará centralizado em um arquivo de configuração para futura revisão institucional.

## 12. Estados, erros e acessibilidade

Haverá:

- skeletons para catálogo, dashboard e tabelas;
- empty state para catálogo vazio, busca sem resultado e ausência de dados administrativos;
- retry para falhas de leitura;
- erros por campo e resumo acessível nos formulários;
- toasts para sucesso e falha;
- erro isolado para a área administrativa;
- redirecionamento ao login quando a sessão expirar;
- confirmação para exclusões e restauração do seed;
- foco visível, labels explícitos, navegação por teclado, contraste adequado e anúncios por região `aria-live`.

Operações otimistas serão usadas apenas quando a reversão for segura. Exclusões e uploads aguardarão confirmação do repositório.

## 13. Componentes e limites

Principais componentes públicos:

- `Header`, `Footer`, `HeroSearch`
- `SearchBar`, `CatalogFilters`, `CategoryFilter`, `SortSelect`
- `CatalogCard`, `CatalogGrid`, `CatalogResultsSummary`
- `CatalogSkeleton`, `EmptyState`, `ErrorState`, `LoadMoreButton`

Principais componentes administrativos:

- `AdminSidebar`, `AdminHeader`, `DemoModeNotice`
- `DashboardStats`, `RecentItems`
- `CatalogTable`, `CatalogRowActions`, `StatusBadge`
- `CatalogForm`, `CategoryForm`, `KeywordsInput`, `ImageUploader`
- `DeleteConfirmationDialog`, `RestoreDemoDialog`

Formulários compartilharão schemas de validação. Componentes de tabela e card não executarão consultas diretamente. Arquivos serão mantidos pequenos e orientados a uma responsabilidade.

## 14. SEO e performance

Metadata inicial:

- título: `Catálogo de Ativos | BioMedic Farmácia de Manipulação`
- descrição: `Consulte produtos e ativos disponíveis na BioMedic Farmácia de Manipulação.`

A homepage terá metadata e Open Graph básicos. O catálogo utilizará HTML semântico. A área administrativa não será indexável.

Imagens usarão tamanhos responsivos e lazy loading fora da primeira dobra. Arquivos do Supabase serão liberados no `next/image` por um padrão remoto restrito ao host configurado; imagens do demo usarão URLs de objeto locais. Consultas evitarão selecionar colunas administrativas sem necessidade. Debounce, índices e paginação permitirão crescimento para milhares de registros.

## 15. Dados de demonstração

O seed terá 18 itens distribuídos entre ativos e produtos e 13 categorias: Vitaminas, Minerais, Metabolismo, Saúde intestinal, Esporte, Performance, Sono, Imunidade, Saúde feminina, Saúde masculina, Antioxidantes, Fitoterápicos e Outros.

Itens obrigatórios no seed: Berberina, Coenzima Q10, Magnésio Bisglicinato, Melatonina, Vitamina D3 e Creatina. Parte dos itens terá imagem e ao menos um item ficará inativo para demonstrar o comportamento administrativo.

Seeds locais e SQL serão isolados e removíveis, sem se misturar a migrations estruturais.

## 16. Verificação e critérios de aceite

Testes unitários cobrirão:

- normalização sem acentos e sem diferenciação de caixa;
- combinação de busca, filtros e ordenação;
- paginação;
- geração de slug;
- validação dos formulários;
- contratos e comportamento dos adaptadores demo;
- restauração de seed e persistência após recarga.

Testes de componentes cobrirão cards estáticos, filtros, estados vazios/erro, formulários, diálogos e feedback acessível.

Testes end-to-end no modo demo cobrirão:

1. pesquisa por `magnesio` encontrando `Magnésio`;
2. filtros por tipo e categoria;
3. login administrativo;
4. criação, edição e persistência de item;
5. ativação e desativação refletida no catálogo público;
6. exclusão de item;
7. bloqueio de exclusão de categoria em uso;
8. upload, troca e remoção de imagem;
9. restauração do seed;
10. responsividade dos fluxos essenciais.

Antes da entrega serão executados lint, verificação TypeScript, testes e build de produção. Também serão revisados acessibilidade básica, loading, erros, empty states, autenticação, autorização, migrations e políticas RLS. Quando um projeto Supabase existir, os testes de integração e a verificação real das políticas serão executados nesse ambiente antes de produção.

## 17. Fora do escopo desta entrega

- criação ou custeio de uma conta/projeto Supabase;
- deploy em produção e configuração de domínio;
- identidade visual completa além da logo e tokens derivados;
- criação de texto institucional jurídico ou regulatório;
- e-commerce, pagamentos ou pedidos;
- cadastro público de usuários;
- páginas individuais de itens.

Esses limites não impedem que o projeto seja executado localmente e demonstrado integralmente.
