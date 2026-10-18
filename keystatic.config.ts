import { config, fields, collection, singleton } from '@keystatic/core';

const repo = import.meta.env.PUBLIC_KEYSTATIC_REPO as `${string}/${string}` | undefined;

const imagem = (rotulo: string, pasta: string) =>
  fields.image({
    label: rotulo,
    directory: `public/images/${pasta}`,
    publicPath: `/images/${pasta}/`,
  });

export default config({
  // Em produção (com PUBLIC_KEYSTATIC_REPO definido) o painel salva direto no GitHub;
  // no computador, salva nos arquivos locais.
  storage: repo ? { kind: 'github', repo } : { kind: 'local' },
  ui: {
    brand: { name: 'Efatá — Painel' },
    navigation: {
      Igreja: ['configuracoes', 'sobre', 'cultos', 'contribua', 'lideranca'],
      Conteúdo: ['eventos', 'ministerios', 'mensagens'],
    },
  },
  singletons: {
    configuracoes: singleton({
      label: 'Configurações gerais',
      path: 'src/content/configuracoes',
      format: { data: 'yaml' },
      schema: {
        nome: fields.text({ label: 'Nome da igreja', defaultValue: 'Ministério Efatá' }),
        slogan: fields.text({ label: 'Slogan', defaultValue: 'Sarando a Terra Ferida' }),
        descricao: fields.text({
          label: 'Descrição curta (aparece no Google e ao compartilhar o link)',
          multiline: true,
        }),
        endereco: fields.text({ label: 'Endereço completo', multiline: true }),
        whatsapp: fields.text({
          label: 'WhatsApp',
          description: 'Só números, com DDI e DDD. Ex.: 5511999998888',
        }),
        email: fields.text({ label: 'E-mail' }),
        instagram: fields.url({ label: 'Instagram (link)' }),
        youtube: fields.url({ label: 'YouTube (link do canal)' }),
        facebook: fields.url({ label: 'Facebook (link)' }),
      },
    }),
    sobre: singleton({
      label: 'Quem somos',
      path: 'src/content/sobre',
      format: { contentField: 'texto' },
      schema: {
        titulo: fields.text({ label: 'Título', defaultValue: 'Quem somos' }),
        missao: fields.text({ label: 'Missão', multiline: true }),
        visao: fields.text({ label: 'Visão', multiline: true }),
        versiculo: fields.text({ label: 'Versículo de destaque', multiline: true }),
        referencia: fields.text({ label: 'Referência do versículo (ex.: Marcos 7:34)' }),
        texto: fields.markdoc({ label: 'Nossa história' }),
      },
    }),
    cultos: singleton({
      label: 'Cultos',
      path: 'src/content/cultos',
      format: { data: 'yaml' },
      schema: {
        horarios: fields.array(
          fields.object({
            dia: fields.select({
              label: 'Dia',
              defaultValue: 'domingo',
              options: [
                { label: 'Domingo', value: 'domingo' },
                { label: 'Segunda-feira', value: 'segunda' },
                { label: 'Terça-feira', value: 'terca' },
                { label: 'Quarta-feira', value: 'quarta' },
                { label: 'Quinta-feira', value: 'quinta' },
                { label: 'Sexta-feira', value: 'sexta' },
                { label: 'Sábado', value: 'sabado' },
              ],
            }),
            hora: fields.text({ label: 'Horário (ex.: 19h30)' }),
            nome: fields.text({ label: 'Nome do culto (ex.: Culto da Família)' }),
          }),
          {
            label: 'Horários',
            itemLabel: (p) => `${p.fields.dia.value} — ${p.fields.hora.value} ${p.fields.nome.value}`,
          }
        ),
        observacao: fields.text({ label: 'Observação (opcional)', multiline: true }),
      },
    }),
    contribua: singleton({
      label: 'Contribua (dízimos e ofertas)',
      path: 'src/content/contribua',
      format: { data: 'yaml' },
      schema: {
        texto: fields.text({ label: 'Texto de introdução', multiline: true }),
        pixChave: fields.text({
          label: 'Chave Pix',
          description: 'CNPJ, e-mail, telefone (+55...) ou chave aleatória. Deixe vazio para ocultar o Pix.',
        }),
        pixNome: fields.text({
          label: 'Nome do recebedor (como aparece no banco)',
          description: 'Até 25 caracteres, sem acentos de preferência.',
        }),
        pixCidade: fields.text({ label: 'Cidade do recebedor', description: 'Até 15 caracteres.' }),
        banco: fields.text({ label: 'Dados bancários (opcional)', multiline: true }),
      },
    }),
  },
  collections: {
    lideranca: collection({
      label: 'Liderança',
      slugField: 'nome',
      path: 'src/content/lideranca/*',
      format: { data: 'yaml' },
      schema: {
        nome: fields.slug({ name: { label: 'Nome' } }),
        cargo: fields.text({ label: 'Cargo (ex.: Pastor presidente)' }),
        foto: imagem('Foto', 'lideranca'),
        ordem: fields.integer({ label: 'Ordem de exibição', defaultValue: 1 }),
      },
    }),
    eventos: collection({
      label: 'Eventos',
      slugField: 'titulo',
      path: 'src/content/eventos/*',
      format: { contentField: 'descricao' },
      columns: ['titulo', 'data'],
      schema: {
        titulo: fields.slug({ name: { label: 'Título' } }),
        data: fields.date({ label: 'Data', validation: { isRequired: true } }),
        horario: fields.text({ label: 'Horário (ex.: 19h30)' }),
        local: fields.text({ label: 'Local (deixe vazio se for na igreja)' }),
        imagem: imagem('Imagem / cartaz', 'eventos'),
        resumo: fields.text({ label: 'Resumo (uma ou duas frases)', multiline: true }),
        descricao: fields.markdoc({ label: 'Descrição completa' }),
      },
    }),
    ministerios: collection({
      label: 'Ministérios',
      slugField: 'nome',
      path: 'src/content/ministerios/*',
      format: { contentField: 'descricao' },
      schema: {
        nome: fields.slug({ name: { label: 'Nome' } }),
        lider: fields.text({ label: 'Líder(es)' }),
        encontros: fields.text({ label: 'Quando se reúne (ex.: Sábados, 16h)' }),
        imagem: imagem('Imagem', 'ministerios'),
        resumo: fields.text({ label: 'Resumo (uma ou duas frases)', multiline: true }),
        ordem: fields.integer({ label: 'Ordem de exibição', defaultValue: 1 }),
        descricao: fields.markdoc({ label: 'Descrição completa' }),
      },
    }),
    mensagens: collection({
      label: 'Mensagens (pregações)',
      slugField: 'titulo',
      path: 'src/content/mensagens/*',
      format: { data: 'yaml' },
      columns: ['titulo', 'data'],
      schema: {
        titulo: fields.slug({ name: { label: 'Título' } }),
        pregador: fields.text({ label: 'Pregador(a)' }),
        data: fields.date({ label: 'Data', validation: { isRequired: true } }),
        youtube: fields.url({
          label: 'Link do vídeo no YouTube',
          validation: { isRequired: true },
        }),
        resumo: fields.text({ label: 'Resumo (opcional)', multiline: true }),
      },
    }),
  },
});
