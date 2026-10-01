# Incubator Hub Platform

Crie uma plataforma institucional completa para uma incubadora de empresas, inovação e empreendedorismo.

IMPORTANTE: este projeto NÃO deve ser apenas um site institucional estático.

Ele deve possuir dois ambientes integrados:

SITE PÚBLICO

PAINEL ADMINISTRATIVO/CMS

O site público será utilizado por visitantes, empreendedores, empresas, parceiros e interessados.

O painel administrativo será utilizado pelos gestores responsáveis pela manutenção do conteúdo institucional.

A referência visual e funcional é o site fornecido anteriormente, porém o novo projeto deve possuir design moderno, melhor UX/UI, melhor organização, responsividade, acessibilidade e uma arquitetura preparada para crescimento.

ARQUITETURA

Utilizar uma arquitetura moderna baseada em:

Frontend:

React

TypeScript

componentes reutilizáveis

design responsivo

Backend:

API segura

autenticação

autorização baseada em funções/permissões

Banco:

PostgreSQL

Armazenamento:

imagens;

logos;

PDFs;

documentos;

arquivos institucionais.

Caso seja utilizado Supabase, utilizar:

Supabase Auth;

PostgreSQL;

Supabase Storage;

Row Level Security;

políticas de acesso.

O conteúdo NÃO deve ficar hardcoded no frontend.

Notícias, editais, parceiros, equipe, empresas incubadas, resultados, conquistas, premiações, eventos e demais conteúdos administráveis devem ser carregados dinamicamente do banco.

AMBIENTES

SITE PÚBLICO:

/
/itnc
/itnc/parceiros
/incubacao
/hdi
/empresas-incubadas
/equipe
/resultados
/conquistas
/editais
/editais/:slug
/noticias
/noticias/:slug
/eventos
/eventos/:slug
/contato

PAINEL ADMINISTRATIVO:

/admin
/admin/login
/admin/dashboard
/admin/noticias
/admin/editais
/admin/eventos
/admin/parceiros
/admin/equipe
/admin/empresas
/admin/resultados
/admin/conquistas
/admin/premiacoes
/admin/institucional
/admin/midias
/admin/usuarios
/admin/configuracoes

PRINCÍPIO FUNDAMENTAL

O gestor deve conseguir atualizar o site sem modificar código.

Exemplo:

Gestor entra no painel
→ cria uma notícia
→ adiciona imagem
→ escreve conteúdo
→ salva como rascunho
→ publica

A notícia deve aparecer automaticamente no site público.

O mesmo princípio deve funcionar para:

editais;

eventos;

parceiros;

equipe;

empresas incubadas;

resultados;

conquistas;

premiações;

conteúdo institucional.

Não exigir conhecimento técnico do gestor.



## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
