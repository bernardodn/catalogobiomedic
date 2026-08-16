# Configuração do Supabase

O projeto funciona em `demo` por padrão. Esta configuração é necessária apenas para usar autenticação, PostgreSQL e Storage reais.

## 1. Criar e preparar o projeto

1. Crie um projeto no Supabase.
2. Instale a CLI e associe o repositório:

   ```bash
   npx supabase login
   npx supabase link --project-ref SEU_PROJECT_REF
   npx supabase db push
   ```

3. Aplique o seed, se quiser começar com os mesmos 13 grupos e 18 itens da demonstração:

   ```bash
   npx supabase db reset --linked
   ```

O reset recria o banco remoto e é destrutivo. Use-o apenas em um projeto novo ou ambiente de desenvolvimento. Em produção, aplique somente as migrations e cadastre o conteúdo pelo painel.

## 2. Criar o administrador

Não existe cadastro público. No Supabase Dashboard, em **Authentication → Users**, crie o usuário administrativo. Copie o UUID gerado e execute no SQL Editor:

```sql
insert into public.profiles (id, email, name, role)
values (
  'UUID_DO_USUARIO',
  'admin@seudominio.com.br',
  'Administrador BioMedic',
  'admin'
);
```

O e-mail em `profiles` deve acompanhar o e-mail do Auth. A aplicação valida a sessão e o perfil administrativo.

## 3. Variáveis locais

Copie `.env.example` para `.env.local` e configure:

```dotenv
NEXT_PUBLIC_DATA_MODE=supabase
NEXT_PUBLIC_SUPABASE_URL=https://SEU_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=SUA_CHAVE_PUBLICAVEL
```

Use apenas a chave publicável no navegador. Chaves `service_role` nunca devem ser colocadas em variáveis `NEXT_PUBLIC_*`, no código ou no repositório.

## 4. Storage e limites

A migration cria o bucket público `catalog-images`, limitado a 5 MB e aos tipos PNG, JPEG e WebP. A leitura é pública; upload, alteração e exclusão exigem um perfil `admin`. A aplicação otimiza a imagem para WebP e armazena somente o caminho `catalog/<item-id>/<uuid>.webp`.

Confirme no Dashboard que o bucket existe e está público. Não altere as políticas do bucket para permitir escrita anônima.

## 5. Matriz manual de RLS

Valide em um projeto de homologação:

| Sessão | Ação esperada |
|---|---|
| Anônima | Lê categorias e itens ativos |
| Anônima | Não lê itens inativos e não escreve |
| Autenticada sem perfil admin | Mantém leitura pública, sem escrita |
| Admin | Lê todos os itens e realiza CRUD |
| Admin | Faz upload e exclusão no bucket |

Também execute, com o ambiente local do Supabase ativo:

```bash
npx supabase db reset
npx supabase db lint --local --level error
```

O proxy protege as páginas administrativas, mas as políticas RLS no banco são a autoridade final.
