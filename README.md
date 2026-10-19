# Site do Ministério Efatá — Sarando a Terra Ferida

Site da igreja feito com [Astro](https://astro.build), publicado em https://www.efatavr.com.br.
O conteúdo (cultos, eventos, ministérios, mensagens, Pix…) é editado pelo painel [Pages CMS](https://pagescms.org),
sem mexer em código. Quem edita **não precisa ter conta no GitHub**: basta ser convidado por e-mail.

## Painel de edição (Pages CMS)

Endereço: **https://app.pagescms.org**

### Configuração inicial (uma vez só, feita pelo dono do repositório)
1. Entre em https://app.pagescms.org com a conta do GitHub **GuilhermeAlvesVR**.
2. Instale o GitHub App do Pages CMS e dê acesso ao repositório **efata**.
3. Abra o repositório **efata**. O painel lê a configuração do arquivo `.pages.yml` e mostra as seções "Igreja" e "Conteúdo".

### Convidar quem vai editar
No Pages CMS, abra o repositório **efata** e vá em **Collaborators** (Colaboradores). Digite o e-mail da pessoa e envie o convite.
Ela recebe o convite, entra pelo e-mail e já pode editar o conteúdo e as imagens. Não precisa ter conta no GitHub.

Os convidados não mudam a configuração do painel nem convidam outras pessoas; isso fica com o dono do repositório.

### Como as alterações chegam ao site
Cada **Save** no painel grava a alteração no GitHub, e a Vercel republica o site sozinha em cerca de 1 minuto.

## O que dá para editar no painel

| Seção | O que é |
| --- | --- |
| Configurações gerais | Nome, slogan, endereço, WhatsApp, e-mail, Instagram, YouTube, Facebook |
| Quem somos | Missão, visão, versículo de destaque e a história do ministério |
| Cultos | Dias e horários |
| Contribua | Chave Pix (o QR Code é gerado sozinho) e dados bancários |
| Liderança | Pastores e líderes, com foto |
| Eventos | Agenda com cartaz. No dia aparece "É hoje!", e depois o evento vai para "Eventos anteriores" sozinho |
| Ministérios | Louvor, jovens, kids etc. |
| Mensagens | Pregações: basta colar o link do vídeo do YouTube |

Campos deixados vazios simplesmente não aparecem no site (ex.: sem WhatsApp, o botão verde some).

> Os textos marcados com `[EXEMPLO]` são provisórios. Troque pelo painel.

## Rodar no computador

Precisa do [Node.js](https://nodejs.org) 22 ou mais novo.

```bash
npm install
npm run dev
```

O site abre em http://localhost:4321. Para editar o conteúdo, use o painel online: ele grava no GitHub.
Antes de mexer no código, rode `git pull` para trazer as alterações feitas pelo painel.

## Publicação

- **Vercel** — o projeto `efata` na Vercel publica automaticamente a cada alteração na branch `main` do GitHub.
- **Domínio** — `efatavr.com.br`, registrado no [Registro.br](https://registro.br), com DNS do próprio Registro.br
  (registro A para a Vercel e CNAME `www` → `cname.vercel-dns.com`).

## Estrutura

```
.pages.yml             # campos do painel Pages CMS
src/content/           # conteúdo salvo pelo painel
src/content.config.ts  # formato de cada tipo de conteúdo (precisa acompanhar o .pages.yml)
src/lib/conteudo.ts    # leitura do conteúdo, datas, WhatsApp, Pix
src/pages/             # páginas do site
src/components/        # partes reutilizáveis (cabeçalho, cards, vídeo, mapa…)
src/styles/global.css  # cores e fontes da identidade visual
src/assets/logo.jpeg   # logo (também gera o favicon e a imagem de compartilhamento)
public/images/         # imagens enviadas pelo painel
```

Para mudar as cores, edite as variáveis no topo de `src/styles/global.css`.
