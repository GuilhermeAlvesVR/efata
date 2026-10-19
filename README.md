# Site do Ministério Efatá — Sarando a Terra Ferida

Site da igreja feito com [Astro](https://astro.build) e painel administrativo [Keystatic](https://keystatic.com).
O conteúdo (cultos, eventos, ministérios, mensagens, Pix…) é editado pelo painel em `/keystatic`, sem mexer em código.

## Rodar no computador

Precisa do [Node.js](https://nodejs.org) 22 ou mais novo.

```bash
npm install
npm run dev
```

- Site: http://127.0.0.1:4321
- Painel: http://127.0.0.1:4321/keystatic

No computador, o painel salva direto nos arquivos de `src/content/`.

## O que dá para editar no painel

| Seção | O que é |
| --- | --- |
| Configurações gerais | Nome, slogan, endereço, WhatsApp, e-mail, Instagram, YouTube, Facebook |
| Quem somos | Missão, visão, versículo de destaque e a história do ministério |
| Cultos | Dias e horários |
| Contribua | Chave Pix (o QR Code é gerado sozinho) e dados bancários |
| Liderança | Pastores e líderes, com foto |
| Eventos | Agenda. Eventos com data passada saem sozinhos de "Próximos eventos" |
| Ministérios | Louvor, jovens, kids etc. |
| Mensagens | Pregações: basta colar o link do vídeo do YouTube |

Campos deixados vazios simplesmente não aparecem no site (ex.: sem WhatsApp, o botão verde some).

> **Antes de publicar:** os textos marcados com `[EXEMPLO]` e os eventos "(Exemplo)" são provisórios.
> Troque ou apague pelo painel.

## Publicar de graça na Vercel

1. **GitHub** — crie um repositório (pode ser privado) e envie este projeto:
   ```bash
   git add -A
   git commit -m "Site da igreja"
   git branch -M main
   git remote add origin https://github.com/GuilhermeAlvesVR/efata.git
   git push -u origin main
   ```
2. **Vercel** — em [vercel.com](https://vercel.com), entre com a conta do GitHub → *Add New → Project* → escolha o repositório → *Deploy*.
   O site fica no ar em um endereço `*.vercel.app`.
3. **Painel online (Keystatic + GitHub)** — para editar pelo site publicado:
   1. Na Vercel, em *Settings → Environment Variables*, crie `PUBLIC_KEYSTATIC_REPO` com o valor `GuilhermeAlvesVR/efata`.
   2. Rode o projeto no computador com essa mesma variável em um arquivo `.env` (veja `.env.example`) e abra `/keystatic`.
      O Keystatic vai oferecer **criar um GitHub App**. Siga as instruções; ao final ele preenche no `.env` as variáveis
      `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET` e `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`.
   3. Copie essas quatro variáveis para a Vercel e faça um novo deploy.
   4. Nas configurações do GitHub App, adicione a URL de callback do site publicado:
      `https://www.efatavr.com.br/api/keystatic/github/oauth/callback`.
   5. Quem for editar precisa de uma conta no GitHub com acesso ao repositório.

   A partir daí, cada alteração salva em `https://www.efatavr.com.br/keystatic` vira um commit no GitHub,
   e a Vercel republica o site sozinha em cerca de 1 minuto.

4. **Domínio próprio (opcional)** — registre um domínio `.com.br` no [Registro.br](https://registro.br) (cerca de R$ 40/ano),
   adicione-o na Vercel em *Settings → Domains* e defina a variável `SITE_URL` com o endereço final.

## Estrutura

```
keystatic.config.ts   # campos do painel
src/content/          # conteúdo salvo pelo painel
src/lib/conteudo.ts   # leitura do conteúdo, datas, WhatsApp, Pix
src/pages/            # páginas do site
src/components/       # partes reutilizáveis (cabeçalho, cards, vídeo, mapa…)
src/styles/global.css # cores e fontes da identidade visual
src/assets/logo.jpeg  # logo (também gera o favicon e a imagem de compartilhamento)
```

Para mudar as cores, edite as variáveis no topo de `src/styles/global.css`.
