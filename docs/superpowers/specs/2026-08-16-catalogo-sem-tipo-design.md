# Catálogo BioMedic sem distinção entre produto e ativo

## Objetivo

Simplificar o catálogo para que todos os 18 cadastros sejam tratados como itens, sem classificação entre produto e ativo. A remoção abrange interface pública, painel administrativo, domínio, persistência demo e Supabase.

## Escopo funcional

- Manter os 18 itens e as 13 categorias atuais.
- Remover o filtro público de tipo.
- Remover os selos “Ativo” e “Produto” dos cards e listagens.
- Remover o campo “Tipo” do formulário administrativo.
- Remover as colunas e estatísticas que representam a natureza produto/ativo.
- Preservar `active` exclusivamente como estado de visibilidade: ativo significa visível no catálogo público; inativo significa oculto.
- Ajustar textos de SEO, cabeçalhos e documentação que apresentem o catálogo como “produtos e ativos”.

## Modelo e contratos

`CatalogItem` e `CatalogItemInput` deixam de possuir `type`. `CatalogQuery` deixa de aceitar filtro de tipo. `CatalogStats` passa a conter apenas `total`, `enabled` e os dados de categoria continuam sendo obtidos pelo repositório de categorias.

Os repositórios demo e Supabase mantêm as mesmas operações assíncronas. Busca, ordenação, paginação, categorias, imagens e CRUD permanecem inalterados, exceto pela ausência do campo e filtro removidos.

## Interface

No catálogo público, os controles exibem somente categoria e ordenação. Os cards mostram categoria, nome, descrição, imagem e palavras-chave.

No painel, a visão geral exibe total de itens, categorias e itens visíveis. A listagem administrativa mantém categoria, visibilidade e ações. O formulário contém nome, categoria, descrição, palavras-chave, imagem e controle de visibilidade.

Os registros atuais chamados “Complexo B”, “Probiótico 10 Bilhões”, “Fórmula Imunidade” e “Recovery Performance” permanecem como itens comuns, assim como todos os demais.

## Persistência demo

O schema Zod e o seed local removem `type`. Como o banco demo vive no navegador, sua versão será incrementada. Ao encontrar dados da versão anterior, a leitura migrará os registros preservando todos os campos restantes, em vez de apagar alterações do usuário.

A restauração de demonstração continuará recriando os mesmos 18 itens e 13 categorias já sem o campo removido.

## Supabase

Uma nova migration, posterior à migration inicial, fará a mudança sem reescrever o histórico:

1. substituir `search_catalog_items` por uma assinatura sem `p_type`;
2. atualizar funções e triggers de `search_document` para não incluir tipo;
3. remover índices relacionados ao tipo;
4. remover `catalog_items.type`;
5. remover o enum `catalog_item_type` quando não houver mais dependências.

RLS, Storage e perfis administrativos não mudam. O seed final deixa de inserir a coluna removida. Projetos novos aplicam a migration inicial e, em seguida, a migration de remoção.

## Erros e compatibilidade

- Dados demo antigos são migrados de forma determinística e mantêm IDs, imagens, categorias, datas e visibilidade.
- Respostas Supabase incompatíveis devem falhar de modo explícito nos mapeadores, sem preencher valores fictícios.
- URLs antigas com `type=active` ou `type=product` serão normalizadas para a mesma consulta sem tipo; o parâmetro será removido na próxima atualização de URL.

## Verificação

- Testes de domínio comprovam a migração do banco demo e consultas sem tipo.
- Testes de componentes comprovam a ausência de filtros, selos, estatísticas e campo de formulário.
- Testes de repositório e garantias estáticas validam a nova função SQL e a remoção da coluna.
- Playwright percorre busca pública, categoria, CRUD administrativo, visibilidade e restauração.
- A verificação final executa lint, TypeScript, Vitest, Playwright e build de produção.

## Fora do escopo

- Alterar categorias existentes.
- Renomear os 18 itens atuais.
- Adicionar comércio, preços ou páginas individuais.
- Alterar autenticação, contatos ou regras de imagem.
