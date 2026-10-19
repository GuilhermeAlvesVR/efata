// Coleções de conteúdo. Os arquivos em src/content/ são editados pelo painel Pages CMS
// (configurado em .pages.yml); estes schemas precisam acompanhar os campos de lá.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/** Texto opcional: o painel pode gravar vazio, null ou omitir o campo. */
const texto = z
  .string()
  .nullish()
  .transform((v) => v?.trim() ?? '');

/** Caminho de imagem opcional ("/images/..."), ou null quando vazio. */
const imagem = z
  .string()
  .nullish()
  .transform((v) => v?.trim() || null);

/** Data no formato AAAA-MM-DD, aceitando tanto texto quanto data do YAML. */
const data = z.coerce.date().transform((d) => d.toISOString().slice(0, 10));

const ordem = z.coerce.number().nullish().transform((v) => v ?? 1);

const arquivo = (nome: string) => glob({ pattern: nome, base: './src/content' });
const pasta = (pasta: string, extensao: string) =>
  glob({ pattern: `*.${extensao}`, base: `./src/content/${pasta}` });

const configuracoes = defineCollection({
  loader: arquivo('configuracoes.yaml'),
  schema: z.object({
    nome: texto,
    slogan: texto,
    descricao: texto,
    endereco: texto,
    whatsapp: texto,
    email: texto,
    instagram: texto,
    youtube: texto,
    facebook: texto,
  }),
});

const sobre = defineCollection({
  loader: arquivo('sobre.md'),
  schema: z.object({
    titulo: texto,
    missao: texto,
    visao: texto,
    versiculo: texto,
    referencia: texto,
  }),
});

const cultos = defineCollection({
  loader: arquivo('cultos.yaml'),
  schema: z.object({
    horarios: z
      .array(z.object({ dia: z.string(), hora: texto, nome: texto }))
      .nullish()
      .transform((v) => v ?? []),
    observacao: texto,
  }),
});

const contribua = defineCollection({
  loader: arquivo('contribua.yaml'),
  schema: z.object({
    texto: texto,
    pixChave: texto,
    pixNome: texto,
    pixCidade: texto,
    banco: texto,
  }),
});

const aovivo = defineCollection({
  loader: arquivo('aovivo.yaml'),
  schema: z.object({
    ativo: z.boolean().nullish().transform((v) => v ?? false),
    texto: texto,
    link: texto,
  }),
});

const lideranca = defineCollection({
  loader: pasta('lideranca', 'yaml'),
  schema: z.object({ nome: z.string(), cargo: texto, foto: imagem, ordem }),
});

const eventos = defineCollection({
  loader: pasta('eventos', 'md'),
  schema: z.object({
    titulo: z.string(),
    data,
    horario: texto,
    local: texto,
    imagem,
    resumo: texto,
  }),
});

const ministerios = defineCollection({
  loader: pasta('ministerios', 'md'),
  schema: z.object({
    nome: z.string(),
    lider: texto,
    encontros: texto,
    imagem,
    resumo: texto,
    ordem,
  }),
});

const mensagens = defineCollection({
  loader: pasta('mensagens', 'yaml'),
  schema: z.object({
    titulo: z.string(),
    pregador: texto,
    data,
    youtube: z.string(),
    resumo: texto,
  }),
});

const galeria = defineCollection({
  loader: pasta('galeria', 'yaml'),
  schema: z.object({
    titulo: z.string(),
    data,
    descricao: texto,
    // O painel grava uma lista de caminhos; aceita também uma foto só ou vazio.
    fotos: z
      .union([z.array(z.string().nullish()), z.string()])
      .nullish()
      .transform((v) => (Array.isArray(v) ? v : v ? [v] : []).filter((f): f is string => Boolean(f?.trim()))),
  }),
});

export const collections = {
  configuracoes,
  sobre,
  cultos,
  contribua,
  aovivo,
  lideranca,
  eventos,
  ministerios,
  mensagens,
  galeria,
};
