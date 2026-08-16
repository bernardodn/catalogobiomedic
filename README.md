# Catálogo Digital BioMedic

Catálogo técnico responsivo para consulta pública de ativos e produtos da BioMedic Farmácia de Manipulação, com painel administrativo para conteúdo, categorias e imagens. O projeto não inclui preços, carrinho, compra ou páginas individuais de produto.

## Requisitos

- Node.js 22 ou superior
- npm
- Chromium do Playwright apenas para os testes E2E
- Docker Desktop apenas se for validar o Supabase localmente

## Executar em demonstração

```bash
npm install
cp .env.example .env.local
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000). O modo `demo` é o padrão e não depende de servidor ou banco externo.

Credenciais administrativas:

```text
E-mail: admin@biomedic.demo
Senha:  BioMedic@2026
```

Cadastros ficam no `localStorage` do navegador e imagens no IndexedDB. Em **Administração → Categorias → Dados de demonstração**, é possível restaurar os 18 itens e 13 categorias iniciais sem encerrar a sessão.

## Comandos de qualidade

```bash
npm run lint
npm run typecheck
npm test
npx playwright install chromium
npm run test:e2e
npm run build
```

Se o download do Chromium estiver indisponível no macOS e o Google Chrome já estiver instalado, use `PLAYWRIGHT_USE_LOCAL_CHROME=1 npm run test:e2e`.

## Usar Supabase

Configure `.env.local`:

```dotenv
NEXT_PUBLIC_DATA_MODE=supabase
NEXT_PUBLIC_SITE_URL=https://seu-dominio.com.br
NEXT_PUBLIC_SUPABASE_URL=https://SEU_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=SUA_CHAVE_PUBLICAVEL
```

Depois associe o projeto e aplique a migration:

```bash
npx supabase login
npx supabase link --project-ref SEU_PROJECT_REF
npx supabase db push
```

O procedimento completo de administrador, seed, Storage e matriz manual de RLS está em [docs/supabase-setup.md](docs/supabase-setup.md). Nunca exponha uma chave `service_role` em variáveis `NEXT_PUBLIC_*`.

## Imagens

- Formatos aceitos: PNG, JPEG e WebP.
- Limite: 5 MB.
- Otimização: WebP, até 1.600 × 1.600 px.
- Sem imagem: placeholder institucional BioMedic.

## Conteúdo institucional

- Telefone: (41) 3014-5765
- WhatsApp: (41) 99894-2185 e (41) 99964-0217
- Atendimento: segunda a sexta, 08:30–18:30; sábado, 09:00–13:00
- Endereço: Alameda Cabral, 60 — Centro, Curitiba — PR, 80410-210

## Estrutura

```text
src/app                         rotas públicas e administrativas
src/components                  interface e componentes de formulário
src/features                    fluxos de consulta, autenticação e gravação
src/lib/data/demo               persistência local
src/lib/data/supabase           adaptadores de produção
supabase/migrations             esquema, RLS, funções e Storage
tests/e2e                       jornadas completas no navegador
```

Os dois modos implementam os mesmos contratos assíncronos de repositório. A troca ocorre somente por `NEXT_PUBLIC_DATA_MODE`.
