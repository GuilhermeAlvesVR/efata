// Gera, no fim do build, versões leves das fotos da galeria enviadas pelo painel.
// As fotos originais (que podem ter vários MB) continuam em /images/galeria/;
// as versões em WebP ficam em /images/galeria/_p/ (miniatura) e /_g/ (tela cheia).
// O caminho de cada versão é calculado por versaoDaFoto() em src/lib/galeria.ts.
import { readdir, mkdir } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

export const TAMANHOS = { p: 640, g: 1800 };
const EXTENSOES = /\.(jpe?g|png|webp|avif|heic|heif|tiff?)$/i;

async function listar(pasta) {
  const itens = await readdir(pasta, { withFileTypes: true }).catch(() => []);
  const arquivos = await Promise.all(
    itens.map((i) => {
      const caminho = join(pasta, i.name);
      if (i.isDirectory()) return i.name.startsWith('_') ? [] : listar(caminho);
      return EXTENSOES.test(i.name) ? [caminho] : [];
    })
  );
  return arquivos.flat();
}

export default function miniaturas() {
  return {
    name: 'miniaturas-da-galeria',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const raiz = join(fileURLToPath(dir), 'images', 'galeria');
        const fotos = await listar(raiz);
        for (const foto of fotos) {
          const nome = relative(raiz, foto);
          for (const [versao, largura] of Object.entries(TAMANHOS)) {
            const destino = join(raiz, `_${versao}`, `${nome}.webp`);
            await mkdir(dirname(destino), { recursive: true });
            await sharp(foto)
              .rotate() // respeita a orientação gravada pelo celular
              .resize({ width: largura, height: largura, fit: 'inside', withoutEnlargement: true })
              .webp({ quality: versao === 'p' ? 72 : 80 })
              .toFile(destino);
          }
        }
        logger.info(`${fotos.length} foto(s) da galeria otimizada(s).`);
      },
    },
  };
}
