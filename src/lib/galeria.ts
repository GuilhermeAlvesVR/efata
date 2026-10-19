import { getCollection } from 'astro:content';

const PREFIXO = '/images/galeria/';

/**
 * Caminho da versão leve de uma foto da galeria, gerada no build por src/integrations/miniaturas.mjs.
 * "p" é a miniatura, "g" a versão de tela cheia. No `npm run dev` as versões não existem, então usa a original.
 */
export function versaoDaFoto(caminho: string, versao: 'p' | 'g') {
  if (import.meta.env.DEV || !caminho.startsWith(PREFIXO)) return caminho;
  return `${PREFIXO}_${versao}/${caminho.slice(PREFIXO.length)}.webp`;
}

export async function albuns() {
  const todos = (await getCollection('galeria')).map((doc) => ({ slug: doc.id, entry: doc.data }));
  return todos.filter((a) => a.entry.fotos.length > 0).sort((a, b) => b.entry.data.localeCompare(a.entry.data));
}
