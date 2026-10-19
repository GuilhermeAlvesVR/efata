import { getCollection, type CollectionKey } from 'astro:content';

/** Lê uma coleção no formato { slug, entry (os campos), doc (para renderizar o texto) }. */
async function ler<C extends CollectionKey>(colecao: C) {
  return (await getCollection(colecao)).map((doc) => ({ slug: doc.id, entry: doc.data, doc }));
}

/** Coleções de um arquivo só (configurações, cultos…): devolve o único item, se existir. */
async function unico<C extends CollectionKey>(colecao: C) {
  return (await ler(colecao))[0];
}

export async function configuracoes() {
  const c = (await unico('configuracoes'))?.entry;
  return {
    nome: c?.nome || 'Ministério Efatá',
    slogan: c?.slogan || '',
    descricao: c?.descricao || '',
    endereco: c?.endereco || '',
    whatsapp: (c?.whatsapp || '').replace(/\D/g, ''),
    email: c?.email || '',
    instagram: c?.instagram || '',
    youtube: c?.youtube || '',
    facebook: c?.facebook || '',
  };
}

export async function sobre() {
  return unico('sobre');
}

export async function contribua() {
  return (await unico('contribua'))?.entry;
}

/** Data de hoje (fuso de Brasília) no formato YYYY-MM-DD, igual ao salvo pelo painel. */
export function hojeISO() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(new Date());
}

export function formatarData(iso: string, opcoes: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo', ...opcoes });
}

export const NOMES_DIAS: Record<string, string> = {
  domingo: 'Domingo',
  segunda: 'Segunda-feira',
  terca: 'Terça-feira',
  quarta: 'Quarta-feira',
  quinta: 'Quinta-feira',
  sexta: 'Sexta-feira',
  sabado: 'Sábado',
};
export const DIAS_CURTOS: Record<string, string> = {
  domingo: 'Domingo',
  segunda: 'Segunda',
  terca: 'Terça',
  quarta: 'Quarta',
  quinta: 'Quinta',
  sexta: 'Sexta',
  sabado: 'Sábado',
};
const ORDEM_DIAS = Object.keys(NOMES_DIAS);

export async function cultos() {
  const c = (await unico('cultos'))?.entry;
  const horarios = [...(c?.horarios ?? [])].sort(
    (a, b) => ORDEM_DIAS.indexOf(a.dia) - ORDEM_DIAS.indexOf(b.dia) || a.hora.localeCompare(b.hora)
  );
  return { horarios, observacao: c?.observacao || '' };
}

export async function eventos() {
  const todos = await ler('eventos');
  return todos.sort((a, b) => a.entry.data.localeCompare(b.entry.data) || minutos(a.entry.horario) - minutos(b.entry.horario));
}

/** "9h" → 540, "19h30" → 1170; sem horário vai para o fim do dia. */
function minutos(horario = '') {
  const m = horario.match(/(\d{1,2})\s*(?:h|:)\s*(\d{2})?/i);
  return m ? Number(m[1]) * 60 + Number(m[2] ?? 0) : 24 * 60;
}

export async function mensagens() {
  const todas = await ler('mensagens');
  return todas.sort((a, b) => b.entry.data.localeCompare(a.entry.data));
}

export async function ministerios() {
  const todos = await ler('ministerios');
  return todos.sort((a, b) => a.entry.ordem - b.entry.ordem || a.entry.nome.localeCompare(b.entry.nome));
}

export async function lideranca() {
  const todos = await ler('lideranca');
  return todos.sort((a, b) => a.entry.ordem - b.entry.ordem);
}

export function youtubeId(url: string) {
  const m = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/|live\/)([\w-]{11})/);
  return m?.[1] ?? null;
}

export function linkWhatsApp(numero: string, texto = 'Olá! Vim pelo site da igreja.') {
  return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
}

/** Monta o código "Pix copia e cola" (BR Code estático, padrão do Banco Central). */
export function codigoPix(chave: string, nome: string, cidade: string) {
  const limpar = (s: string, max: number) =>
    s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^\w @.\-+]/g, '').trim().slice(0, max);
  const campo = (id: string, valor: string) => `${id}${String(valor.length).padStart(2, '0')}${valor}`;

  const conta = campo('00', 'br.gov.bcb.pix') + campo('01', chave.trim());
  const corpo =
    campo('00', '01') +
    campo('26', conta) +
    campo('52', '0000') +
    campo('53', '986') +
    campo('58', 'BR') +
    campo('59', limpar(nome, 25) || 'IGREJA') +
    campo('60', limpar(cidade, 15) || 'BRASIL') +
    campo('62', campo('05', '***')) +
    '6304';

  let crc = 0xffff;
  for (let i = 0; i < corpo.length; i++) {
    crc ^= corpo.charCodeAt(i) << 8;
    for (let b = 0; b < 8; b++) crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
  }
  return corpo + crc.toString(16).toUpperCase().padStart(4, '0');
}
